import PuzzleWrapper from "@/components/puzzle/PuzzleWrapper";
import { useEffect, useMemo } from "react";
import ErrorPage from "./ErrorPage";
import { DEFAULT_THEME } from "@/utils/themes";
import { useTheme } from "@/hooks/useTheme";

function PuzzlePage() {
  const puzzle_slug = useMemo(() => {
    return window.location.pathname.split("/").pop();
  }, []);

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  });

  if (!puzzle_slug) {
    return <ErrorPage />;
  }

  return <PuzzleWrapper puzzle_slug={puzzle_slug} />;
}

export default PuzzlePage;
