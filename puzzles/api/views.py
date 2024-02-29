from datetime import datetime
from psycopg2 import IntegrityError
from rest_framework import permissions, viewsets, mixins
from puzzles import models

from puzzles.api.form_serializers import TeamUpdateSerializer, UserRegistrationSerializer
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


class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        current_team = self.request.user.team
        queryset = TeamMember.objects.filter(team=current_team)
        return queryset


class ErrataViewSet(viewsets.ModelViewSet):
    queryset = Erratum.objects.all()
    serializer_class = ErratumSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return models.Erratum.get_visible_errata(self.request._request.context)


class RoundsViewSet(viewsets.ModelViewSet):
    serializer_class = RoundSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Round.objects.all()

    def get_queryset(self):
        return models.Round.get_unlocked_rounds(self.request._request.context)

class MinorCaseActiveViewSet(viewsets.ModelViewSet):
    queryset = MinorCaseActive.objects.all()
    serializer_class = MinorCaseActiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MinorCaseActive.objects.filter(team=self.request._request.context.team)

@api_view(['GET'])
def context_view(request: Request) -> Response:
    serializer = ContextSerializer(data=request._request.context)

    if serializer.is_valid():
        validated_data = serializer.validated_data
        return Response(validated_data)
    else:
        return Response(serializer.errors, status=400)


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

        user = User.objects.create_user(
            serializer.validated_data.get('team_id'),
            password=serializer.validated_data.get('password'),
            first_name=serializer.validated_data.get('team_name'),
        )

        team = Team.objects.create(
            user=user,
            team_name=serializer.validated_data.get('team_name'),
            in_person=serializer.validated_data.get('in_person', False),
            brown_team=(serializer.validated_data.get('num_brown_members') is not None
                        and serializer.validated_data.get('num_brown_members') > 0),
            num_brown_members=serializer.validated_data.get(
                'num_brown_members', 0),
            classroom_need=serializer.validated_data.get(
                'classroom_need', False),
            where_to_find=serializer.validated_data.get('where_to_find', ""),
            phone_number=serializer.validated_data.get('phone_number', ""),
            color_choice=serializer.validated_data.get('color_choice', ''),
            emoji_choice=serializer.validated_data.get('emoji_choice', ''),
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


@api_view(['POST'])
def update_team(request: Request) -> Response:
    serializer = TeamUpdateSerializer(data=request.data)

    if serializer.is_valid():

        team = Team.objects.get(user=request.user)

        team.in_person = serializer.validated_data.get(
            'in_person', team.in_person)
        team.num_brown_members = serializer.validated_data.get(
            'num_brown_members', team.num_brown_members)
        team.phone_number = serializer.validated_data.get(
            'phone_number', team.phone_number)
        team.classroom_need = serializer.validated_data.get(
            'classroom_need', team.classroom_need)
        team.where_to_find = serializer.validated_data.get(
            'where_to_find', team.where_to_find)
        team.color_choice = serializer.validated_data.get(
            'color_choice', team.color_choice)
        team.emoji_choice = serializer.validated_data.get(
            'emoji_choice', team.emoji_choice)
        team.save()

        TeamMember.objects.filter(team=team).delete()
        for team_member in serializer.validated_data.get('members'):
            TeamMember.objects.create(
                team=team,
                name=team_member.get('name'),
                email=team_member.get('email'),
            )

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['POST'])
def move_minor_case(request: Request, round_id):
    "move minor case state"
    # print("attempted to move minor case")
    try:
        # print("team", request._request.context.team)
        # print("round_id", round_id)
        incoming_case = MinorCaseActive.objects.get(team=request._request.context.team, minor_case_round__id=round_id)
        # print(incoming_case)
        # for case in incoming_case:
        #     print(case.minor_case_round.id)
    except MinorCaseActive.DoesNotExist:
        return Response({'error': 'MinorCaseIncoming not found'}, status=404)

    try:
        active_case = models.MinorCaseCompleted.objects.create(
            team=incoming_case.team,
            minor_case_round=incoming_case.minor_case_round,
            completed_datetime=incoming_case.active_datetime,
        )
        active_case.save()
    except:
        # Extract the error message from the exception
        return Response({'error': 'MinorCase already completed'}, status=400)

    return Response({'success': 'Move operation successful'}, status=200)
    

@api_view(['GET'])
def team_members_view(request: Request, team_id: int) -> Response:
    try:
        team = Team.objects.get(id=team_id)
        team_members = TeamMember.objects.filter(team=team)
        serializer = TeamMemberSerializer(team_members, many=True)
        return Response(serializer.data)
    except Team.DoesNotExist:
        return Response({'error': 'Team not found'}, status=404)


@api_view(['POST'])
def create_vote_event(request: Request) -> Response:
    serializer = VoteEventSerializer(data=request.data)
    team = request._request.context.team

    if serializer.is_valid():
        vote_event = MinorCaseVoteEvent.objects.create(
            timestamp=datetime.now(),
            team=team,
            selected_case=serializer.validated_data.get('selected_case'),
            incoming_event=serializer.validated_data.get('incoming_event'),
        )
        vote_event.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)