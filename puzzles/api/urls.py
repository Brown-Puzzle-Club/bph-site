from rest_framework import routers
from django.urls import include, path
from . import api_views
from . import api_actions
from .puzzlehandlers import urls as puzzle_handlers_urls
from .puzzlehandlers import nyt_games_api

from rest_framework.authtoken.views import obtain_auth_token

app_name = "puzzles-api"

router = routers.DefaultRouter()
router.register(r"user", api_views.UserViewSet, basename="user")
router.register(r"my-team", api_views.TeamViewSet, basename="team")
router.register(r"my-token", api_views.TokenViewSet, basename="token")
router.register(r"teams", api_views.BasicTeamViewSet, basename="team")
router.register(r"team-members", api_views.TeamMemberViewSet, basename="team-member")
router.register(r"errata", api_views.ErrataViewSet, basename="erratum")
router.register(r"rounds", api_views.RoundsViewSet, basename="rounds")
router.register(r"puzzles", api_views.PuzzleViewSet, basename="puzzles")


urlpatterns = [
    path("", api_views.index, name="index"),
    path("puzzle/", include(puzzle_handlers_urls)),
    path("", include(router.urls)),
    path("context", api_views.context, name="context"),
    path("login", api_actions.login_action, name="login"),
    path("logout", api_actions.logout_action, name="logout"),
    path("register", api_actions.register_action, name="register"),
    path("update-team", api_actions.update_team, name="update-team"),
    path(
        "teams/<int:team_id>/members",
        api_views.team_members,
        name="get-team-members",
    ),
    path("create_vote_event", api_actions.create_vote_event, name="create-vote-event"),
    path("unlock-case/<str:round_slug>", api_actions.unlock_case, name="unlock-case"),
    path("major-case/<str:major_case_slug>", api_views.major_case, name="major-case"),
    path("token-auth", obtain_auth_token, name="api_token_auth"),
]
