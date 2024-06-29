from django.contrib import admin

from cloze_generator.users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
