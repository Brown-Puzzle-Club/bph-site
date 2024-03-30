import { possibleWords } from "./wordList";

export enum Row {
  None = -1,
  Top = 0,
  Middle = 1,
  Bottom = 2,
}

export enum GameMode {
  Hangman,
  FinalWordle,
}

export enum GameState {
  InProgress,
  Win,
  Lose,
}

export enum VerificationState {
  Correct,
  SameMiss,
  DiffCorrect,
  DiffMiss,
  Incorrect,
  Unverified,
}

export interface Character {
  letter: string;
  verified: VerificationState;
}

export interface Guess {
  guess: [Character, Character, Character, Character, Character];
  row: Omit<Row, Row.None>;
}

export type Board = Character[];
export type WordVerification = [
  VerificationState,
  VerificationState,
  VerificationState,
  VerificationState,
  VerificationState,
];

export const idToRow = (id: number) => {
  if (id == 4) {
    return [Row.Top, Row.Middle];
  } else if (id == 8) {
    return [Row.Middle, Row.Bottom];
  } else if (id < 4) {
    return [Row.Top];
  } else if (id < 8) {
    return [Row.Middle];
  } else {
    return [Row.Bottom];
  }
};

export const getNextTile = (currTile: number, selectedRow: Row) => {
  switch (selectedRow) {
    case Row.Top: {
      if (0 <= currTile && currTile <= 4) {
        return currTile == 4 ? -1 : currTile + 1;
      }
      break;
    }
    case Row.Middle: {
      if (4 <= currTile && currTile <= 8) {
        return currTile == 8 ? -1 : currTile + 1;
      }
      break;
    }
    case Row.Bottom: {
      if (8 <= currTile && currTile <= 12) {
        const nextTile = { 9: 10, 10: 8, 8: 11, 11: 12, 12: -1 } as const;
        return nextTile[currTile as keyof typeof nextTile];
      }
    }
  }
  return -1;
};

export const getNextNonEmptyTile = (currTile: number, selectedRow: Row, board: Board) => {
  let tile;
  for (
    tile = currTile;
    tile != -1 && board[tile].letter !== "";
    tile = getNextTile(tile, selectedRow)
  );
  return tile;
};

export const getPreviousTile = (currTile: number, selectedRow: Row) => {
  switch (selectedRow) {
    case Row.Top: {
      if (0 <= currTile && currTile <= 4) {
        return currTile == -1 ? currTile : currTile - 1;
      }
      break;
    }
    case Row.Middle: {
      if (4 <= currTile && currTile <= 8) {
        return currTile == -1 ? currTile : currTile - 1;
      }
      break;
    }
    case Row.Bottom: {
      if (8 <= currTile && currTile <= 12) {
        const nextTile = { 9: -1, 10: 9, 8: 10, 11: 8, 12: 11 } as const;
        return nextTile[currTile as keyof typeof nextTile];
      }
    }
  }
  return -1;
};

export const getPreviousFilledNotCorrectTile = (
  currTile: number,
  selectedRow: Row,
  board: Board,
) => {
  let tile;
  for (
    tile = currTile;
    tile != -1 && (board[tile].letter === "" || board[tile].verified === VerificationState.Correct);
    tile = getPreviousTile(tile, selectedRow)
  );
  return tile;
};

export const getLastTile = (selectedRow: Row) => {
  switch (selectedRow) {
    case Row.Top: {
      return 4;
    }
    case Row.Middle: {
      return 8;
    }
    case Row.Bottom: {
      return 12;
    }
    default: {
      return -1;
    }
  }
};

export const getRowString = (row: Row, board: Board) => {
  const boardLetter = board.map((character) => character.letter);
  switch (row) {
    case Row.Top: {
      return boardLetter.slice(0, 5).join("");
    }
    case Row.Middle: {
      return boardLetter.slice(4, 9).join("");
    }
    case Row.Bottom: {
      return boardLetter[9] + boardLetter[10] + boardLetter[8] + boardLetter[11] + boardLetter[12];
    }
    default: {
      return "";
    }
  }
};

export const generateAnswers = (): [string, string, string, string] => {
  const answers = [possibleWords[Math.floor(Math.random() * possibleWords.length)]];

  while (answers.length < 2) {
    const newWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    if (!answers.includes(newWord) && newWord[0] === answers[0][4]) {
      answers.push(newWord);
    }
  }

  while (answers.length < 3) {
    const newWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    if (!answers.includes(newWord) && newWord[2] === answers[1][4]) {
      answers.push(newWord);
    }
  }

  while (answers.length < 4) {
    const newWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    if (!answers.includes(newWord)) {
      answers.push(newWord);
    }
  }

  return answers as [string, string, string, string];
};

const boardIndexToWordIndex = (index: number, selectedRow: Row) => {
  switch (selectedRow) {
    case Row.Top: {
      return index;
    }
    case Row.Middle: {
      return index - 4;
    }
    case Row.Bottom: {
      const map = { 9: 0, 10: 1, 8: 2, 11: 3, 12: 4 };
      return map[index as keyof typeof map];
    }
    default: {
      return -1;
    }
  }
};

export const clearRow = (selectedRow: Row, board: Board, verificationGuess: WordVerification) => {
  const newBoard = [...board];
  const removeCorrectLetters = verificationGuess.some((v) => v !== VerificationState.Correct);

  newBoard.forEach((_character, i) => {
    if (
      idToRow(i).includes(selectedRow) &&
      (removeCorrectLetters ||
        verificationGuess[boardIndexToWordIndex(i, selectedRow)] !== VerificationState.Correct)
    ) {
      newBoard[i] = { letter: "", verified: VerificationState.Unverified };
    } else if (idToRow(i).includes(selectedRow)) {
      newBoard[i].verified = VerificationState.Correct;
    }
  });
  return newBoard;
};

// TODO: handle repeat letters correcty!
export const verifyGuess = (
  guess: string,
  answers: string[],
  selectedRow: Omit<Row, Row.None>,
): [
  VerificationState,
  VerificationState,
  VerificationState,
  VerificationState,
  VerificationState,
] => {
  const verificationArray = [];
  const correctAnswer = answers[selectedRow as keyof typeof answers] as string;
  const correctAnswerLetters = correctAnswer.split("");
  const otherAnswers = answers.filter((_, i) => i !== selectedRow);
  const otherAnswersLetters = otherAnswers.map((answer) => answer.split(""));

  for (let i = 0; i < 5; i++) {
    if (correctAnswer[i] === guess[i]) {
      verificationArray.push(VerificationState.Correct);
      correctAnswerLetters.splice(correctAnswerLetters.indexOf(guess[i]), 1);
    } else if (correctAnswerLetters.includes(guess[i])) {
      verificationArray.push(VerificationState.SameMiss);
      correctAnswerLetters.splice(correctAnswerLetters.indexOf(guess[i]), 1);
    } else if (otherAnswers.some((answer) => answer[i] === guess[i])) {
      verificationArray.push(VerificationState.DiffCorrect);
      otherAnswersLetters.forEach((answer) => {
        if (answer[i] === guess[i]) {
          answer.splice(answer.indexOf(guess[i]), 1);
        }
      });
    } else if (otherAnswersLetters.some((letters) => letters.includes(guess[i]))) {
      verificationArray.push(VerificationState.DiffMiss);
      otherAnswersLetters.forEach((letters) => {
        if (letters.includes(guess[i])) {
          letters.splice(letters.indexOf(guess[i]), 1);
        }
      });
    } else {
      verificationArray.push(VerificationState.Incorrect);
    }
  }

  return verificationArray as [
    VerificationState,
    VerificationState,
    VerificationState,
    VerificationState,
    VerificationState,
  ];
};
