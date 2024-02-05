from rest_framework import permissions, viewsets, mixins
from .serializers import *

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

from django.contrib.auth import authenticate, login, logout


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


@api_view(['POST'])
def login_view(request: Request) -> Response:
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request._request, user)
        return Response(UserSerializer(user).data)
    else:
        return Response({'status': 'failure'}, status=401)
    

@api_view(['POST'])
def logout_view(request: Request) -> Response:
    logout(request._request)
    
    return Response({'status': 'success'})