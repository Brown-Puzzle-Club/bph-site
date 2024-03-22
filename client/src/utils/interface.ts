import { DjangoContext, Puzzle } from "./django_types";

export interface PuzzleParams {
  puzzle: Puzzle;
  context: DjangoContext;
}
