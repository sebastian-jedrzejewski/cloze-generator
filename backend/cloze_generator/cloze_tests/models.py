import uuid
from django.db import models

from cloze_generator.users.models import User


class ClozeTest(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)

    created_at = models.DateTimeField(auto_now_add=True)

    title = models.CharField(max_length=128, blank=True, null=True)
    text = models.TextField(max_length=2048)
    gaps = models.JSONField()
    is_draft = models.BooleanField(default=False)
    expiry_time = models.DateTimeField(blank=True, null=True)
    publish_uuid = models.UUIDField(editable=False, unique=True, blank=True, null=True)

    user = models.ForeignKey(
        User,
        related_name="cloze_tests",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    @property
    def short_title(self) -> str:
        add_dots = len(str(self.title)) > 20 if self.title else len(str(self.text)) > 20
        return (self.title[:20] if self.title else self.text[:20]) + (
            "..." if add_dots else ""
        )

    def __str__(self):
        return f"{self.user} - {self.short_title}"
