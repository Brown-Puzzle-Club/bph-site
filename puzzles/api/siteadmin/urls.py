from django.urls import path

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_all_emails", views.get_emails, name="otherindex"),
]

