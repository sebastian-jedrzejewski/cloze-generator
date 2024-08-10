from rest_framework import serializers

from cloze_generator.users.models import UserTask


class UserTaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = ["task_id"]


class UserTaskDetailSerializer(serializers.ModelSerializer):
    task_info = serializers.ReadOnlyField()

    class Meta:
        model = UserTask
        fields = ["task_id", "task_info"]
