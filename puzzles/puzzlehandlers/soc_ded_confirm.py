import traceback
import json
from django.views.decorators.http import require_POST
from puzzles.messaging import log_puzzle_info

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

CORRECT_CONTENT = 'You got it!'
INCORRECT_CONTENT = 'Try again!'

@require_POST
def submit(request):
    "Checks the solution submission for social-deduction"

    try:
        body = json.loads(request.body)
        if 'assignments' in body and body['assignments'] ==  ROLE_SOLUTION:
            return {'correct': True, 'content': CORRECT_CONTENT}
        return {'correct': False, 'content': INCORRECT_CONTENT}
    except (KeyError, AttributeError):
        # This error handling is pretty rough.
        return {
            'error': 'Please submit a well-formed response.',
            'correct': False,
        }
    except (ValueError, IndexError):
        return {
            'error': '...?',
            'correct': False,
        }
    except:
        traceback.print_exc()
        return {'error': 'An error occurred!', 'correct': False}
