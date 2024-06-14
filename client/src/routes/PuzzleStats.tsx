import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import BackButton from "@/components/BackButton";
import PuzzleStatWrapper from "@/components/stats/PuzzleStatWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { MajorCaseEnum } from "@/utils/constants";
import { DEFAULT_THEME } from "@/utils/themes";

import { Error404 } from "./ErrorPage";

function PuzzleStats() {
  const { slug } = useParams();

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  });

  const { data: context } = useDjangoContext();

  const isMajorCase = useMemo(() => {
    return Object.values(MajorCaseEnum).includes(slug as MajorCaseEnum);
  }, [slug]);

  if (!slug) {
    // navigate("/eventpage");
    return <Error404 />;
  }

  if (context && !context.hunt_context.hunt_has_started && !context.team_context.is_admin) {
    return <Error404 />;
  }

  return (
    <div>
      <BackButton to={isMajorCase ? `/majorcase/${slug}` : `/puzzle/${slug}`} />
      <PuzzleStatWrapper slug={slug} />
    </div>
  );
}

export default PuzzleStats;
