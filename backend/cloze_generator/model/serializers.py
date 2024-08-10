from rest_framework import serializers

from cloze_generator.model.constants import label2id


class CreateGapsRequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=128, required=False)
    text = serializers.CharField(max_length=2048)
    n_gaps = serializers.IntegerField(min_value=1, max_value=16)


class TokenSerializer(serializers.Serializer):
    entity = serializers.ChoiceField(choices=list(label2id.keys()), default="GAP")
    score = serializers.DecimalField(max_digits=19, decimal_places=18)
    index = serializers.IntegerField()
    word = serializers.CharField()
    start = serializers.IntegerField()
    end = serializers.IntegerField()


class GapsSerializer(serializers.Serializer):
    predicted_gaps = TokenSerializer(many=True)
    alternatives = TokenSerializer(many=True)


class CreateGapsResponseSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=128, allow_blank=True, allow_null=True)
    text = serializers.CharField(max_length=2048)
    gaps = GapsSerializer()
