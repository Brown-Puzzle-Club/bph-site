import axios from "axios";
// @ts-expect-error untyped import :(
import isDictionaryWord from "check-dictionary-word";

export interface Letter {
  sides: number[];
  // Unique index of a letter in the puzzle!
  index: number;
  letter: string;
  uses: number;
}

export class Puzzle {
  public letters: (Letter | null)[][];
  public initialIdx: number;

  constructor(letters: (Letter | null)[][], initialIdx: number) {
    this.letters = letters;
    this.initialIdx = initialIdx;
  }

  public getLetterDict(): Map<number, Letter> {
    const letterDict = new Map<number, Letter>();
    for (let i = 0; i < this.letters.length; i++) {
      const row = this.letters[i];
      for (let j = 0; j < row.length; j++) {
        const letter = row[j];
        if (letter !== null) {
          letterDict.set(letter.index, letter);
        }
      }
    }
    return letterDict;
  }
}

export class Solution {
  private puzzleNum: 1 | 2 | 3;
  private puzzle: Puzzle;
  // A list of 'words', which are letter sequences
  public solution: number[][];
  // Dictionary from index to letters from puzzle
  private letterDict: Map<number, Letter>;
  private setAnswer: (answer: string | null) => void;

  constructor(
    puzzleNum: 1 | 2 | 3,
    puzzle: Puzzle,
    solution: number[][],
    setAnswer: (answer: string | null) => void,
  ) {
    this.puzzleNum = puzzleNum;
    this.puzzle = puzzle;
    this.solution = solution;
    // Dictionary from index to letters from puzzle
    this.letterDict = new Map<number, Letter>();
    for (let i = 0; i < puzzle.letters.length; i++) {
      const row = puzzle.letters[i];
      for (let j = 0; j < row.length; j++) {
        const letter = row[j];
        if (letter !== null) {
          this.letterDict.set(letter.index, letter);
        }
      }
    }
    this.setAnswer = setAnswer;
  }

  /**
   * Gets a map of index: uses of all the letters in the puzzle.
   */
  private getLetterUses(): Map<number, number> {
    const letterUses = new Map<number, number>();
    const letters = [this.puzzle.initialIdx].concat(this.solution.flat());
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      letterUses.set(letter, (letterUses.get(letter) || 0) + 1);
    }
    return letterUses;
  }

  /**
   * Checks letter-level validity. This is used in intermediate steps when words are not
   * yet fully formed so doesn't do word or puzzle checks. Specifically:
   *  - Adjacent letters do not have any common `letter.sides`.
   *  - The letter is not used more than it is available (total `letter.uses`) across all words.
   *    That is, count the number of times the letter is used in the solution and compare to the
   *    number of times it is available in the puzzle. Ignore the count for the first letter of
   *    each word since it is being chained up.
   */
  public checkLetterValidity(): boolean {
    const letters = [this.puzzle.initialIdx].concat(this.solution.flat());
    // Check that adjacent letters do not have any common `letter.sides`
    for (let i = 0; i < letters.length - 1; i++) {
      const letter1 = this.letterDict.get(letters[i])!;
      const letter2 = this.letterDict.get(letters[i + 1])!;
      if (letter1.sides.some((side) => letter2.sides.includes(side))) {
        return false;
      }
    }
    // Check that the letter is not used more than it is available
    const letterUses = this.getLetterUses();
    for (let i = 0; i < letters.length; i++) {
      const letter = this.letterDict.get(letters[i])!;
      if (i !== 0 && letterUses.get(letter.index)! > letter.uses) {
        return false;
      }
    }
    return true;
  }

  public getWords(): string[] {
    // Copy solution, for every list in solution, append to the front the last idx of the previous list, or initialIdx
    const words = [];
    for (let i = 0; i < this.solution.length; i++) {
      if (i === 0) {
        words.push([this.puzzle.initialIdx]);
      } else {
        words.push([this.solution[i - 1][this.solution[i - 1].length - 1]]);
      }
      words[i].push(...this.solution[i]);
    }
    return words.map((word) => word.map((idx) => this.letterDict.get(idx)!.letter).join(""));
  }

  /**
   * Run upon entering word, to check whether all the words are valid so far.
   * Also check letter-level validity.
   *
   * For every word that is not the first, append the first letter of the previous word to the
   * current word. This is because the words are chained together.
   */
  public checkWordValidity(): boolean {
    // Check letter validity
    if (!this.checkLetterValidity()) {
      return false;
    }
    // Check word validity
    for (const word of this.getWords()) {
      if (!isDictionaryWord(word)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Does the following to check whether a solution is valid (locally):
   * - Each word is a valid word in the dictionary
   * - Each letter in the puzzle is used
   */
  public checkSolutionValidity(): boolean {
    // Check word validity
    if (!this.checkWordValidity()) {
      return false;
    }
    // Check that all letters are used
    const letterUses = this.getLetterUses();
    for (let i = 0; i < this.puzzle.letters.length; i++) {
      const row = this.puzzle.letters[i];
      for (let j = 0; j < row.length; j++) {
        const letter = row[j];
        if (letter !== null) {
          if (letterUses.get(letter.index) !== letter.uses) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Serializes the solution into a string, comma-separated between letters and semicolon-separated between words
   */
  public serialize() {
    return this.solution
      .map((word) => word.map((letter) => this.letterDict.get(letter)!.index.toString()).join(","))
      .join(";");
  }

  public attemptPushLetter(idx: number): boolean {
    console.log("attemptPushLetter: " + this.letterDict.get(idx)!.letter);
    // Pushes idx to the last list in solution
    this.solution[this.solution.length - 1].push(idx);
    console.log(this.solution);
    // Checks if the letters are valid
    if (!this.checkLetterValidity()) {
      console.log("letter invalid");
      // If not, pop the letter off
      this.solution[this.solution.length - 1].pop();
      return false;
    }
    return true;
  }

  public popLetter() {
    // Pops the last letter off the last list.
    // If the list is empty, pop the list off the solution.
    if (this.solution[this.solution.length - 1].length > 0) {
      this.solution[this.solution.length - 1].pop();
      return true;
    } else if (this.solution.length > 1) {
      this.solution.pop();
      return true;
    }
    return false;
  }

  public nextWord() {
    // Checks word validity
    if (!this.checkWordValidity()) {
      return false;
    }
    if (this.checkSolutionValidity()) {
      this.submit();
      return true;
    }
    // Adds a new list to the solution
    this.solution.push([]);
    return true;
  }

  private async submit() {
    console.log("submitting");
    this.setAnswer("submitting...");
    const url = "/api/puzzle/nyt/letterboxed";
    const data = {
      puzzleNum: this.puzzleNum,
      solution: this.serialize(),
    };
    const response = await axios.post(url, data);
    // get response
    console.log(response);
    if (response.data.correct) {
      this.setAnswer(response.data.answer);
    } else {
      this.setAnswer("An error occurred, contact HQ");
    }
  }
}

export enum LetterState {
  LOCKED,
  PENDING,
  CURRENT,
  NONE,
}
