from django.urls import path

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view


@api_view(["GET"])
def index(request: Request) -> Response:
    return Response({"Puzzle": "Handlers"})


urlpatterns = [
    path("", index, name="index"),
    # HELPERS FOR SPECIFIC PUZZLES CAN GO HERE. TRY TO MAKE THE SLUGS MATCH THE PUZZLE SLUGS.
    # (for instance, if working on puzzle [slug])
    # path("[slug]/do-something", [slug]_api.do_something))
    #                                             ^---- each interactive puzzle should have its own [slug]_api.py file in this directory.
    path("<slug>/", index, name="puzzle-index"),
]
