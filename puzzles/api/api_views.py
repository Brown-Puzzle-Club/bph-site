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


class PuzzleViewSet(viewsets.ModelViewSet):
    queryset = Puzzle.objects.all()
    serializer_class = PuzzleBasicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request._request.context.is_admin:
            return Puzzle.objects.all()

        return self.request._request.context.team.unlocks.values()


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


@api_view(["GET"])
def get_puzzle(request: Request, puzzle_slug: str) -> Response:
    # gets a puzzle if the team has access to it
    try:
        context = request._request.context
        puzzle = context.team.unlocks.get(puzzle_slug)

        if puzzle is None:
            if context.is_admin:
                puzzle = Puzzle.objects.get(slug=puzzle_slug)
            else:
                raise Puzzle.DoesNotExist

        serializer = PuzzleBasicSerializer(puzzle)

        # Send the puzzler only the body that they are supposed to see
        # (remote if it exists and they are a remote team, in-person otherwise, unless admin)
        additional_fields = {}

        # answer history
        submissions = context.team.puzzle_submissions(puzzle)

        additional_fields["submissions"] = AnswerSubmissionSerializer(
            submissions, many=True
        ).data

        # puzzle body
        if context.is_admin:
            additional_fields["body"] = puzzle.body
            additional_fields["body_remote"] = puzzle.body_remote
        else:
            additional_fields["body"] = (
                puzzle.body
                if context.team.in_person or puzzle.body_remote == ""
                else puzzle.body_remote
            )

        complete_puzzle_data = {**serializer.data, **additional_fields}

        return Response(complete_puzzle_data)
    except Puzzle.DoesNotExist:
        return Response({"error": "Puzzle not found"}, status=404)


@api_view(["GET"])
def major_case(request: Request, major_case_slug: str) -> Response:
    try:
        context = request._request.context

        major_case = MajorCase.objects.get(slug=major_case_slug)
        serializer = MajorCaseSerializer(major_case)

        additional_fields = {}
        submissions = context.team.puzzle_submissions(major_case.puzzle)

        additional_fields["submissions"] = AnswerSubmissionSerializer(
            submissions, many=True
        ).data

        complete_puzzle_data = {**serializer.data, **additional_fields}

        return Response(complete_puzzle_data)
    except MajorCase.DoesNotExist:
        return Response({"error": "MajorCase not found"}, status=404)
