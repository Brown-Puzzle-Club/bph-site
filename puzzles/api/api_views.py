from collections import defaultdict
from datetime import datetime
from rest_framework import permissions, viewsets, mixins
from puzzles import models
from puzzles.api.api_guards import require_auth
from puzzles.hunt_config import HUNT_CLOSE_TIME, HUNT_END_TIME, MAJOR_CASE_SLUGS

from .serializers import *

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view


@api_view(["GET"])
def index(request: Request) -> Response:
    return Response({"Hello": "World"})


@api_view(["GET"])
def get_my_user(request: Request) -> Response:
    if not request.user.is_authenticated:
        return Response({"success": False, "error": "User not logged in"})
    try:
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user)
        return Response({"success": True, "data": serializer.data})
    except User.DoesNotExist:
        return Response({"success": False, "error": "User not found"})


@api_view(["GET"])
def get_my_team(request: Request) -> Response:
    if not request.user.is_authenticated:
        return Response({"success": False, "error": "User not logged in"})
    try:
        team = Team.objects.get(id=request._request.context.team.id)  # type: ignore
        serializer = TeamSerializer(team)
        return Response({"success": True, "data": serializer.data})
    except Team.DoesNotExist:
        return Response({"success": False, "error": "Team not found"})


@api_view(["GET"])
def get_my_token(request: Request) -> Response:
    if not request.user.is_authenticated:
        return Response({"success": False, "error": "User not logged in"})
    try:
        token = Token.objects.get(user=request.user)
        serializer = TokenSerializer(token)
        return Response({"success": True, "data": serializer.data})
    except Token.DoesNotExist:
        return Response({"success": False, "error": "Token not found"})


@api_view(["GET"])
def get_my_biggraph(request: Request) -> Response:
    if not request.user.is_authenticated:
        return Response({"success": False, "error": "User not logged in"})

    puzzles = request._request.context.all_puzzles
    puzzle_map = {}
    for puzzle in puzzles:
        puzzle_map[puzzle.id] = puzzle

    team_point_changes = []
    team_score = 0

    for puzzle_id, submitted_datetime in (
        AnswerSubmission.objects.filter(
            is_correct=True,
            team__is_hidden=False,
            used_free_answer=False,
            team__id=request._request.context.team.id,
        )
        .order_by("submitted_datetime")
        .values_list("puzzle_id", "submitted_datetime")
    ):
        team_score += 1
        puzzle = puzzle_map[puzzle_id]
        team_point_changes.append(
            (
                submitted_datetime.timestamp() * 1000,
                team_score,
                puzzle.name,
                puzzle.is_meta,
            )
        )

    return Response({"success": True, "data": team_point_changes})


@api_view(["GET"])
def get_total_solve(request: Request) -> Response:
    teams = Team.objects.all()

    data = {}
    for team in teams:
        answer_submissions = AnswerSubmission.objects.filter(
            is_correct=True,
            team__is_hidden=False,
            used_free_answer=False,
            team__id=team.id,  # type: ignore
        ).order_by("submitted_datetime")

        data[team.team_name] = [
            {
                "puzzle_name": submission.puzzle.name,
                "solvedAt": str(submission.submitted_datetime.isoformat()),
            }
            for submission in answer_submissions
        ]

    data = {k: v for k, v in data.items() if len(v) > 0}

    return Response({"success": True, "data": data})


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


class EventCompletionViewSet(viewsets.ModelViewSet):
    queryset = EventCompletion.objects.all()
    serializer_class = EventCompletionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EventCompletion.objects.filter(team=self.request._request.context.team)


class StorylineUnlockViewSet(viewsets.ModelViewSet):
    queryset = StorylineUnlock.objects.all()
    serializer_class = StorylineUnlockSerializer

    def get_queryset(self):
        if (
            self.request._request.context.is_admin
            or self.request._request.context.hunt_is_closed
        ):
            return StorylineUnlock.all_storylines()

        return StorylineUnlock.objects.filter(team=self.request._request.context.team)


@api_view(["GET"])
def context(request: Request) -> Response:
    # time = datetime.now()
    serializer = ContextSerializer(data=request._request.context)
    # new_time = datetime.now()
    # time_elapse = new_time - time
    # print(f"Context took {time_elapse} to serialize")

    # print("yee")
    if serializer.is_valid():
        # print("haw")
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
        puzzle = None

        if context.team:
            puzzle = context.team.unlocks.get(puzzle_slug)

        if puzzle is None:
            if context.is_admin or context.hunt_is_closed:
                puzzle = Puzzle.objects.get(slug=puzzle_slug)
            else:
                raise Puzzle.DoesNotExist

        serializer = PuzzleBasicSerializer(puzzle)

        # Send the puzzler only the body that they are supposed to see
        # (remote if it exists and they are a remote team, in-person otherwise, unless admin)
        additional_fields = {}

        # answer history
        submissions = []
        if context.team:
            submissions = context.team.puzzle_submissions(puzzle)
        additional_fields["submissions"] = AnswerSubmissionSerializer(
            submissions, many=True
        ).data

        # errata
        errata = Erratum.get_puzzle_erata(context=context, puzzle_slug=puzzle.slug)
        additional_fields["errata"] = ErrataSerializer(errata, many=True).data

        if context.hunt_is_over:
            additional_fields["stats"] = puzzle.stats

        # puzzle body
        if context.is_admin or context.hunt_is_closed:
            additional_fields["body"] = puzzle.body
            additional_fields["body_remote"] = puzzle.body_remote
            additional_fields["clipboard"] = puzzle.clipboard
            additional_fields["clipboard_remote"] = puzzle.clipboard_remote
            additional_fields["solution"] = puzzle.solution
            additional_fields["answer"] = puzzle.answer
        elif context.hunt_is_over:
            additional_fields["body"] = (
                puzzle.body_remote if puzzle.body_remote != "" else puzzle.body
            )
            additional_fields["clipboard"] = (
                puzzle.clipboard_remote
                if puzzle.clipboard_remote != ""
                else puzzle.clipboard
            )
        else:
            additional_fields["body"] = (
                puzzle.body
                if context.team and context.team.in_person or puzzle.body_remote == ""
                else puzzle.body_remote
            )
            additional_fields["clipboard"] = (
                puzzle.clipboard
                if context.team
                and context.team.in_person
                or puzzle.clipboard_remote == ""
                else puzzle.clipboard_remote
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
        submissions = []
        if context.team:
            submissions = context.team.puzzle_submissions(major_case.puzzle)

        additional_fields["submissions"] = AnswerSubmissionSerializer(
            submissions, many=True
        ).data

        complete_puzzle_data = {**serializer.data, **additional_fields}

        return Response(complete_puzzle_data)
    except MajorCase.DoesNotExist:
        return Response({"error": "MajorCase not found"}, status=404)


@api_view(["GET"])
@require_auth
def get_hints_for_puzzle(request: Request, puzzle_slug: str) -> Response:
    try:
        context = request._request.context
        puzzle = context.team.unlocks.get(puzzle_slug)

        if puzzle is None:
            if context.is_admin:
                puzzle = Puzzle.objects.get(slug=puzzle_slug)
            else:
                raise Puzzle.DoesNotExist

        hints = Hint.objects.filter(puzzle=puzzle, team=context.team)
        serializer = HintSerializer(hints, many=True)

        return Response(serializer.data)
    except Puzzle.DoesNotExist:
        return Response({"error": "Puzzle not found"}, status=404)


@api_view(["GET"])
@require_auth
def get_events(request: Request) -> Response:
    context = request._request.context

    if len(context.major_case_solves) >= len(MAJOR_CASE_SLUGS):
        events = Event.objects.all().order_by("timestamp")
    else:
        events = Event.objects.filter(is_final_runaround=False).order_by("timestamp")

    serializer = EventSerializer(events, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_all_solve_stats(request: Request, team_id: int) -> Response:
    solves = AnswerSubmission.objects.filter(
        team__id=team_id, team__is_hidden=False
    ).values(
        "team__team_name",
        "puzzle__name",
        "puzzle__slug",
        "submitted_datetime",
        "is_correct",
    )

    puzzles = set([solve["puzzle__slug"] for solve in solves])

    def get_incorrect_guesses_puzzle(slug: str):
        return len(
            [
                solve
                for solve in solves
                if solve["puzzle__slug"] == slug and not solve["is_correct"]
            ]
        )

    def get_unlock_time(slug: str):
        unlock_time = PuzzleUnlock.objects.filter(team__id=team_id, puzzle__slug=slug)
        if unlock_time:
            unlock_time = unlock_time[0].unlock_datetime
            return unlock_time.isoformat()

        return None

    def get_correct_guess_time(slug: str):
        correct_guesses = [
            solve["submitted_datetime"]
            for solve in solves
            if solve["puzzle__slug"] == slug and solve["is_correct"]
        ]
        if correct_guesses:
            return correct_guesses[0]
        return None

    team_stats = {
        puzzle: {
            "name": puzzle,
            "incorrect_guesses": get_incorrect_guesses_puzzle(puzzle),
            "unlock_time": get_unlock_time(puzzle),
            "solve_time": get_correct_guess_time(puzzle),
        }
        for puzzle in puzzles
    }

    return Response(
        {
            "name": solves[0]["team__team_name"],
            "id": team_id,
            "total_solves": len([solve for solve in solves if solve["is_correct"]]),
            "stats": team_stats,
        }
    )


@api_view(["GET"])
def get_puzzle_stats(request: Request, puzzle_slug: str) -> Response:
    puzzle = Puzzle.objects.get(slug=puzzle_slug)
    solves = AnswerSubmission.objects.filter(
        team__is_hidden=False, puzzle__slug=puzzle_slug
    ).values("team__team_name", "team__id", "submitted_datetime", "is_correct")
    total_solves = 0
    hints_asked = 0
    teams_unlocked = 0

    teams = set([(solve["team__team_name"], solve["team__id"]) for solve in solves])

    def get_incorrect_guesses_team(team: str):
        return len(
            [
                solve
                for solve in solves
                if solve["team__team_name"] == team and not solve["is_correct"]
            ]
        )

    def get_correct_guess_time(team: str):
        correct_guesses = [
            solve["submitted_datetime"]
            for solve in solves
            if solve["team__team_name"] == team and solve["is_correct"]
        ]
        if correct_guesses:
            nonlocal total_solves
            total_solves += 1
            return correct_guesses[0]
        return None

    def num_hints(team: str):
        num_hints = len(
            Hint.objects.filter(team__team_name=team, puzzle__slug=puzzle_slug)
        )
        nonlocal hints_asked
        hints_asked += num_hints
        return num_hints

    def unlock_time(team: str):
        unlock_time = PuzzleUnlock.objects.filter(
            team__team_name=team, puzzle__slug=puzzle_slug
        )
        if unlock_time:
            unlock_time = unlock_time[0].unlock_datetime
            nonlocal teams_unlocked
            teams_unlocked += 1
            return unlock_time.isoformat()

        return None

    team_data = {
        team: {
            "name": team,
            "id": team_id,
            "incorrect_guesses": get_incorrect_guesses_team(team),
            "unlock_time": unlock_time(team),
            "solve_time": get_correct_guess_time(team),
            "num_hints": num_hints(team),
        }
        for (team, team_id) in teams
    }

    return Response(
        {
            "name": puzzle.name,
            "total_solves": total_solves,
            "guesses": len(solves),
            "hints": hints_asked,
            "unlocks": teams_unlocked,
            "submissions": team_data,
        }
    )


@api_view(["GET"])
def get_all_puzzle_stats(request: Request):
    django_context = request._request.context

    if not django_context.is_admin and not django_context.hunt_is_closed:
        return Response({"error": "Unauthorized"}, status=401)

    puzzles = Puzzle.objects.all()

    # DOES NOT INCLUDE TEAM-BASED STATS. FOR THOSE, QUERY FOR A SPECIFIC PUZZLE.
    stats_data = {
        puzzle.slug: {"name": puzzle.name, **puzzle.stats} for puzzle in puzzles
    }

    return Response(stats_data, status=200)


@api_view(["GET"])
def get_leaderboard(request: Request) -> Response:
    # Get all the solves for all the puzzles, and return only the team names and the puzzle slugs
    context = request._request.context

    teams = Team.leaderboard(context.team, hide_hidden=not context.is_admin)
    return Response(teams, status=200)
