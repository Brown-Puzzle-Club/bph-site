from django.urls import path

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_all_emails", views.get_all_emails, name="get_all_emails"),
    path("get_onsite_emails", views.get_onsite_emails, name="get_onsite_emails"),
    path("get_remote_emails", views.get_remote_emails, name="get_remote_emails"),
    path("get_team_case_solve_count", views.get_team_case_solve_count, name="get_team_case_solve_count"),
]