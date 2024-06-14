import { useEffect } from "react";
import { useParams } from "react-router-dom";

import SolutionWrapper from "@/components/puzzle/SolutionWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";

import { Error404 } from "./ErrorPage";

function SolutionPage() {
  const { slug } = useParams();

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  });

  const { data: context } = useDjangoContext();

  if (!slug) {
    return <Error404 />;
  }

  if (context && !context.hunt_context.hunt_is_closed && !context.team_context.is_admin) {
    return <Error404 />;
  }

  return <SolutionWrapper puzzle_slug={slug} />;
}

export default SolutionPage;
