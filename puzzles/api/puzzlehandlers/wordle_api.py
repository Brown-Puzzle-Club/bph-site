from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request

from ..api_actions import handle_answer


@api_view(["POST"])
def verify_guess(request: Request) -> Response:
    django_context = request._request.context
    request_context = request.context
    if not django_context.team or "wordle" not in django_context.team.unlocks:
        return Response({"error": "Puzzle is not unlocked"}, status=400)

    guess = request.data["guess"].lower()
    if len(guess) != 5:
        return Response({"error": "invalid guess"}, status=400)

    answer = "NOOSE".lower()

    answer_letters = list(answer)
    verification_array = [
        "incorrect",
        "incorrect",
        "incorrect",
        "incorrect",
        "incorrect",
    ]

    # check for correct guesses
    for i, (guess_char, answer_char) in enumerate(zip(guess, answer)):
        if guess_char == answer_char:
            verification_array[i] = "correct"
            answer_letters.remove(guess_char)

    for i, (guess_char, answer_char) in enumerate(zip(guess, answer)):
        # check for misses
        if guess_char in answer_letters:
            verification_array[i] = "miss"
            answer_letters.remove(guess_char)

    if all(map(lambda x: x == "correct", verification_array)):
        # answer is a query parameter:
        handle_answer(guess, request_context, django_context, "wordle")

    return Response({"verification": verification_array}, status=200)
