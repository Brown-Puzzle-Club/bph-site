import {
  InternalCharacter,
  MISS_TEXT,
  Role,
} from "../../../utils/major_cases/social-deduction/constants";
import CharacterRoleTooltip from "./CharacterRoleTooltip";

const oddStyle = "even:bg-[#2b241ca3] odd:bg-[#2a2218]";
const borderStyle = "border-y border-[#78777736] px-4 py-2";

export default function Chronology({
  CHAR_NAMES,
}: {
  CHAR_NAMES: { [key in InternalCharacter]: string };
}) {
  function collectObscured(
    roles: [InternalCharacter, string][],
    combineMisses: boolean
  ): JSX.Element {
    const miss: JSX.Element = <span>{MISS_TEXT}</span>;
    const acc: JSX.Element[] = [];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i][0];
      const action = roles[i][1];
      if (CHAR_NAMES[role] != MISS_TEXT) {
        acc.unshift(
          <span>
            <CharacterRoleTooltip char_role={role} CHAR_NAMES={CHAR_NAMES} /> {action}
          </span>
        );
      } else if (acc[acc.length - 1] != miss || !combineMisses) {
        acc.push(miss);
      }
    }

    return (
      <div className="">
        {acc.map((e) => (
          <>
            {e}
            <br></br>
          </>
        ))}
      </div>
    );
  }

  return (
    <div className="chronology container mx-auto px-10 mt-8 pb-10">
      <table className="table-auto w-full rounded-xl border-separate text-[white]">
        <thead>
          <tr className="bg-[#2b241ca3]">
            <th className="px-5 py-2"></th>
            <th className="px-4 py-2">Actions</th>
            <th className="px-4 py-2">Kills</th>
          </tr>
        </thead>
        <tbody>
          <tr className={oddStyle}>
            <td className={borderStyle}>Night 1</td>
            <td className={borderStyle}>N/A</td>
            <td className={borderStyle}>N/A</td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Day 1</td>
            <td className={borderStyle}>
              <CharacterRoleTooltip
                char_role={InternalCharacter.NORMAL_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to know that "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.DAISYCULA}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" is a good role."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip
                char_role={InternalCharacter.ANXIOUS_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to check "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.INVISIGUY}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" with "}
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON} CHAR_NAMES={CHAR_NAMES} />
              {" and learns that they are on different teams."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip
                char_role={InternalCharacter.INVISIGUY}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims that he is the "}
              <CharacterRoleTooltip char_role={Role.HEADHUNTER} CHAR_NAMES={CHAR_NAMES} />
              {", and that his target is "}
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON} CHAR_NAMES={CHAR_NAMES} />
              {"."}
            </td>
            <td className={borderStyle}>Town skipped voting.</td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Night 2</td>
            <td className={borderStyle}></td>
            <td className={borderStyle}>
              {collectObscured(
                [
                  [InternalCharacter.ANXIOUS_GHOST, "dies"],
                  [InternalCharacter.SLEEPY_GHOST, "dies"],
                ],
                true
              )}
            </td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Day 2</td>
            <td className={borderStyle}>
              <CharacterRoleTooltip
                char_role={InternalCharacter.NORMAL_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to see that "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.HAPPY_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" is an evil role."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip
                char_role={InternalCharacter.HAPPY_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.DOCTOR} CHAR_NAMES={CHAR_NAMES} />
              {"."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON} CHAR_NAMES={CHAR_NAMES} />
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.BODYGUARD} CHAR_NAMES={CHAR_NAMES} />
              {"."}
            </td>
            <td className={borderStyle}>
              <div className="flex flex-col">
                <div className="border-b border-[#78777736] px-4 py-2">
                  <p className="pb-2">
                    <b>Votes:</b>
                  </p>
                  {collectObscured(
                    [
                      [InternalCharacter.INVISIGUY, " 2"],
                      [InternalCharacter.HAPPY_GHOST, " 7"],
                    ],
                    false
                  )}
                </div>
                <div className="px-4 py-2">
                  <i>{collectObscured([[InternalCharacter.HAPPY_GHOST, " voted out."]], false)}</i>
                </div>
              </div>
            </td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Night 3</td>
            <td className={borderStyle}></td>
            <td className={borderStyle}>N/A</td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Day 3 </td>
            <td className={borderStyle}>
              <CharacterRoleTooltip
                char_role={InternalCharacter.NORMAL_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to see that "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.HEART_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" is an evil role."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON} CHAR_NAMES={CHAR_NAMES} />
              {" claims to have saved "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.DAISYCULA}
                CHAR_NAMES={CHAR_NAMES}
              />
              {"."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip
                char_role={InternalCharacter.GREEN_RIBBON}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.GOSSIP} CHAR_NAMES={CHAR_NAMES} />
              {"."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip
                char_role={InternalCharacter.GREEN_RIBBON}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" says they learned at the beginning of the game that either "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.WOLF_GUY}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" or "}
              <CharacterRoleTooltip
                char_role={InternalCharacter.SLEEPY_GHOST}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" is the "}
              <CharacterRoleTooltip char_role={Role.ZEALOT} CHAR_NAMES={CHAR_NAMES} />
              {"."}
              <br></br>
              <br></br>
              <CharacterRoleTooltip
                char_role={InternalCharacter.WOLF_GUY}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.ZEALOT} CHAR_NAMES={CHAR_NAMES} />
              {"."}
            </td>
            <td className={borderStyle}>
              <div className="flex flex-col">
                <div className="border-b border-[#78777736] px-4 py-2">
                  <p className="pb-2">
                    <b>Votes:</b>
                  </p>
                  {collectObscured(
                    [
                      [InternalCharacter.NORMAL_GHOST, " 3"],
                      [InternalCharacter.INVISIGUY, " 1"],
                      [InternalCharacter.HEART_GHOST, " 4"],
                    ],
                    false
                  )}
                </div>
                <div className="px-4 py-2">
                  <i>{collectObscured([[InternalCharacter.HEART_GHOST, " voted out."]], false)}</i>
                </div>
              </div>
            </td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Night 4</td>
            <td className={borderStyle}></td>
            <td className={borderStyle}>
              {collectObscured([[InternalCharacter.NORMAL_GHOST, "dies"]], true)}
            </td>
          </tr>
          <tr className={oddStyle}>
            <td className={borderStyle}>Day 4</td>
            <td className={borderStyle}>
              <CharacterRoleTooltip
                char_role={InternalCharacter.DAISYCULA}
                CHAR_NAMES={CHAR_NAMES}
              />
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.VILLAGER} CHAR_NAMES={CHAR_NAMES} />
              {"."}
            </td>
            <td className={borderStyle}>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
