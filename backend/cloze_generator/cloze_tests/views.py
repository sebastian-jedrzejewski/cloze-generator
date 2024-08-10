from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
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
    permission_classes = [IsAuthenticated]
    serializer_class = ClozeTestDetailSerializer
    queryset = ClozeTest.objects.order_by("-created_at")

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

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
        result = predict_gaps_for_text.delay(
            test_data=serializer.data, user_id=self.request.user.id
        )
        UserTask.objects.create(user=self.request.user, task_id=result.id)
        return result

    @action(detail=True, methods=["POST"])
    def save_test(self, request, *args, **kwargs):
        test = self.get_object()
        test.is_draft = False
        test.gaps = test.gaps.get("predicted_gaps", [])
        test.save(update_fields=["is_draft", "gaps"])
        return Response(
            data=self.get_serializer(instance=test).data, status=status.HTTP_200_OK
        )
