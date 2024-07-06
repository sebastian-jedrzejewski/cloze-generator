import os
import nltk

from django.apps import AppConfig
from django.conf import settings
from transformers import ElectraTokenizerFast

from cloze_generator.model.utils import load_model, post_processing


class ModelConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cloze_generator.model"
    tokenizer = None
    model = None
    pipe = None
    tweet_tokenizer = None

    def ready(self):
        model_path = os.path.join(
            settings.BASE_DIR, "cloze_generator", "model", "electra_model.bin"
        )

        nltk.download("punkt")

        ModelConfig.tokenizer = ElectraTokenizerFast.from_pretrained(
            "google/electra-base-discriminator"
        )
        ModelConfig.model = load_model(model_path)
        ModelConfig.pipe = post_processing(model_path)
        ModelConfig.tweet_tokenizer = nltk.tokenize.TweetTokenizer()
