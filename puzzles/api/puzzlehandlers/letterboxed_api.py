from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view
from dataclasses import dataclass

from puzzles.api.api_actions import handle_answer
from . import twl


@dataclass
class PuzzleLetter:
    sides: list[int]
    index: int
    letter: str
    uses: int


@dataclass
class Puzzle:
    letters: list[PuzzleLetter]
    initialIdx: int


puzzles = {
    1: Puzzle(
        [
            PuzzleLetter([0], 0, "i", 1),
            PuzzleLetter([0], 1, "o", 1),
            PuzzleLetter([0], 2, "r", 1),
            PuzzleLetter([0], 3, "a", 1),
            PuzzleLetter([0], 4, "t", 1),
            PuzzleLetter([1], 5, "c", 1),
            PuzzleLetter([1], 6, "n", 1),
            PuzzleLetter([1], 7, "m", 1),
            PuzzleLetter([1], 8, "o", 1),
            PuzzleLetter([1], 9, "n", 1),
            PuzzleLetter([2], 10, "o", 1),
            PuzzleLetter([2], 11, "r", 1),
            PuzzleLetter([2], 12, "a", 1),
            PuzzleLetter([2], 13, "t", 1),
            PuzzleLetter([2], 14, "o", 1),
        ],
        5,
    ),
    2: Puzzle(
        [
            PuzzleLetter([0], 0, "e", 2),
            PuzzleLetter([0], 1, "a", 2),
            PuzzleLetter([0], 2, "u", 1),
            PuzzleLetter([1], 3, "l", 1),
            PuzzleLetter([1], 4, "r", 2),
            PuzzleLetter([1], 5, "i", 2),
            PuzzleLetter([2], 6, "c", 1),
            PuzzleLetter([2], 7, "g", 1),
            PuzzleLetter([2], 8, "b", 1),
            PuzzleLetter([3], 9, "b", 1),
            PuzzleLetter([3], 10, "t", 3),
        ],
        6,
    ),
    3: Puzzle(
        [
            PuzzleLetter([0], 0, "b", 1),
            PuzzleLetter([0], 1, "r", 3),
            PuzzleLetter([0], 2, "m", 2),
            PuzzleLetter([0, 1], 3, "u", 2),
            PuzzleLetter([1], 4, "f", 2),
            PuzzleLetter([1], 5, "s", 2),
            PuzzleLetter([1], 6, "k", 1),
            PuzzleLetter([1, 2], 7, "a", 1),
            PuzzleLetter([2], 8, "n", 3),
            PuzzleLetter([2], 9, "c", 2),
            PuzzleLetter([2], 10, "m", 1),
            PuzzleLetter([2, 3], 11, "e", 1),
            PuzzleLetter([3], 12, "g", 3),
            PuzzleLetter([3], 13, "t", 1),
            PuzzleLetter([3, 4], 14, "i", 6),
            PuzzleLetter([4], 15, "l", 1),
            PuzzleLetter([4], 16, "h", 2),
            PuzzleLetter([4], 17, "d", 1),
            PuzzleLetter([4, 0], 18, "o", 1),
        ],
        4,
    ),
}

answers = {
    1: "Solved!",
    2: "Solved!",
    3: "Solved!",
}


def checkSolution(puzzle: Puzzle, solution: list[list[int]]) -> bool:
    # check uses
    flattenedSolution = [puzzle.initialIdx] + [
        idx for sublist in solution for idx in sublist
    ]
    # check the number of times each index shows up is the same as the uses in the letter
    for letter in puzzle.letters:
        if flattenedSolution.count(letter.index) != letter.uses:
            return False
    # get list of words
    wordsIdx = [
        ([solution[idx - 1][~0]] + word if idx > 0 else [puzzle.initialIdx] + word)
        for idx, word in enumerate(solution)
    ]
    # convert words to strings
    words = ["".join([puzzle.letters[idx].letter for idx in word]) for word in wordsIdx]
    # check each word
    for word in words:
        if not twl.check(word):
            return False
    return True


@api_view(["POST"])
def check(request: Request) -> Response:
    errorResponse = Response(
        {
            "correct": False,
            "error": "There was something wrong with your request, please contact HQ.",
        }
    )
    print("got request!")
    puzzleNum = int(request.data["puzzleNum"])  # type: ignore
    solutionStr: str = request.data["solution"]  # type: ignore
    if puzzleNum not in [1, 2, 3]:
        return errorResponse
    solution = [[int(l) for l in word.split(",")] for word in solutionStr.split(";")]
    print(f"solution for {puzzleNum}: {solution}")
    if checkSolution(puzzles[puzzleNum], solution):
        return Response({"correct": True, "answer": answers[puzzleNum]})
    return errorResponse


@api_view(["POST"])
def checkall(request: Request) -> Response:
    errorResponse = Response(
        {
            "correct": False,
            "error": "There was something wrong with your request, please contact HQ.",
        }
    )
    print("got request!")
    solutionStrs = [request.data["solution1"], request.data["solution2"], request.data["solution3"]]  # type: ignore
    solutions = [[[int(l) for l in word.split(",")] for word in solutionStr.split(";")] for solutionStr in solutionStrs]  # type: ignore
    if (
        checkSolution(puzzles[1], solutions[0])
        and checkSolution(puzzles[2], solutions[1])
        and checkSolution(puzzles[3], solutions[2])
    ):
        answer = "KINGFISHER"
        # auto solve the puzzle:
        django_context = request._request.context  # type: ignore
        request_context = request.context
        # answer is a query parameter:
        handle_answer(answer, request_context, django_context, "lettertroxd")
        return Response({"correct": True})
    return errorResponse
