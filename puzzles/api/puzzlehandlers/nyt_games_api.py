from rest_framework import permissions, viewsets, mixins
from puzzles import models

from puzzles.api.serializers import *

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

WORDS_ROUND1 = [
    "STITCH",
    "CARPET",
    "BEAST",
    "OX",
    "POOP",
    "DISCO",
    "NEMO",
    "NAUGHTY",
    "SNAIL",
    "NOTE",
    "CAMEL",
    "TREBLE",
    "CHAIN",
    "DUMB",
    "HOOK",
    "CRAP",
]
CONNECTIONS_ROUND1 = {
    "Disney Characters": ["STITCH", "BEAST", "CARPET", "NEMO", "HOOK"],
    "Animals": ["BEAST", "SNAIL", "CAMEL", "OX"],
    "Crochet Terms": ["STITCH", "HOOK", "CHAIN", "TREBLE"],
    "Music Terms": ["DISCO", "NOTE", "TREBLE", "HOOK"],
    "Playground Insults": ["BEAST", "POOP", "NAUGHTY", "DUMB", "CRAP"],
}

WORDS_ROUND2 = [
    "SITCH",
    "CARET",
    "BEAT",
    "O",
    "POP",
    "DISC",
    "EMO",
    "NAUGHT",
    "NAIL",
    "NOT",
    "CAME",
    "TREBLE N/A",
    "CHIN",
    "DUB",
    "HOOK N/A",
    "RAP",
]  # N/A means it can't lose a letter anymore
CONNECTIONS_ROUND2 = {
    "Three-Letter Music Genres": ["POP", "EMO", "RAP", "DUB"],
    "Words Followed By 'Up'": ["BEAT", "POP", "CHIN", "CAME"],
    "Synonyms for 'Punch'": ["BEAT", "POP", "NAIL", "RAP"],
    "Music Terms": ["HOOK", "TREBLE", "BEAT", "DISC", "POP", "EMO", "RAP", "DUB"],
    "Symbols": ["O", "CARET", "TREBLE", "DISC"],
}

WORDS_ROUND3 = [
    "ITCH",
    "CARE",
    "BET",
    "",
    "OP",
    "DIS",
    "MO",
    "AUGHT",
    "NIL",
    "NO",
    "CAM",
    "TREBLE N/A",
    "CHI",
    "DUB N/A",
    "HOOK N/A",
    "RA",
]
CONNECTIONS_ROUND3 = {
    "Nothing": ["", "NIL", "NO", "AUGHT"],
    "Mythological Things": ["DIS", "ROC", "RA", "CHI"],
    "Two-Letter Words": ["OP", "MO", "NO", "RA"],
    "Acronyms": ["OP", "MO", "CARE", "NIL", "RA"],
    "Abbreviated Words": ["OP", "CAM", "DUB", "MO"],
}

WORDS_ROUND4 = [
    "ITCH N/A",
    "ARE",
    "BE",
    "N/A",
    "OP N/A",
    "IS",
    "MO N/A",
    "AUGHT N/A",
    "NIL N/A",
    "NO N/A",
    "AM",
    "TREBLE N/A",
    "HI",
    "DUB N/A",
    "HOOK N/A",
    "A",
]
CONNECTIONS_ROUND4 = {"Forms of 'To Be'": ["ARE", "BE", "IS", "AM"]}


@api_view(["GET"])
def index(request: Request, connection_round: int) -> Response:
    if connection_round == 1:
        words = WORDS_ROUND1
    elif connection_round == 2:
        words = WORDS_ROUND2
    elif connection_round == 3:
        words = WORDS_ROUND3
    elif connection_round == 4:
        words = WORDS_ROUND4
    else:
        return Response({"error": "Invalid round number"})

    return Response({"Words": words})


def check_elements(array1, array2):
    # Convert lists to sets for efficient membership checking
    set1 = set(array1)
    set2 = set(array2)

    # Check if all elements in array1 are present in array2
    for elem in set1:
        if elem not in set2:
            return False
    return True


@api_view(["GET"])
def check(request: Request, connection_round: int, selected_words: str) -> Response:
    answer = ""
    if connection_round == 1:
        connections = CONNECTIONS_ROUND1
    elif connection_round == 2:
        connections = CONNECTIONS_ROUND2
    elif connection_round == 3:
        connections = CONNECTIONS_ROUND3
    elif connection_round == 4:
        connections = CONNECTIONS_ROUND4
        answer = "PLACEHOLDERONE"
    else:
        return Response({"error": "Invalid round number"})

    for connection in connections:
        if check_elements(selected_words.split(","), connections[connection]):
            return Response({"Category": connection, "Answer": answer})

    return Response({"error": "No matching category found"})
