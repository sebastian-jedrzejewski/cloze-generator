from django.contrib import admin

from cloze_generator.cloze_tests.models import ClozeTest


@admin.register(ClozeTest)
class ClozeTestAdmin(admin.ModelAdmin):
    pass
