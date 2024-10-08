from django.conf import settings
from rest_framework import serializers

from cloze_generator.cloze_tests.models import ClozeTest
from cloze_generator.model.serializers import GapsSerializer
from cloze_generator.model.utils import insert_gaps_into_text


class ClozeTestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClozeTest
        fields = ["id", "created_at", "title", "short_title", "is_draft"]


class ClozeTestDetailSerializer(serializers.ModelSerializer):
    text_with_gaps = serializers.SerializerMethodField()
    gap_indicator = serializers.SerializerMethodField()

    class Meta:
        model = ClozeTest
        fields = [
            "id",
            "created_at",
            "is_draft",
            "title",
            "short_title",
            "publish_uuid",
            "text_with_gaps",
            "gap_indicator",
            "gaps",
        ]

    def get_text_with_gaps(self, obj: ClozeTest):
        if obj.is_draft:
            return obj.text
        return insert_gaps_into_text(obj.text, obj.gaps)

    def get_gap_indicator(self, _: ClozeTest):
        return settings.GAP_INDICATOR


class ClozeTestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClozeTest
        fields = ["id", "gaps"]

    def validate_gaps(self, value):
        if self.instance and not self.instance.is_draft:
            raise serializers.ValidationError(
                "You cannot change gaps of already saved test."
            )

        gaps_serializer = GapsSerializer(data=value)
        gaps_serializer.is_valid(raise_exception=True)
        return gaps_serializer.data

    def to_representation(self, instance):
        return ClozeTestDetailSerializer(instance, context=self.context).data
