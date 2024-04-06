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
    "Synonyms for 'Punch'": ["BEAT", "POP", "NAIL", "RAP", "HOOK"],
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

@api_view(["GET"])
def check_nyt_answers(request: Request, answers: str) -> Response:
    answers = answers.split(",")
    if len(answers) != 3:
        return Response({"error": "Invalid number of answers"}, status=400)

    if answers == ["1", "2", "3"]:
        return Response({"correct": True, "answer": '''…TRANSPARENT J. ECKLEBURG (1969-2024). Born to loving parents Rhonda and Bernard Eckleburg in Yeehaw Junction, Florida, Eckleburg grew up in a small house surrounded by his 27 brothers and sisters. Money was tight, so his parents made extra cash by providing a home for disabled alligators. Eckleburg was often known to reminisce on his childhood full of reptiles, an upbringing that inspired such Wordle answers as #325 (GECKO) and #952 (SNAKE). 
	Eckleburg loved all things puzzle from a young age, winning the grand ultimate super extreme national crossword competition every consecutive year since age 5. His parents and teachers praised him as a prodigy, with his fourth-grade teacher Mrs. Williams recalling, “He once turned in a 17-page essay on the Great Gatsby, and I was floored to find that the entire composition was a palindrome!” Eckleburg breezed through school, and then received a scholarship to Florida State University through a scholarship granted by the Puzzling Prodigies Foundation for those Gifted with Wordplay. When asked for a comment on his passing, the foundation noted that his application review committee was floored by his ability to utilize previously unheard-of synonyms for common words, a skill that would later prove useful in his invention of the now widely beloved game, Connections. Eckleburg majored in puzzle production with a minor in wordplay, graduating as the valedictorian of his class (see Wordle #15, GRADE). 
	Shortly after graduation, Eckleburg moved to New York City to pursue his dream of writing puzzles for the most excellent games section in all of the country. Initially unable to find a job, he worked briefly as a tour guide for a NYC ghost tour, hence Wordle #687 (GHOUL). For the rest of his life, Eckleburg would claim that he could commune with the dead, often purporting to consult the spirits of famous writers such as Dickens, Hemingway, and Shakespeare when afflicted with writer’s block. One day while on the way home from the Smallpox Memorial Hospital, Eckleburg was mauled by a particularly large subway rat. His injuries left him unconscious for days, but a xenografted pig heart saved his life, inspiring Wordle #767 (HEART). 
This near-death experience prompted Eckleburg to finally fulfill his dreams of submitting a puzzle to the New York Times. His confounding crossword captivated curious curators, landing him a permanent gig on the NYT Games team. As the first human to evolve past the need for sleep, he wrote hundreds of thousands of award-winning puzzles during the 168 hours each week he was contracted to work. We have Eckleburg to thank for such innovative games as Wordle, Connections, and Letterboxed. Not all of his ideas were hits, such as a quiz on the preferred sock colors of various historical figures, and the inadvertent establishment of a cryptocurrency-based gambling ring based on the functionality of a random McDonald’s ice cream machine (see Wordle #672, BROKE). Regardless of his missteps, his contributions to the newspaper puzzling industry will never be forgotten. 
Eckleburg died Wednesday night surrounded by all of his siblings and his pet tarantula, Eugene. He will be remembered fondly by all of those whose lives his puzzles impacted, and sincerely missed by those of us here at the New York Times. 
'''})
    else:
        return Response({"correct": False})