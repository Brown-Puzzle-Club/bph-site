from rest_framework import permissions, viewsets, mixins
from .serializers import *

from django.shortcuts import redirect
from django.http import HttpResponse, HttpRequest
from rest_framework.response import Response
from rest_framework.request import Request, Empty
from rest_framework.decorators import api_view


@api_view(['GET'])
def index(request: Request) -> Response:
    return Response({'Hello': 'World'})


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)  # type: ignore


class TeamViewSet(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(user=self.request.user)


class BasicTeamViewSet(mixins.RetrieveModelMixin,
                       mixins.ListModelMixin,
                       viewsets.GenericViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamBasicSerializer
