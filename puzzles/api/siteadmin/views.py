from django.urls import path

from puzzles.api.api_guards import require_admin
from puzzles.models import TeamMember, Team
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
