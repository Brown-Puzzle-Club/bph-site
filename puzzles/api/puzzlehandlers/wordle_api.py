from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request

from ..api_actions import handle_answer

@api_view(["POST"])
def verify_guess(request: Request) -> Response:
    guess = request.data["guess"].lower()
    if len(guess) != 5 :
        return Response({"error": "invalid guess"}, status=400)

    answer = "NOOSE".lower()

    answer_letters = list(answer)
    verification_array = []

    for guess_char, answer_char in zip(guess, answer):
        if guess_char == answer_char:
            verification_array.append("correct")
            answer_letters.remove(guess_char)
        elif guess_char in answer_letters:
            verification_array.append("miss")
            answer_letters.remove(guess_char)
        else:
            verification_array.append("incorrect")

    if all(map(lambda x: x == "correct", verification_array)):
        django_context = request._request.context
        request_context = request.context
        # answer is a query parameter:
        handle_answer(guess, request_context, django_context, "wordle")

    return Response({"verification": verification_array}, status=200)