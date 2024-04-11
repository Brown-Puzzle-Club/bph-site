import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PuzzleWrapper from "@/components/puzzle/PuzzleWrapper";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";

import { Error404 } from "./ErrorPage";

function PuzzlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  });

  if (!slug) {
    navigate("/eventpage");
    return <Error404 />;
  }

  return <PuzzleWrapper puzzle_slug={slug} />;
}

export default PuzzlePage;
