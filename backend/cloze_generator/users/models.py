from django.contrib.auth.models import AbstractUser
from django.db import models

from cloze_generator.managers import UserManager


class User(AbstractUser):
    email = models.EmailField(unique=True)

    username = None

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
