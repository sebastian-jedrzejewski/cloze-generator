import torch
from torch import nn
from transformers import (
    ElectraPreTrainedModel,
    ElectraModel,
    ElectraConfig,
    ElectraForMaskedLM,
)
from transformers.modeling_outputs import TokenClassifierOutput

from cloze_generator.model.constants import id2label, label2id


class BaseElectra(ElectraPreTrainedModel):
    def __init__(self, config):
        super().__init__(config)

        self.num_labels = config.num_labels

        self.discriminator = ElectraModel.from_pretrained(
            "google/electra-base-discriminator"
        )  # first branch
        classifier_dropout = (
            self.discriminator.config.classifier_dropout
            if self.discriminator.config.classifier_dropout is not None
            else self.discriminator.config.hidden_dropout_prob
        )
        self.dropout = nn.Dropout(classifier_dropout)
        self.discriminator_linear = nn.Linear(
            self.discriminator.config.hidden_size, self.num_labels
        )

        self.generator_config = ElectraConfig.from_pretrained(
            "google/electra-base-generator"
        )  # second branch
        self.generator_config.output_hidden_states = True
        self.generator = ElectraForMaskedLM.from_pretrained(
            "google/electra-base-generator", config=self.generator_config
        )

        self.post_init()

    def forward(
        self,
        input_ids=None,
        attention_mask=None,
        token_type_ids=None,
        position_ids=None,
        head_mask=None,
        inputs_embeds=None,
        labels=None,
        output_attentions=None,
        output_hidden_states=None,
        return_dict=None,
    ):
        return_dict = (
            return_dict if return_dict is not None else self.config.use_return_dict
        )

        discriminator_hidden_states = self.discriminator(
            input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids,
            position_ids=position_ids,
            head_mask=head_mask,
            inputs_embeds=inputs_embeds,
            output_attentions=output_attentions,
            output_hidden_states=output_hidden_states,
            return_dict=return_dict,
        )
        discriminator_last_hidden_state = discriminator_hidden_states.last_hidden_state
        discriminator_logits = self.dropout(discriminator_last_hidden_state)
        discriminator_logits = self.discriminator_linear(discriminator_logits)

        generator_logits = self.generator(
            input_ids=self.masked_input_ids(discriminator_logits, input_ids),
            attention_mask=attention_mask,
        ).logits

        result_loss = None
        if labels is not None:
            result_loss = self.compute_loss(
                input_ids, discriminator_logits, generator_logits, labels
            )

        if not return_dict:
            output = (discriminator_logits,) + discriminator_hidden_states[1:]
            return ((result_loss,) + output) if result_loss is not None else output

        return TokenClassifierOutput(
            loss=result_loss,
            logits=discriminator_logits,
            hidden_states=discriminator_hidden_states.hidden_states,
            attentions=discriminator_hidden_states.attentions,
        )

    def masked_input_ids(self, discriminator_logits, input_ids):
        from cloze_generator.model.apps import ModelConfig

        preds = torch.argmax(discriminator_logits, dim=-1)
        mask = preds == 1
        masked_input_ids = input_ids.clone()
        masked_input_ids[mask] = ModelConfig.tokenizer.mask_token_id
        return masked_input_ids

    def generator_labels(self, discriminator_logits, input_ids):
        preds = torch.argmax(discriminator_logits, dim=-1)
        mask = preds == 1
        generator_labels = input_ids.clone()
        generator_labels[~mask] = -100
        return generator_labels

    def compute_loss(self, input_ids, discriminator_logits, generator_logits, labels):
        raise NotImplementedError()


class MultiObjectiveElectra(BaseElectra):
    def __init__(self, config):
        electra_config = ElectraConfig.from_pretrained(
            "google/electra-base-discriminator",
            num_labels=len(id2label),
            id2label=id2label,
            label2id=label2id,
        )
        super().__init__(electra_config)

        self.W = 3.0
        self.D = 4

    def compute_loss(self, input_ids, discriminator_logits, generator_logits, labels):
        loss = nn.CrossEntropyLoss()
        discriminator_loss_fn = nn.CrossEntropyLoss(reduction="none")

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        tokens_gaps_distances = (self.tokens_gaps_distances(labels)).view(-1).to(device)
        mask = (tokens_gaps_distances != -100).view(-1)
        discriminator_loss = discriminator_loss_fn(
            discriminator_logits.view(-1, 2), labels.view(-1)
        )
        discriminator_loss[mask] = discriminator_loss[mask] * (
            self.W / tokens_gaps_distances[mask]
        )
        discriminator_loss = discriminator_loss[discriminator_loss != 0].mean()

        generator_labels = self.generator_labels(discriminator_logits, input_ids)
        valid_labels_exist = (generator_labels != -100).any()
        generator_loss = loss(
            generator_logits.view(-1, self.generator_config.vocab_size),
            generator_labels.view(-1),
        )

        result_loss = (
            discriminator_loss + generator_loss
            if valid_labels_exist
            else discriminator_loss + 0.0
        )
        return result_loss

    def tokens_gaps_distances(self, labels):
        tokens_gaps_distances = torch.full(labels.size(), -100, dtype=int)

        for i, row in enumerate(labels):
            for j, label in enumerate(row):
                if label == 1:
                    for k in range(-(self.D) + 1, self.D):
                        if j + k < 0 or j + k >= len(row):
                            continue
                        if labels[i, j + k] != 1:
                            new_distance = abs(k)
                            if (
                                tokens_gaps_distances[i, j + k] == -100
                                or tokens_gaps_distances[i, j + k] > new_distance
                            ):
                                tokens_gaps_distances[i, j + k] = new_distance

        return tokens_gaps_distances
