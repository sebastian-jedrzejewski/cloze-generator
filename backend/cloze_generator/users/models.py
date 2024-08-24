import uuid
from celery.result import AsyncResult
from django.contrib.auth.models import AbstractUser
from django.db import models

from cloze_generator.managers import UserManager


class User(AbstractUser):
    email = models.EmailField(unique=True)

    username = None

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


class UserTask(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)

    user = models.ForeignKey(
        "users.User",
        related_name="tasks",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    task_id = models.UUIDField(unique=True)

    @property
    def task_info(self) -> dict:
        task_id = str(self.task_id)
        result = AsyncResult(task_id)
        return {
            "state": result.state,
            "result": result.result,
        }

    def __str__(self):
        return f"{self.task_id} - {self.user}"
