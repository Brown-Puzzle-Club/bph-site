import axios from "axios";

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
  private puzzle: Puzzle;
  // A list of 'words', which are letter sequences
  public solution: number[][];
  // Dictionary from index to letters from puzzle
  private letterDict: Map<number, Letter>;

  constructor(puzzle: Puzzle, solution: number[][]) {
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

  /**
   * Run upon entering word, to check whether all the words are valid so far.
   * Also check letter-level validity.
   *
   * For every word that is not the first, append the first letter of the previous word to the
   * current word. This is because the words are chained together.
   */
  public checkWordValidity(): boolean {
    // Gets list of words
    // TODO: Implement
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
    // const url = "/api/puzzle/nyt-games/letterboxed/1";
    // const data = {
    //   solution: this.serialize(),
    // };
    // const response = await axios.post(url, data);
    // console.log(response);
  }
}

export enum LetterState {
  LOCKED,
  PENDING,
  CURRENT,
  NONE,
}