import os
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

from puzzles.api.api_guards import require_admin
from puzzles.models import VoiceRecording
from django.contrib.postgres.search import SearchVector


@api_view(["GET"])
def search_voice_recordings(request: Request) -> Response:
    """Search for voice recordings by text, for the interactive database puzzle."""
    query = request.GET.get("q", "").strip()
    print(f"searching for query {query}")
    if not query or len(query) < 1 or len(query) > 100:
        return Response({"error": "Please enter a valid search query."}, status=400)
    results = (
        VoiceRecording.objects.annotate(
            search=SearchVector("transcript"),
        )
        .filter(search=query)
        .order_by("hour")[:5]
    )

    # Alternative search method, using icontains instead of SearchVector:
    # results = VoiceRecording.objects.filter(transcript__icontains=query).order_by('timestamp')[:5]

    return Response({"results": [result.to_dict() for result in results]})


VOICE_DATA_RELATIVE_PATH = "../../static/data/voicedata-3-25.tsv"


@api_view(["POST"])
@require_admin
def admin_create_voice_recordings(request: Request) -> Response:
    """Create a voice recording for the interactive database puzzle."""
    # remove all previous values from the database
    VoiceRecording.objects.all().delete()

    working_dir = os.path.dirname(os.path.abspath(__file__))

    with open(os.path.join(working_dir, VOICE_DATA_RELATIVE_PATH), "r") as f:
        for line in f.readlines():
            # table is tab separated
            parts = line.strip().split("\t")
            transcript, search_text, hour, characters = (
                parts[0],
                parts[1],
                parts[2],
                parts[3],
            )
            print(f"Creating voice recording for {characters} at {hour}:00")
            # print(search_text)
            VoiceRecording.objects.create(
                transcript=transcript,
                search_text=search_text,
                hour=int(hour),
                characters=characters,
            )

    return Response({"status": "success"})
