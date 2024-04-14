import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PuzzleWrapper from "@/components/puzzle/PuzzleWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";

import { Error404 } from "./ErrorPage";

function PuzzlePage() {
  const { slug } = useParams();

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  });

  const { data: context } = useDjangoContext();

  if (!slug) {
    // navigate("/eventpage");
    return <Error404 />;
  }

  if (context && !context.hunt_context.hunt_has_started && !context.team_context.is_admin) {
    return <Error404 />;
  }

  return <PuzzleWrapper puzzle_slug={slug} />;
}

export default PuzzlePage;
