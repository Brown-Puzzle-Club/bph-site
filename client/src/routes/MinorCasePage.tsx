import CasePageArt from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { DjangoContext } from "@/utils/django_types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorPage from "./ErrorPage";

function MinorCasePage() {
  const MINOR_CASE_SLUG = window.location.pathname.split("/").pop();
  const { FetchContext } = useDjangoContext();
  const [context, setContext] = useState<DjangoContext>();

  useEffect(() => {
    FetchContext().then((context) => {
      console.log(context);
      setContext(context);
    });
  }, [FetchContext]);

  if (!MINOR_CASE_SLUG) {
    return <ErrorPage />;
  }

  return (
    <div>
      <CasePageArt case_slug={MINOR_CASE_SLUG} />
      <h1>{MINOR_CASE_SLUG}</h1>
      {context && context.team_context.unlocks && (
        <div>
          <h2>Puzzles Unlocked</h2>
          <ul>
            {Object.entries(context.team_context.unlocks).map(([slug, puzzle]) =>
              puzzle.round.slug === MINOR_CASE_SLUG ? (
                <li key={slug}>
                  <Link to={`/puzzle/${slug}`}>
                    <strong>{puzzle.name}</strong>: ({slug})
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MinorCasePage;
