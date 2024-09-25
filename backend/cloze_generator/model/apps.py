from django.apps import AppConfig
from transformers import ElectraTokenizerFast

from cloze_generator.model.utils import load_model, post_processing


class ModelConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cloze_generator.model"
    tokenizer = None
    model = None
    pipe = None

    def ready(self):
        ModelConfig.tokenizer = ElectraTokenizerFast.from_pretrained(
            "google/electra-base-discriminator"
        )
        ModelConfig.model = load_model()
        ModelConfig.pipe = post_processing()
