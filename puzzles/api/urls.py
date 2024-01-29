from rest_framework import routers
from django.urls import include, path
from . import views

app_name = 'puzzles-api'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'my-team', views.TeamViewSet, basename='team')
router.register(r'teams', views.BasicTeamViewSet, basename='team')

urlpatterns = [
    path('', views.index, name='index'),
    path('', include(router.urls)),
]
