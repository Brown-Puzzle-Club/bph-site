import traceback
import json
import math
from django.views.decorators.http import require_POST
from puzzles.messaging import log_puzzle_info

inputs = [
    'A5C1C0DE',
    'DEC15105',
    'D1DAC1C5',
    '60DD55E5',
    'F0CEFEED',
    'AC1D1F1D',
    'AB5CE5E5',
    'DAABA5E5',
    '5AC1F1CE',
    'B51C1DEA',
    'A550C1AE',
    '6E0D51C5',
]
result_col_width = 16;
error_col_width = 60

def hex_function_machine(f):
    """
    Creates and returns a function which applies f to hex strings and returns
    a string of the result, throwing an error if the result is not an integer.
    """
    def func(hex_str):
        result = f(int(hex_str, 16))
        if result % 1 != 0:
            raise ValueError(" ERROR: Transformation produced a non-integer result.")
        elif result < 0:
            raise ValueError(" ERROR: Transformation produced a negative result.")
        return hex(int(result))[2:].upper()

    return func

def simplify_hex_string(hex_str):
    return hex(int(hex_str, 16))[2:].upper()

def reverse_string(s):
    if s == "":
        return ""
    else:
        return reverse_string(s[1:]) + s[0]
    
def length_sensitive(f, hexit):
    """
    Takes an operator f on numbers and a single hexit and returns a function that uses the
    hexit to generate a number of the same length as its input and combines them using f.
    This is to be used to create functions to provide to hex_function_machine.
    """
    if len(hexit) != 1:
        raise ValueError("Hexit length must be exactly 1. {0} has length {1}.".format(hexit, len(hexit)))

    def wrapper(n):
        hex_str = "{0:X}".format(n).zfill(len(hexit))
        return f(int(hex_str, 16), int(hexit * len(hex_str), 16))

    return wrapper

def reverse_string(s):
    if s == "":
        return ""
    else:
        return reverse_string(s[1:]) + s[0]

def peel_string(s):
    if len(s) <= 1:
        return s
    else:
        return s[0] + s[-1] + peel_string(s[1:-1])

def cut_and_swap(s):
    cut_index = len(s) // 2 + len(s) % 2
    return s[cut_index:] + s[:cut_index]

transformations = [
    hex_function_machine(lambda n: n / 2),
    lambda hex_str: reverse_string(simplify_hex_string(hex_str)),
    hex_function_machine(lambda n: n * 3),
    hex_function_machine(lambda n: n * 5),
    hex_function_machine(length_sensitive(lambda a, b: a + b, "1")),
    hex_function_machine(lambda n: n / 3),
    hex_function_machine(length_sensitive(lambda a, b: a - b, "2")),
    lambda hex_str: peel_string(simplify_hex_string(hex_str)),
    hex_function_machine(lambda n: n / 5),
    hex_function_machine(length_sensitive(lambda a, b: b - a, "F")),
    hex_function_machine(lambda n: n * n),
    lambda hex_str: cut_and_swap(simplify_hex_string(hex_str)),
]

passwords = [transformations[i](x) for i,x in enumerate(inputs)]

def password_guess_overlap(password, guess):
    """
    Computes and returns the strings to display correctly
    guessed letters in a given password.
    """
    result = ""
    remainder = ""
    limit = len(guess) if len(guess) < len(password) else len(password)
    for i in range(limit):
        if password[i] == guess[i]:
            result += password[i]
        else:
            result += "•"
    if len(guess) < 8:
        remainder += "•" * (len(password) - len(guess))
    return (result, remainder)

def display_results(guess):
    """
    Takes a guessed number (in string form) and returns a list of dictionaries, where each dictionary represents the
    result for one password. Each dictionary has the following keys:
        - response_text: the response text to be displayed
        - overlap: the overlap component of the response, including the progress bar string
        - has_errors: a boolean indicating whether there are any errors or warnings in the result
    """
    results = []

    for i in range(len(passwords)):
        response_text = ''
        overlap = ''
        has_errors = False

        try:
            transformed = transformations[i](guess)

            if len(transformed) != len(passwords[i]):
                message = " WARNING: Result has length " + str(len(transformed)).upper() + "."
                response_text += message.ljust(error_col_width)
                has_errors = True
            else:
                response_text += " No errors or warnings :)".ljust(error_col_width)

            [o, r] = password_guess_overlap(passwords[i], transformed)

            if not '•' in o and r == '':
                overlap += "<b><u style='color: green;'>{}</u></b>".format(o)
            else:
                overlap += "<b><u style='color: orange;'>{}</u></b>{}".format(o, r)

        except Exception as e:
            m = str(e)
            response_text += m.ljust(error_col_width)
            overlap += "<span style='color: darkred;'>{}</span>".format("█" * result_col_width)
            has_errors = True

        results.append({
            'response_text': response_text,
            'overlap': overlap,
            'has_errors': has_errors
        })

    return results

@require_POST
def submit(request):
    "A crude example of an interactive puzzle handler."

    try:
        body = json.loads(request.body)

        guess = body['guess'].upper()

        if not guess:
            return {'error': 'Type a number and press Enter to make a guess.'}

        if not all(c in '0123456789ABCDEF' for c in guess):
            return {'error': f'{guess} is not a number I recognize.', 'correct': False}
        
        table = display_results(guess)

        guess_san = guess.lstrip("0") if guess != "0" else "0"

        return {'table': table, 'guess': guess_san}
    except (KeyError, AttributeError):
        # This error handling is pretty rough.
        return {
            'error': 'Please submit a well-formed response.'
        }
    except (ValueError, IndexError):
        return {
            'error': 'Please submit an integer between 1 and 11 for the index.'
        }
    except:
        traceback.print_exc()
        return {'error': 'An error occurred!', 'correct': False}
