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

export const getNextNonEmptyTile = (currTile: number, selectedRow: Row, board: string[]) => {
  let tile;
  for (tile = currTile; board[tile] !== "" && tile != -1; tile = getNextTile(tile, selectedRow));
  return tile;
};

export const getPreviousTile = (currTile: number, selectedRow: Row) => {
  switch (selectedRow) {
    case Row.Top: {
      if (0 <= currTile && currTile <= 4) {
        return currTile == 0 ? currTile : currTile - 1;
      }
      break;
    }
    case Row.Middle: {
      if (4 <= currTile && currTile <= 8) {
        return currTile == 4 ? currTile : currTile - 1;
      }
      break;
    }
    case Row.Bottom: {
      if (8 <= currTile && currTile <= 12) {
        const nextTile = { 9: 9, 10: 9, 8: 10, 11: 8, 12: 11 } as const;
        return nextTile[currTile as keyof typeof nextTile];
      }
    }
  }
  return -1;
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

export const getRowString = (row: Row, board: string[]) => {
  switch (row) {
    case Row.Top: {
      return board.slice(0, 5).join("");
    }
    case Row.Middle: {
      return board.slice(4, 9).join("");
    }
    case Row.Bottom: {
      return board[9] + board[10] + board[8] + board[11] + board[12];
    }
    default: {
      return "";
    }
  }
};

export const generateAnswers = (): [string, string, string] => {
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

  return answers as [string, string, string];
};
