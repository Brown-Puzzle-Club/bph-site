import { useDjangoContext } from "@/hooks/useDjangoContext";
import { DjangoContext } from "@/utils/django_types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MinorCasePage() {
  const MINOR_CASE_SLUG = window.location.pathname.split("/").pop();
  console.log(MINOR_CASE_SLUG);
  const { FetchContext } = useDjangoContext();
  const [context, setContext] = useState<DjangoContext>();

  useEffect(() => {
    FetchContext().then((context) => {
      console.log(context);
      setContext(context);
    });
  }, [FetchContext]);

  return (
    <div>
      <h1>{MINOR_CASE_SLUG}</h1>
      {context && context.team_context.unlocks && (
        <div>
          <h2>Puzzles Unlocked</h2>
          <ul>
            {Object.entries(context.team_context.unlocks).map(([puzzleName, unlockTime]) => (
              <li key={puzzleName}>
                <Link to={`/puzzle/${puzzleName}`}>
                  <strong>{puzzleName}</strong>: {unlockTime.toLocaleString()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MinorCasePage;
