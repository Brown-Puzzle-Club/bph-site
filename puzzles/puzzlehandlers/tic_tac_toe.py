import traceback
import json
from django.views.decorators.http import require_POST
from puzzles.messaging import log_puzzle_info

SOLUTION = ['X','X','O','X','X','O','O','O','X','X','X','O','O','O','O','X']

FINAL_BLOCK = """<h4><b>The Final</b></h4>
  Circle the letter for all answers that are correct, and cross out the letter for the ones that aren't. I know we didn't actually give you any of the questions or answers, but you should be able to complete the test without them. Nobody is going to be there holding your hand when you enter the real world.
  <ol class="final-list">
    <li>
      <img src="/static/puzzle_resources/tic-tac-toe/disk.jpg"><br>
      d. This one<br>
      n. This one<br>
      e. This one<br>
      j. This one
    </li>
    <li>
      <img src="/static/puzzle_resources/tic-tac-toe/disk with two holes.jpg">
      a. This one<br>
      o. This one<br>
      u. This one<br>
      s. This one
    </li>
    <li>
      <img src="/static/puzzle_resources/tic-tac-toe/cylinder.jpg">
      r. This one<br>
      i. This one<br>
      e. This one<br>
      n. This one
    </li>
    <li>
      <img src="/static/puzzle_resources/tic-tac-toe/mobius strip.png">
      a. This one<br>
      l. This one<br>
      g. This one<br>
      d. This one
    </li>
  </ol>"""

@require_POST
def submit(request):
    "A crude example of an interactive puzzle handler."
    
    # 2. Persist it on the server. You can just add a puzzle-specific model
    # with a foreign key to Team. If you have strong performance needs and are
    # feeling adventurous, you might even add an in-memory store like Redis or
    # something.
    #
    # Advantages of 2: Easy to share state between team members. Don't need
    # additional complexity to prevent client-side tampering with state. Easier
    # to collect statistics about solving after the fact. If you don't get
    # client-side state right the first time, fixing it after some solvers have
    # made partial progress can be a pain; server-side state lets you at least
    # keep the possibility of manually introspecting or fixing it as needed.

    try:
        body = json.loads(request.body)
        # print("assessing tic-tac-toe submission...")
        guesses = body['guesses']
        # print(guesses)
        num_correct = 0
        tot_qs = len(guesses)
        for i in range(len(guesses)):
            if guesses[i] == SOLUTION[i]:
                num_correct += 1
        
        percentage_correct = num_correct / tot_qs

        if (percentage_correct >= 0.8):
            return {'correct': True, 'final_block': FINAL_BLOCK}
        else:
            return {'correct': False}
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

        # You may wish to provide more details or a call to action. Do you want
        # the solvers to retry, or email you?
        return {'error': 'An error occurred!', 'correct': False}
