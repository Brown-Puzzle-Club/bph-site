from django.urls import re_path

from puzzles.messaging import TeamNotificationsConsumer, VotingConsumer

websocket_urlpatterns = [
    re_path("^ws/websocket-demo", VotingConsumer.as_asgi()),
    re_path("^ws/puzzles", VotingConsumer.as_asgi()),
    re_path("^ws/notification", TeamNotificationsConsumer.as_asgi())
]
