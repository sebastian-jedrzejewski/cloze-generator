from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from cloze_generator.users.models import UserTask
from cloze_generator.users.serializers import (
    UserTaskListSerializer,
    UserTaskDetailSerializer,
)


class UserTaskViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = UserTaskListSerializer
    queryset = UserTask.objects.all()
    lookup_field = "task_id"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserTaskDetailSerializer
        return self.serializer_class

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
