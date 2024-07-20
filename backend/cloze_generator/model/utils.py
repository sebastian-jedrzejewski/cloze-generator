import numpy as np
import random
import torch
import torch.nn.functional as F
from django.conf import settings

from cloze_generator.model.constants import id2label
from cloze_generator.model.electra import MultiObjectiveElectra


def load_model(model_path):
    model = MultiObjectiveElectra()
    model.load_state_dict(torch.load(model_path))
    return model


def pipeline(model_path):
    loaded_model = load_model(model_path)

    def pipe(text):
        from cloze_generator.model.apps import ModelConfig

        inputs = ModelConfig.tokenizer(
            text, return_tensors="pt", truncation=True, return_offsets_mapping=True
        )
        input_ids = inputs["input_ids"]
        attention_mask = inputs["attention_mask"]
        offset_mapping = inputs["offset_mapping"][0]
        result = []

        with torch.no_grad():
            logits = loaded_model(
                input_ids=input_ids, attention_mask=attention_mask
            ).logits
        probs = F.softmax(logits[0], dim=-1)
        for idx, (token_id, word_id) in enumerate(zip(input_ids[0], inputs.word_ids())):
            if word_id is None:
                continue
            result.append(
                {
                    "entity": id2label[np.argmax(logits[0][idx]).item()],
                    "score": torch.max(probs[idx]).item(),
                    "index": idx,
                    "word": ModelConfig.tokenizer.decode(token_id),
                    "start": offset_mapping[idx][0].item(),
                    "end": offset_mapping[idx][1].item(),
                }
            )
        return result

    return pipe


threshold = 0.3


def post_processing(model_path):
    pipe = pipeline(model_path)

    def is_alternative_good(alternative, predicted_gaps, gap_to_compare=None):
        # Check if an alternative is a repetition of an already predicted gap
        if alternative["word"] in [g["word"] for g in predicted_gaps]:
            return False
        # Check if an alternative's distance to other gaps is at least 4
        is_too_close = False
        for g in predicted_gaps:
            gap_index_different = (
                gap_to_compare["index"] != g["index"] if gap_to_compare else True
            )
            if gap_index_different and abs(alternative["index"] - g["index"]) < 4:
                is_too_close = True
        if is_too_close:
            return False

        return True

    def post_process(text, n_gaps=9):
        model_predictions = pipe(text)
        predicted_gaps = sorted(
            [pred for pred in model_predictions if pred["entity"] == "GAP"],
            key=lambda x: x["score"],
            reverse=True,
        )
        if n_gaps is None:
            n_gaps = len(predicted_gaps)
        alternatives = sorted(
            [
                pred
                for pred in model_predictions
                if pred["entity"] == "NOT-GAP" and 1.0 - pred["score"] >= threshold
            ],
            key=lambda x: x["score"],
        )
        for alternative in alternatives:
            alternative["entity"] = "GAP"
            alternative["score"] = 1.0 - alternative["score"]

        if len(predicted_gaps) > n_gaps:
            predicted_gaps = predicted_gaps[:n_gaps]
            alternatives = predicted_gaps[n_gaps:] + alternatives
        elif len(predicted_gaps) < n_gaps:
            removed_alternative_indices = []
            for j, alternative in enumerate(alternatives):
                if not is_alternative_good(alternative, predicted_gaps):
                    continue

                predicted_gaps.append(alternative)
                removed_alternative_indices.append(alternative["index"])
                if len(predicted_gaps) == n_gaps:
                    break

            alternatives = [
                alternative
                for alternative in alternatives
                if alternative["index"] not in removed_alternative_indices
            ]

        if len(predicted_gaps) != n_gaps:
            # print(
            #     f"Warning: it's not possible to generate {n_gaps} gaps
            #     for this text to maintain good quality of a test."
            # )
            return sorted(predicted_gaps, key=lambda x: x["index"]), sorted(
                alternatives, key=lambda x: x["index"]
            )

        random_order = list(range(n_gaps))
        random.shuffle(random_order)

        for i in random_order:
            # Check if predicted gap at index i is a repetition of another gap
            gap = predicted_gaps[i]
            if gap["word"] in [
                g["word"] for g in predicted_gaps if g["index"] != gap["index"]
            ]:
                for j, alternative in enumerate(alternatives):
                    if not is_alternative_good(alternative, predicted_gaps, gap):
                        continue

                    predicted_gaps[i] = alternative
                    alternatives[j] = gap
                    alternatives = sorted(
                        alternatives, key=lambda x: x["score"], reverse=True
                    )
                    break

        return sorted(predicted_gaps, key=lambda x: x["index"]), sorted(
            alternatives, key=lambda x: x["index"]
        )

    return post_process


def insert_gaps_into_text(text, gaps):
    result_text = text
    reversed_gaps = sorted(gaps, key=lambda x: x["start"], reverse=True)

    for gap in reversed_gaps:
        if gap["entity"] == "GAP":
            start_index = gap["start"]
            end_index = gap["end"]
            replacement_word = settings.GAP_INDICATOR
            result_text = (
                result_text[:start_index] + replacement_word + result_text[end_index:]
            )

    return result_text
