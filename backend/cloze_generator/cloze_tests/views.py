from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cloze_generator.cloze_tests.models import ClozeTest
from cloze_generator.cloze_tests.serializers import (
    ClozeTestDetailSerializer,
    ClozeTestListSerializer,
    ClozeTestCreateSerializer,
    ClozeTestUpdateSerializer,
)


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
            return ClozeTestCreateSerializer
        elif self.action in ("update", "partial_update"):
            return ClozeTestUpdateSerializer
        return self.serializer_class

    @action(detail=True, methods=["POST"])
    def save_test(self, request, *args, **kwargs):
        test = self.get_object()
        test.is_draft = False
        test.gaps = test.gaps.get("predicted_gaps", [])
        test.save(update_fields=["is_draft", "gaps"])
        return Response(
            data=self.get_serializer(instance=test).data, status=status.HTTP_200_OK
        )
