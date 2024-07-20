from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from cloze_generator.cloze_tests.models import ClozeTest
from cloze_generator.cloze_tests.serializers import (
    ClozeTestDetailSerializer,
    ClozeTestListSerializer,
    ClozeTestCreateSerializer,
)


class ClozeTestViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = ClozeTestDetailSerializer
    queryset = ClozeTest.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return ClozeTestListSerializer
        elif self.action == "create":
            return ClozeTestCreateSerializer
        return self.serializer_class
