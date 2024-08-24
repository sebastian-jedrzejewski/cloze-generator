from typing import Dict, Any, Optional

from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone

from cloze_generator.cloze_tests.models import ClozeTest
from cloze_generator.model.apps import ModelConfig
from cloze_generator.users.models import User

logger = get_task_logger(__name__)


@shared_task
def predict_gaps_for_text(
    test_data: Dict[str, Any], user_id: Optional[int]
) -> Optional[str]:
    user = User.objects.filter(id=user_id).first()

    gaps, alternatives = ModelConfig.pipe(test_data["text"], n_gaps=test_data["n_gaps"])
    test = ClozeTest.objects.create(
        title=test_data.get("title", ""),
        text=test_data["text"],
        gaps={
            "predicted_gaps": gaps,
            "alternatives": alternatives,
        },
        is_draft=True,
        user=user,
        expiry_time=timezone.now() + timezone.timedelta(hours=2) if not user else None,
    )
    return test.id
