from rest_framework.decorators import api_view
from rest_framework.response import Response
import traceback

ROLE_SOLUTION = {
    "INVISIGUY": "Fool",
    "DAISYCULA": "Resurrected",
    "GORGON": "Assassin",
    "GREEN_RIBBON": "Gossip",
    "WOLF_GUY": "Zealot",
    "HEART_GHOST": "Enchanter",
    "NORMAL_GHOST": "Telepath",
    "HAPPY_GHOST": "Doctor",
    "ANXIOUS_GHOST": "Investigator",
    "SLEEPY_GHOST": "Lover",
}

CORRECT_CONTENT = """great work! now see if you can extract 1 thing more to uncover the author behind this monstrous mess:
 
![](https://lh3.googleusercontent.com/d/1GEHESvXpehovLxUezfrvJlOmdKkU6NXf)"""
INCORRECT_CONTENT = "Try again!"


@api_view(["POST"])
def verdict_guess(request):
    "Checks the solution submission for social-deduction"

    try:
        if (
            "assignments" in request.data
            and request.data["assignments"] == ROLE_SOLUTION
        ):
            return Response({"correct": True, "content": CORRECT_CONTENT})
        return Response({"correct": False, "content": INCORRECT_CONTENT})
    except (KeyError, AttributeError):
        return Response(
            {"error": "Please submit a well-formed response.", "correct": False},
            status=400,
        )
    except (ValueError, IndexError):
        return Response({"error": "...?", "correct": False}, status=400)
    except Exception as e:
        traceback.print_exc()
        return Response(
            {"error": "An error occurred!", "correct": False},
            status=500,
        )
