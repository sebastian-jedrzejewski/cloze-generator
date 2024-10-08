from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cloze_generator.model import serializers
from cloze_generator.model.apps import ModelConfig


class GenerateGapsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_serializer = serializers.CreateGapsRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.data

        gaps, alternatives = ModelConfig.pipe(data["text"], n_gaps=data["n_gaps"])
        response_data = {
            "title": data.get("title", ""),
            "gaps": {
                "predicted_gaps": gaps,
                "alternatives": alternatives,
            },
            "text": data["text"],
        }
        response_serializer = serializers.CreateGapsResponseSerializer(
            data=response_data
        )
        response_serializer.is_valid(raise_exception=True)
        return Response(data=response_serializer.data, status=status.HTTP_200_OK)
