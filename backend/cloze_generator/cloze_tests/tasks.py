from celery import shared_task
from django.utils import timezone

from cloze_generator.cloze_tests.models import ClozeTest


@shared_task
def delete_temporary_tests():
    ClozeTest.objects.filter(expiry_time__lte=timezone.now()).delete()
