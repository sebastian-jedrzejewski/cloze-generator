from django.db.models import Q
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from cloze_generator.cloze_tests.models import ClozeTest
from cloze_generator.cloze_tests.serializers import (
    ClozeTestDetailSerializer,
    ClozeTestListSerializer,
    ClozeTestUpdateSerializer,
)
from cloze_generator.model.serializers import CreateGapsRequestSerializer
from cloze_generator.model.tasks import predict_gaps_for_text
from cloze_generator.users.models import UserTask


class ClozeTestViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [AllowAny]
    serializer_class = ClozeTestDetailSerializer
    queryset = ClozeTest.objects.order_by("-created_at")

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.action == "list":
                return super().get_queryset().filter(user=self.request.user)
            return (
                super()
                .get_queryset()
                .filter(Q(user=self.request.user) | Q(user__isnull=True))
            )
        if self.action != "list":
            return super().get_queryset().filter(user__isnull=True)
        return ClozeTest.objects.none()

    def get_serializer_class(self):
        if self.action == "list":
            return ClozeTestListSerializer
        elif self.action == "create":
            return CreateGapsRequestSerializer
        elif self.action in ("update", "partial_update"):
            return ClozeTestUpdateSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            data={"task_id": task.id}, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        result = predict_gaps_for_text.delay(
            test_data=serializer.data,
            user_id=(user.id if user else None),
        )
        task = UserTask.objects.create(user=user, task_id=result.id)
        return task

    @action(detail=True, methods=["POST"])
    def save_test(self, request, *args, **kwargs):
        test = self.get_object()
        test.is_draft = False
        test.gaps = test.gaps.get("predicted_gaps", [])
        test.save(update_fields=["is_draft", "gaps"])
        return Response(
            data=self.get_serializer(instance=test).data, status=status.HTTP_200_OK
        )
