import PuzzleWrapper from "@/components/puzzle/PuzzleWrapper";
import { useMemo } from "react";
import ErrorPage from "./ErrorPage";

function PuzzlePage() {
  const puzzle_slug = useMemo(() => {
    return window.location.pathname.split("/").pop();
  }, []);

  if (!puzzle_slug) {
    return <ErrorPage />;
  }

  return <PuzzleWrapper puzzle_slug={puzzle_slug} />;
}

export default PuzzlePage; 
