import traceback
import json
from django.views.decorators.http import require_POST
from puzzles.messaging import log_puzzle_info

hexes = [
    'DEC1DE',
    'FECE5',
    'FEE',
    'CA5E',
    'FACE',
    'C0D',
    '50',
    '15',
    'DEAD',
    '51DE',
    '5AFE5',
    'BA55'
]

answers = sorted([int(h, 16) for h in hexes])

@require_POST
def submit(request):
    "A crude example of an interactive puzzle handler."

    try:
        body = json.loads(request.body)

        guess = body['guess'].upper()

        if not guess:
            return {'table': 'Type a number and press Enter to make a guess.', 'correct': False}

        if not all(c in '0123456789ABCDEF' for c in guess):
            return {'table': f'{guess} is not a number I recognize.', 'correct': False}

        guess_val = int(guess, 16)
        hit = guess_val in answers

        # hline = "+" + "-"*4 + "+" + "-"*14 + "+\n"
        # table = f'Results for {guess}\n{hline}'

        # for i, answer in enumerate(answers):
        #     row = f"| {i+1:02d} |"
        #     if guess_val < answer:
        #         row += " too small" + " "*4
        #     elif guess_val == answer:
        #         row += " just right!" + " "*2
        #     else:
        #         row += " too big" + " "*6
        #     row += "|"
        #     table += row + hline

        table = []
        for i, answer in enumerate(answers):
            table.append({
                'index': i+1,
                'result': 'too small' if guess_val < answer else 'just right!' if guess_val == answer else 'too big',
            })

        return {'table': table, 'correct': hit}
    except (KeyError, AttributeError):
        # This error handling is pretty rough.
        return {
            'error': 'Please submit a well-formed response.',
            'correct': False,
        }
    except (ValueError, IndexError):
        return {
            'error': 'Please submit an integer between 1 and 11 for the index.',
            'correct': False,
        }
    except:
        traceback.print_exc()
        return {'error': 'An error occurred!', 'correct': False}
