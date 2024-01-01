import CharacterRoleTooltip from "./CharacterRoleTooltip";
import { CHAR_NAME, InternalCharacter, MISS_TEXT, Role } from "./constants";


function collectObscured(roles: [InternalCharacter, string][], combineMisses: boolean): JSX.Element {
  const miss: JSX.Element = <span>{MISS_TEXT}</span>
  const acc: JSX.Element[] = []
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i][0];
    const action = roles[i][1];
    if (CHAR_NAME[role] != MISS_TEXT) {
      acc.unshift(<span><CharacterRoleTooltip char_role={role}/> {action}</span>)
    } else if (acc[acc.length-1] != miss || !combineMisses) {
      acc.push(miss)
    }
  }
  
  return (
    <div className="">
          {acc.map((e) => <>{e}<br></br></>)}
    </div>
  )
}

export default function Chronology() {
  return (
    <div className="chronology container mx-auto mt-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-2 py-2"></th>
            <th className="border px-4 py-2">Actions</th>
            <th className="border px-4 py-2">Kills</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-2">Night 1</td>
            <td className="border px-4 py-2">N/A</td>
            <td className="border px-4 py-2">
              N/A
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Day 1</td>
            <td className="border px-4 py-2">
              <CharacterRoleTooltip char_role={InternalCharacter.NORMAL_GHOST}/>
              {" claims to know that "}
              <CharacterRoleTooltip char_role={InternalCharacter.DAISYCULA}/>
              {" is a good role."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.ANXIOUS_GHOST}/>
              {" claims to check "}
              <CharacterRoleTooltip char_role={InternalCharacter.INVISIGUY}/>
              {" with "}
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON}/>
              {" and learns that they are on different teams."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.INVISIGUY}/>
              {" claims that he is the "}
              <CharacterRoleTooltip char_role={Role.HEADHUNTER}/>
              {", and that his target is "}
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON}/>
              {"."}

            </td>
            <td className="border px-4 py-2">
              Town skipped voting.
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Night 2</td>
            <td className="border px-4 py-2">???</td>
            <td className="border px-4 py-2">
              {collectObscured([[InternalCharacter.ANXIOUS_GHOST,"dies"],[InternalCharacter.SLEEPY_GHOST,"dies"]],true)}
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Day 2</td>
            <td className="border px-4 py-2">
              <CharacterRoleTooltip char_role={InternalCharacter.NORMAL_GHOST}/>
              {" claims to see that "}
              <CharacterRoleTooltip char_role={InternalCharacter.HAPPY_GHOST}/>
              {" is an evil role."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON}/>
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.BODYGUARD}/>
              {"."}
            </td>
            <td className="border px-4 py-2">
              <div className="flex flex-col">
                <div className="border-b px-4 py-2">
                  <p className="pb-2"><b>Votes:</b></p>
                  {collectObscured([[InternalCharacter.INVISIGUY," 1"],[InternalCharacter.HAPPY_GHOST," 8"]],false)}
                </div>
                <div className="px-4 py-2">
                  <i>{collectObscured([[InternalCharacter.HAPPY_GHOST," voted out."]],false)}</i>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Night 3</td>
            <td className="border px-4 py-2">???</td>
            <td className="border px-4 py-2">
              N/A
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Day 3 </td>
            <td className="border px-4 py-2">
              <CharacterRoleTooltip char_role={InternalCharacter.NORMAL_GHOST}/>
              {" claims to see that "}
              <CharacterRoleTooltip char_role={InternalCharacter.HEART_GHOST}/>
              {" is an evil role."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.GORGON}/>
              {" claims to have saved "}
              <CharacterRoleTooltip char_role={InternalCharacter.DAISYCULA}/>
              {"."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.GREEN_RIBBON}/>
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.GOSSIP}/>
              {"."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.GREEN_RIBBON}/>
              {" says they learned at the beginning of the game that either "}
              <CharacterRoleTooltip char_role={InternalCharacter.WOLF_GUY}/>
              {" or "}
              <CharacterRoleTooltip char_role={InternalCharacter.SLEEPY_GHOST}/>
              {" is the "}
              <CharacterRoleTooltip char_role={Role.ZEALOT}/>
              {"."}
              <br></br><br></br>
              <CharacterRoleTooltip char_role={InternalCharacter.WOLF_GUY}/>
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.ZEALOT}/>
              {"."}
            </td>
            <td className="border px-4 py-2">
              <div className="flex flex-col">
                <div className="border-b px-4 py-2">
                  <p className="pb-2"><b>Votes:</b></p>
                  {collectObscured([[InternalCharacter.NORMAL_GHOST," 3"],[InternalCharacter.INVISIGUY," 1"],[InternalCharacter.HEART_GHOST," 4"]],false)}
                </div>
                <div className="px-4 py-2">
                  <i>{collectObscured([[InternalCharacter.HEART_GHOST," voted out."]],false)}</i>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Night 4</td>
            <td className="border px-4 py-2">???</td>
            <td className="border px-4 py-2">
            {collectObscured([[InternalCharacter.NORMAL_GHOST,"dies"]],true)}
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2">Day 4</td>
            <td className="border px-4 py-2">
              <CharacterRoleTooltip char_role={InternalCharacter.DAISYCULA}/>
              {" claims to be the "}
              <CharacterRoleTooltip char_role={Role.VILLAGER}/>
              {"."}
            </td>
            <td className="border px-4 py-2">
              -
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}