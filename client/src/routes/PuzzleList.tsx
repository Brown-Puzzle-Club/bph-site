import { useDjangoContext } from "@/hooks/useDjangoContext";

export default function PuzzleList() {
  const { context } = useDjangoContext();

  return (
    <div>
      <h1>Puzzles:</h1>
      {context?.team_context && (
        <ul className="ml-4">
          {Object.entries(context.team_context.unlocks).map(([majorCase, rounds]) => (
            <li key={majorCase}>
              <a className="font-bold underline" href={`/majorcase/${majorCase}`}>
                {majorCase}
              </a>
              <ul className="ml-4">
                {Object.entries(rounds).map(([round, puzzles]) => (
                  <li key={round}>
                    <h3>{round}</h3>
                    <ul className="ml-4">
                      {Object.entries(puzzles).map(([slug, puzzle]) => (
                        <li key={slug}>
                          <a className="underline" href={`/puzzle/${puzzle.slug}`}>
                            {puzzle.name}
                          </a>
                          {puzzle.is_meta && <span> (META)</span>}
                          {puzzle.round.major_case.slug in context.team_context.solves_by_case &&
                            puzzle.round.slug in
                              context.team_context.solves_by_case[puzzle.round.major_case.slug] &&
                            puzzle.slug in
                              context.team_context.solves_by_case[puzzle.round.major_case.slug][
                                puzzle.round.slug
                              ] && (
                              <span className="text-[green]">
                                {" "}
                                {
                                  context.team_context.solves_by_case[puzzle.round.major_case.slug][
                                    puzzle.round.slug
                                  ][puzzle.slug].submitted_answer
                                }
                              </span>
                            )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
