from django.contrib import admin

from cloze_generator.users.models import User, UserTask


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(UserTask)
class UserTaskAdmin(admin.ModelAdmin):
    pass
