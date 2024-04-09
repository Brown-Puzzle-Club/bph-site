from django.urls import path, re_path

from puzzles.messaging import VotingConsumer

from channels.auth import AuthMiddlewareStack
from channels.routing import URLRouter
import django_eventstream

websocket_urlpatterns = [
    re_path("^ws/puzzles", VotingConsumer.as_asgi()),
]

eventstream_urlpatterns = [
    path(
        "notifications/<user_id>",
        AuthMiddlewareStack(
            URLRouter(django_eventstream.routing.urlpatterns),
        ),
        {"format-channels": ["_user-{user_id}"]},
    ),
    path(
        "testevents/",
        AuthMiddlewareStack(
            URLRouter(django_eventstream.routing.urlpatterns),
        ),
        {"channels": ["test"]},
    ),
]
