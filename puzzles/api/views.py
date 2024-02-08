from rest_framework import permissions, viewsets, mixins

from puzzles.api.form_serializers import UserRegistrationSerializer
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
        team = Team.objects.get(user=user)
        return Response(TeamSerializer(team).data)
    else:
        return Response({'status': 'failure'}, status=401)
    

@api_view(['POST'])
def logout_view(request: Request) -> Response:
    logout(request._request)
    
    return Response({'status': 'success'})


@api_view(['POST'])
def register_view(request):
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        
        logout(request._request)

        user = User.objects.create_user(
            serializer.validated_data.get('team_id'),
            password=serializer.validated_data.get('password'),
            first_name=serializer.validated_data.get('team_name'),
        )

        team = Team.objects.create(
                user=user,
                team_name=serializer.validated_data.get('team_name'),
                in_person=serializer.validated_data.get('in_person',False),
                brown_team=(serializer.validated_data.get('num_brown_members') is not None
                    and serializer.validated_data.get('num_brown_members') > 0),
                num_brown_members=serializer.validated_data.get('num_brown_members',0),
                classroom_need=serializer.validated_data.get('classroom_need',False),
                where_to_find=serializer.validated_data.get('where_to_find',""),
                phone_number=serializer.validated_data.get('phone_number',""),
                color_choice=serializer.validated_data.get('color_choice',''),
                emoji_choice=serializer.validated_data.get('emoji_choice',''),
            )

        for team_member in serializer.validated_data.get('members'):
            TeamMember.objects.create(
                team=team,
                name=team_member.get('name'),
                email=team_member.get('email'),
            )
        
        # Log in the newly registered user
        login(request._request, user)
        
        # Return the serialized user data
        return Response(TeamSerializer(team).data)
    else:
        # Return errors if registration fails
        return Response(serializer.errors, status=400)