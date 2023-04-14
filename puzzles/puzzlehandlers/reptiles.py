import traceback
import json
from django.views.decorators.http import require_POST
from puzzles.messaging import log_puzzle_info

    # <tr>
    #     <td style="border: 1px solid white; border-right: 1px solid black;"></td>
    #     <td>Where are we from?</td>
    #     <td><img src="{% static 'puzzle_resources/reptiles-all-the-way-down/99.jpg' %}"></td>
    #     <td>My name indicates that I was an unexpected find</td>
    #     <td><img src="{% static 'puzzle_resources/reptiles-all-the-way-down/97.jpg' %}"></td>
    #     <td>My diet is entirely made of fish eggs</td>
    #     <td><img src="{% static 'puzzle_resources/reptiles-all-the-way-down/95.jpg' %}"></td>
    #     <td>Spiny tubercules cover every part of my body</td>
    #     <td><img src="{% static 'puzzle_resources/reptiles-all-the-way-down/93.jpg' %}"></td>
    #     <td>I am often found on cashew and cacao plantations</td>
    #     <td><img src="{% static 'puzzle_resources/reptiles-all-the-way-down/91.jpg' %}"></td>
    #     <td style="border: 1px solid white;"></td>
    # </tr>

clue_map = {
  1: "https://reptile-database.reptarium.cz/",
  2: "My first venomous bite was recorded in 2009",
  3: "IMAGE",
  4: "I have been known to eat subadult tapirs",
  5: "IMAGE",
  6: "I am the longest-lived lizard, up to 54 years old",
  7: "IMAGE",
  8: "There are less than 250 individuals of my species left",
  9: "IMAGE",
  10: "When threatened, I emit a foul musk from my cloaca",
  11: "IMAGE",
  12: "I am often confused with the more common Caucasus viper",
  13: "IMAGE",
  14: "I glue my eggs under loose bark",
  15: "IMAGE",
  16: "I only live on one island",
  17: "IMAGE",
  18: "I am the only living rhynchocephalian",
  19: "IMAGE",
  20: "I am known for my small eyes",
  21: "IMAGE",
  22: "I am rumored to have toxic breath",
  23: "IMAGE",
  24: "My venom is used to treat type II diabetes",
  25: "IMAGE",
  26: "I killed Karl Schmidt",
  27: "IMAGE",
  28: "I hiss with my epiglottis",
  29: "IMAGE",
  30: "I am a classic example of adaptive radiation",
  31: "IMAGE",
  32: "My local name is zandoli",
  33: "IMAGE",
  34: "I am often infected by the flatworm Griphobilharzia amoena",
  35: "IMAGE",
  36: "I have a big head",
  37: "IMAGE",
  38: "My holotype is at the Field Museum",
  39: "IMAGE",
  40: "I was first described in 2020",
  41: "IMAGE",
  42: "I am named after a major tribe of the Beja people",
  43: "IMAGE",
  44: "I live in the dirt, but I'm not a worm",
  45: "IMAGE",
  46: "I am common on volcanic islands, but not on the nearby coral islands",
  47: "IMAGE",
  48: "Marco Polo was the first European to write about me",
  49: "IMAGE",
  50: "I have a bony plate on my upper eyelid",
  51: "IMAGE",
  52: "I am not a common green forest lizard",
  53: "IMAGE",
  54: "I am smaller than my salty neighbor",
  55: "IMAGE",
  56: "I have the largest length to width ratio of any snake",
  57: "IMAGE",
  58: "I am known only from my original description",
  59: "IMAGE",
  60: "I am a true cobra",
  61: "IMAGE",
  62: "I am the snake that Cleopatra committed suicide with",
  63: "IMAGE",
  64: "I am not named after Orville and Wilbur",
  65: "IMAGE",
  66: "I am a prominent character in the novel Karvalo",
  67: "IMAGE",
  68: "I am not a vampire.",
  69: "IMAGE",
  70: "My name means savior",
  71: "IMAGE",
  72: "I live in leaf litter",
  73: "IMAGE",
  74: "I eat algae",
  75: "IMAGE",
  76: "My only natural predator is the saltwater crocodile",
  77: "IMAGE",
  78: "I am the most commonly exported lizard from southeast Asia",
  79: "IMAGE",
  80: "I am the most popular of my family in the pet trade",
  81: "IMAGE",
  82: "Some synonyms for my name include fancy, baroque, elegant, and rococo",
  83: "IMAGE",
  84: "I mostly eat other snakes, even from my own species",
  85: "IMAGE",
  86: "I glide from tree to tree",
  87: "IMAGE",
  88: "I am the only lizard that spends most of my time in the ocean",
  89: "IMAGE",
  90: "I am the world's smallest lizard.",
  91: "IMAGE",
  92: "I am often found on cashew and cacao plantations",
  93: "IMAGE",
  94: "Spiny tubercules cover every part of my body",
  95: "IMAGE",
  96: "My diet is entirely made of fish eggs",
  97: "IMAGE",
  98: "My name indicates that I was an unexpected find",
  99: "IMAGE",
  100: "Where are we from?"
}

def adjacent(n):
    if n < 1:
        return []

    def position(num):
        row = (num - 1) // 10
        if row % 2 == 0:
            col = (num - 1) % 10
        else:
            col = 9 - (num - 1) % 10
        return row, col

    def number(row, col):
        if row % 2 == 0:
            return row * 10 + 1 + col
        else:
            return (row + 1) * 10 - col

    row, col = position(n)
    adjacents = []

    if row > 0:
        adjacents.append(number(row - 1, col))
    if row < 9:
        adjacents.append(number(row + 1, col))
    if col > 0:
        adjacents.append(number(row, col - 1))
    if col < 9:
        adjacents.append(number(row, col + 1))
    # and the adjacent corners
    if row > 0 and col > 0:
        adjacents.append(number(row - 1, col - 1))
    if row > 0 and col < 9:
        adjacents.append(number(row - 1, col + 1))
    if row < 9 and col > 0:
        adjacents.append(number(row + 1, col - 1))
    if row < 9 and col < 9:
        adjacents.append(number(row + 1, col + 1))
        
    return adjacents

    
def found_adjacent(n, adjs):
    for adj in adjs:
        if n in adj:
            return True
    return False

@require_POST
def submit(request):
    "A crude example of an interactive puzzle handler."

    try:
        body = json.loads(request.body)
        nums = body['nums']
        nums_int = [int(n) for n in nums]

        if len(nums_int) != 3 or len(set(nums_int)) != 3:
            return {'error': 'You must choose 3 unique cells.'}

        cnt_even = 0
        cnt_odd = 0
        for n in nums_int:
            if n % 2 == 0:
                cnt_even += 1
            else:
                cnt_odd += 1
            
        if cnt_even != 2 and cnt_odd != 1:
            return {'error': 'You must build a snake out of 2 even squares and 1 odd.'} 

        adjs = [adjacent(n) for n in nums_int]
        for n in nums_int:
            if not found_adjacent(n, adjs): 
              return {'error': 'All cells chosen must be adjacent to each other.'} 

        result_dict = {}
        for n in sorted(nums_int):
            clue = clue_map[n]
            if clue.startswith('IMAGE'):
                result_dict[n] = f'{n}.jpg'
            else:
                result_dict[n] = clue


        return {'result': result_dict}
    except (KeyError, AttributeError):
        # This error handling is pretty rough.
        return {
            'error': 'Please submit a well-formed response.',
        }
    except (ValueError, IndexError):
        return {
            'error': 'Please submit whole numbers into the fields provided.',
        }
    except:
        traceback.print_exc()

        # You may wish to provide more details or a call to action. Do you want
        # the solvers to retry, or email you?
        return {'error': 'An error occurred!'}
