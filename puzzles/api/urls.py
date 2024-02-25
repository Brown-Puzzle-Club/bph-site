from rest_framework import routers
from django.urls import include, path
from . import views


app_name = 'puzzles-api'

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'my-team', views.TeamViewSet, basename='team')
router.register(r'teams', views.BasicTeamViewSet, basename='team')
router.register(r'team-members', views.TeamMemberViewSet, basename='team-member')
router.register(r'errata', views.ErrataViewSet, basename='erratum')
router.register(r'active-cases', views.MinorCaseActiveViewSet, basename='active-cases')


urlpatterns = [
    path('', views.index, name='index'),
    path('', include(router.urls)),
    path('context', views.context_view, name='context'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register_view, name='register'),
    path('update-team', views.update_team, name='update-team'),
    path('teams/<int:team_id>/members', views.team_members_view, name='get-team-members'),
    path('move_minor_case/<int:round_id>', views.move_minor_case, name='move_minor_case'),
]
