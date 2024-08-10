import os

from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cloze_generator.settings")

app = Celery("cloze_generator")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
