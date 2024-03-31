import { IS_MINOR_CASE_UNLOCKED } from "@/components/LockedContent";
import CasePageArt from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Error404 } from "./ErrorPage";
import { BeatLoader } from "react-spinners";

function MinorCasePage() {
  const MINOR_CASE_SLUG = window.location.pathname.split("/").pop();
  const { context } = useDjangoContext();

  if (!context?.team_context) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  if (!MINOR_CASE_SLUG || IS_MINOR_CASE_UNLOCKED(MINOR_CASE_SLUG)(context) === false) {
    return <Error404 />;
  }

  return (
    <div>
      <CasePageArt case_slug={MINOR_CASE_SLUG} />
      <h1>{MINOR_CASE_SLUG}</h1>
      {context && context.team_context.unlocks && (
        <div>
          <h2>Puzzles Unlocked</h2>
          {/* TODO: reimplement */}
          {/* <ul>
            {Object.entries(context.team_context.unlocks).map(([slug, puzzle]) =>
              puzzle.round.slug === MINOR_CASE_SLUG ? (
                <li key={slug}>
                  <Link to={`/puzzle/${slug}`}>
                    <strong>{puzzle.name}</strong>: ({slug})
                  </Link>
                </li>
              ) : null,
            )}
          </ul> */}
        </div>
      )}
    </div>
  );
}

export default MinorCasePage;
