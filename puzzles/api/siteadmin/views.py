from collections import defaultdict
from django.urls import path

from puzzles.api.api_guards import require_admin
from puzzles.models import (
    AnswerSubmission,
    EventCompletion,
    MajorCaseCompleted,
    MinorCaseCompleted,
    MinorCaseVoteEvent,
    TeamMember,
    Team,
)
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view


@api_view(["GET"])
def index(request: Request) -> Response:
    return Response({"Admin": "Queries"})


@api_view(["GET"])
@require_admin
def get_all_emails(request: Request) -> Response:

    team_members = TeamMember.objects.all()

    emails = [tm.email for tm in team_members]

    return Response({"data": emails})


@api_view(["GET"])
@require_admin
def get_onsite_emails(request: Request) -> Response:

    teams = Team.objects.all()
    emails = []
    for team in teams:
        if team.in_person:
            emails += team.get_emails()

    return Response({"data": emails})


@api_view(["GET"])
@require_admin
def get_remote_emails(request: Request) -> Response:

    teams = Team.objects.all()
    emails = []
    for team in teams:
        if not team.in_person:
            emails += team.get_emails()

    return Response({"data": emails})


@api_view(["GET"])
@require_admin
def get_team_case_solve_count(request: Request) -> Response:

    visible_teams = Team.objects.filter(is_hidden=False)

    team_major_case_solve_count = {}
    major_case_solves = MajorCaseCompleted.objects.all()
    for solve in major_case_solves:
        team = solve.team
        if team not in visible_teams:
            continue
        if team.team_name in team_major_case_solve_count:
            team_major_case_solve_count[team.team_name] += 1
        else:
            team_major_case_solve_count[team.team_name] = 1

    team_minor_case_solve_count = {}
    minor_case_solves = MinorCaseCompleted.objects.all()
    for solve in minor_case_solves:
        team = solve.team
        if team not in visible_teams:
            continue
        if team.team_name in team_minor_case_solve_count:
            team_minor_case_solve_count[team.team_name] += 1
        else:
            team_minor_case_solve_count[team.team_name] = 1

    team_puzzle_solve_count = {}
    puzzle_solves = AnswerSubmission.objects.filter(is_correct=True)
    for solve in puzzle_solves:
        team = solve.team
        if team not in visible_teams:
            continue
        if team.team_name in team_puzzle_solve_count:
            team_puzzle_solve_count[team.team_name] += 1
        else:
            team_puzzle_solve_count[team.team_name] = 1

    team_event_solve_count = {}
    event_solves = EventCompletion.objects.all()
    for solve in event_solves:
        team = solve.team
        if team not in visible_teams:
            continue
        if team.team_name in team_event_solve_count:
            team_event_solve_count[team.team_name] += 1
        else:
            team_event_solve_count[team.team_name] = 1

    end_data = []
    for team in visible_teams:
        end_data.append(
            {
                "team_name": team.team_name,
                "in_person": team.in_person,
                "major_case_solves": team_major_case_solve_count.get(team.team_name, 0),
                "minor_case_solves": team_minor_case_solve_count.get(team.team_name, 0),
                "puzzle_solves": team_puzzle_solve_count.get(team.team_name, 0),
                "event_solves": team_event_solve_count.get(team.team_name, 0),
            }
        )

    return Response({"data": end_data})


@api_view(["GET"])
@require_admin
def get_most_chosen_cases(request: Request) -> Response:

    # cases = Round.objects.all()

    completed_votes = MinorCaseVoteEvent.objects.all()

    case_votes = defaultdict(int)

    for vote_event in completed_votes:
        for vote in vote_event.final_votes.all():
            case_votes[vote.minor_case.slug] += 1

    return Response({"data": case_votes})
