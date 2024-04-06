from datetime import datetime
from django.contrib.auth import authenticate, login, logout
from puzzles import models

from puzzles.api.api_guards import require_admin
from puzzles.api.form_serializers import (
    TeamUpdateSerializer,
    UserRegistrationSerializer,
)

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

from puzzles.signals import send_notification

from .serializers import *


@api_view(["POST"])
def login_action(request: Request) -> Response:
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    Token.objects.get_or_create(user=user)

    if user is not None:
        login(request._request, user)
        team = Team.objects.get(user=user)
        return Response(TeamSerializer(team).data)
    else:
        return Response({"status": "failure"}, status=401)


@api_view(["POST"])
def logout_action(request: Request) -> Response:
    logout(request._request)

    return Response({"status": "success"})


@api_view(["POST"])
def register_action(request):
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():

        user = User.objects.create_user(
            serializer.validated_data.get("team_id"),
            password=serializer.validated_data.get("password"),
            first_name=serializer.validated_data.get("team_name"),
        )

        team = Team.objects.create(
            user=user,
            team_name=serializer.validated_data.get("team_name"),
            in_person=serializer.validated_data.get("in_person", False),
            brown_team=(
                serializer.validated_data.get("num_brown_members") is not None
                and serializer.validated_data.get("num_brown_members") > 0
            ),
            num_brown_members=serializer.validated_data.get("num_brown_members", 0),
            classroom_need=serializer.validated_data.get("classroom_need", False),
            where_to_find=serializer.validated_data.get("where_to_find", ""),
            phone_number=serializer.validated_data.get("phone_number", ""),
            color_choice=serializer.validated_data.get("color_choice", ""),
            emoji_choice=serializer.validated_data.get("emoji_choice", ""),
        )

        for team_member in serializer.validated_data.get("members"):
            TeamMember.objects.create(
                team=team,
                name=team_member.get("name"),
                email=team_member.get("email"),
            )

        # Log in the newly registered user
        login(request._request, user)

        # Return the serialized user data
        return Response(TeamSerializer(team).data)
    else:
        # Return errors if registration fails
        return Response(serializer.errors, status=400)


@api_view(["POST"])
def update_team(request: Request) -> Response:
    serializer = TeamUpdateSerializer(data=request.data)

    if serializer.is_valid():

        team = Team.objects.get(user=request.user)

        team.in_person = serializer.validated_data.get("in_person", team.in_person)
        team.num_brown_members = serializer.validated_data.get(
            "num_brown_members", team.num_brown_members
        )

        team.phone_number = serializer.validated_data.get(
            "phone_number", team.phone_number
        )
        team.classroom_need = serializer.validated_data.get(
            "classroom_need", team.classroom_need
        )
        team.where_to_find = serializer.validated_data.get(
            "where_to_find", team.where_to_find
        )
        team.color_choice = serializer.validated_data.get(
            "color_choice", team.color_choice
        )
        team.emoji_choice = serializer.validated_data.get(
            "emoji_choice", team.emoji_choice
        )
        team.save()

        TeamMember.objects.filter(team=team).delete()
        for team_member in serializer.validated_data.get("members"):
            TeamMember.objects.create(
                team=team,
                name=team_member.get("name"),
                email=team_member.get("email"),
            )

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)


@api_view(["POST"])
def move_minor_case(request: Request, round_id):
    "move minor case state"
    # print("attempted to move minor case")
    try:
        # print("team", request._request.context.team)
        # print("round_id", round_id)
        incoming_case = MinorCaseActive.objects.get(
            team=request._request.context.team, minor_case_round__id=round_id
        )
        # print(incoming_case)
        # for case in incoming_case:
        #     print(case.minor_case_round.id)
    except MinorCaseActive.DoesNotExist:
        return Response({"error": "MinorCaseIncoming not found"}, status=404)

    try:
        active_case = models.MinorCaseCompleted.objects.create(
            team=incoming_case.team,
            minor_case_round=incoming_case.minor_case_round,
            completed_datetime=incoming_case.active_datetime,
        )
        active_case.save()
    except:
        # Extract the error message from the exception
        return Response({"error": "MinorCase already completed"}, status=400)

    return Response({"success": "Move operation successful"}, status=200)


@require_admin
@api_view(["POST"])
def create_vote_event(request: Request) -> Response:
    serializer = VoteEventSerializer(data=request.data)
    team = request._request.context.team

    if serializer.is_valid():
        vote_event = MinorCaseVoteEvent.objects.create(
            timestamp=datetime.now(),
            team=team,
            selected_case=serializer.validated_data.get("selected_case"),
            incoming_event=serializer.validated_data.get("incoming_event"),
        )
        vote_event.save()

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)


def handle_answer(
    answer: str | None, request_context, django_context, puzzle_slug: str
) -> Response:
    print(
        f"submitting for puzzle: {puzzle_slug} with answer: {answer} for team: {django_context.team}"
    )

    puzzle = django_context.team.unlocks.get(puzzle_slug)
    if not puzzle:
        if django_context.is_admin:
            puzzle = Puzzle.objects.get(slug=puzzle_slug)
        else:
            return Response({"error": "Puzzle not unlocked"}, status=403)

    guesses_left = request_context.team.guesses_remaining(puzzle)
    if guesses_left <= 0:
        return Response({"error": "No guesses remaining"}, status=400)

    sanitized_answer = "".join(
        [char for char in puzzle.answer if char.isalpha()]
    ).upper()
    semicleaned_guess = PuzzleMessage.semiclean_guess(answer)
    puzzle_messages = [
        message
        for message in puzzle.puzzlemessage_set.all()
        if semicleaned_guess == message.semicleaned_guess
    ]

    correct = Puzzle.normalize_answer(answer) == sanitized_answer

    try:
        submission = AnswerSubmission.objects.create(
            team=django_context.team,
            puzzle=puzzle,
            submitted_answer=answer,
            is_correct=correct,
            used_free_answer=False,
        )
        submission.save()
    except Exception as e:
        if not puzzle_messages:
            return Response(
                {"error": "Answer submission failed", "error_body": str(e)},
                status=500,
            )

    # if this submission solves the minor case:
    if correct:
        print(f"Correct answer! ({sanitized_answer})")
        send_notification.send(
                None,
                notification_type="solve",
                team=django_context.team,
                title="Congratulations! Case Solved!",
                desc=f"Team {django_context.team} has solved a case! {puzzle.name}!"
            )

        if not request_context.hunt_is_over:
            django_context.team.last_solve_time = request_context.now
            django_context.team.save()

        if puzzle.is_meta:
            print("Solved the minor case!")
            minor_case = puzzle.round
            completed = MinorCaseCompleted.objects.create(
                team=django_context.team,
                minor_case_round=minor_case,
                completed_datetime=request_context.now,
            )
            completed.save()
        elif puzzle.is_major_meta:
            print("Solved the major case!")
            # TODO: major case completion

    return Response(
        {
            "status": "correct" if correct else "incorrect",
            "guesses_left": guesses_left,
            "messages": PuzzleMessageSerializer(puzzle_messages, many=True).data,
        },
        status=200,
    )


@api_view(["POST"])
def submit_answer(request: Request, puzzle_slug: str) -> Response:
    try:
        django_context = request._request.context
        request_context = request.context
        # answer is a query parameter:
        answer = request.query_params.get("answer")
        return handle_answer(answer, request_context, django_context, puzzle_slug)
        # TODO:
        # - puzzle messages
        # - guess limit

    except Puzzle.DoesNotExist:
        return Response({"error": "Puzzle not found"}, status=404)


TESTSOLVE_TEAM = "shhh2"


@api_view(["POST"])
def unlock_case(request: Request, round_slug: str) -> Response:
    try:
        context = request._request.context

        case = Round.objects.get(slug=round_slug)
        team = Team.objects.get(team_name=TESTSOLVE_TEAM)

        Team.unlock_case(team, case, context.now)

        return Response({"status": "success"})
    except Exception as e:
        print(e)
        return Response({"error": "Could not unlock"}, status=404)
