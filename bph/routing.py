from django.urls import re_path

from puzzles.messaging import TeamNotificationsConsumer, HintsConsumer, VotingConsumer

websocket_urlpatterns = [
    re_path("^ws/team$", TeamNotificationsConsumer.as_asgi()),
    re_path("^ws/hints$", HintsConsumer.as_asgi()),
    re_path("^ws/websocket-demo", VotingConsumer.as_asgi()),
    re_path("^ws/puzzles", VotingConsumer.as_asgi()),
    re_path("^ws/notification", TeamNotificationsConsumer.as_asgi())
]
