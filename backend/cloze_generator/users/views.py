from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from cloze_generator.users.models import UserTask
from cloze_generator.users.serializers import (
    UserTaskListSerializer,
    UserTaskDetailSerializer,
)


class UserTaskViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserTaskListSerializer
    queryset = UserTask.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserTaskDetailSerializer
        return self.serializer_class

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(
                Q(user=self.request.user) | Q(user__isnull=True)
            )
        return self.queryset.filter(user__isnull=True)
