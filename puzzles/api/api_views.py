from rest_framework import permissions, viewsets, mixins
from puzzles import models

from .serializers import *

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view


@api_view(["GET"])
def index(request: Request) -> Response:
    return Response({"Hello": "World"})


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)  # type: ignore


class TeamViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(user=self.request.user)

class TokenViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = TokenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Token.objects.filter(user=self.request.user)

class BasicTeamViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
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


@api_view(["GET"])
def context(request: Request) -> Response:
    serializer = ContextSerializer(data=request._request.context)

    if serializer.is_valid():
        validated_data = serializer.validated_data
        return Response(validated_data)
    else:
        return Response(serializer.errors, status=400)


@api_view(["GET"])
def team_members(request: Request, team_id: int) -> Response:
    try:
        team = Team.objects.get(id=team_id)
        team_members = TeamMember.objects.filter(team=team)
        serializer = TeamMemberSerializer(team_members, many=True)
        return Response(serializer.data)
    except Team.DoesNotExist:
        return Response({"error": "Team not found"}, status=404)