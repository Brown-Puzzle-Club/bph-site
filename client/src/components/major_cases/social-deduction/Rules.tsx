import {
  EVIL_TEXT_COLOR,
  GOOD_TEXT_COLOR,
  Role,
  SOLO_TEXT_COLOR,
} from "../../../utils/major_cases/social-deduction/constants";
import CharacterRoleTooltip from "./CharacterRoleTooltip";
import { GiBatwingEmblem } from "react-icons/gi";
import {
  EVIL_TEXT_COLOR,
  GOOD_TEXT_COLOR,
  Role,
  SOLO_TEXT_COLOR,
} from "../../../utils/major_cases/social-deduction/constants";
import CharacterRoleTooltip from "./CharacterRoleTooltip";
import { GiBatwingEmblem } from "react-icons/gi";

export default function Rules() {
  return (
    <div className="rules content px-20 pb-10">
      <div className="flavor-card bg-[#ded5c0] rounded-sm m-6 border-2 border-[#00000054] text-slate-950 flex flex-col items-center px-20">
        <GiBatwingEmblem className="mt-5 text-3xl" />
        <p className="p-5 text-center">
          You are cordially invited to witness the game of a lifetime (or the end of many).
          <br />
          <br />
          Hotel Ghoulsby is hosting their 10th annual Assassin's Tournament, whereby 10 lucky
          players will take on their chosen roles in a game of intrigue, lies, and horribly
          difficult deductions. But this year the tournament has turned out more lethal than they've
          intended.
          <br />
          <br />
          It's the last night of the game, and you must determine which guest is masquerading as
          which role in order to help the village win. Once you've done that, you'll need to work
          out: <b>who's been turning the game into a bloodbath?</b>
        </p>
      </div>
      <div className="text-break h-1 w-50 bg-[#80808024] mx-auto mb-5 mt-5 rounded-md"></div>
      <p className="font-bold pb-3 text-3xl">The Rules</p>
      <ul className="space-y-3 list-disc list-outside">
        <li>
          This game consists of multiple rounds, each with two phases: a night phase and a day
          phase.
        </li>
        <li>
          Night Phase 1 is a set-up round. Each player will be assigned a role in secret, with no
          duplicate roles, though some roles will remain unused. During night 1, every player except
          the <CharacterRoleTooltip char_role={Role.ASSASSIN} scale={false} /> will be able to
          perform their role-designated action if they have one. No one will be killed by the{" "}
          <CharacterRoleTooltip char_role={Role.ASSASSIN} scale={false} /> on the first night.
        </li>
        <li>
          Every role belongs to one of three designations:{" "}
          <b style={{ color: GOOD_TEXT_COLOR }}>Village</b>,{" "}
          <b style={{ color: EVIL_TEXT_COLOR }}>Evil</b>, and{" "}
          <b style={{ color: SOLO_TEXT_COLOR }}>Solo</b>. All{" "}
          <b style={{ color: GOOD_TEXT_COLOR }}>Village</b> players are trying to work together to
          identify the <CharacterRoleTooltip char_role={Role.ASSASSIN} scale={false} /> and exile
          them by voting. The <b style={{ color: EVIL_TEXT_COLOR }}>Evil</b> players are trying to
          kill all <b style={{ color: GOOD_TEXT_COLOR }}>Village</b> and{" "}
          <b style={{ color: SOLO_TEXT_COLOR }}>Solo</b> players. Any{" "}
          <b style={{ color: SOLO_TEXT_COLOR }}>Solo</b> player is on their own team (
          <b style={{ color: SOLO_TEXT_COLOR }}>Solo</b> players do not work together) and has a
          separate win condition.
        </li>
        <li>
          The <CharacterRoleTooltip char_role={Role.ASSASSIN} scale={false} /> must be a part of
          every game.
        </li>
        <li>
          During the night phase, if a player has a nighttime ability, they will perform that action
          in the following order:
          <ul className="list-[circle] list-outside ps-10 space-y-1">
            <li>
              <CharacterRoleTooltip char_role={Role.SILENCER} scale={false} />,{" "}
              <CharacterRoleTooltip char_role={Role.ENCHANTER} scale={false} />,{" "}
              <CharacterRoleTooltip char_role={Role.ASSASSIN} scale={false} /> (evil team)
            </li>
            <li>
              <CharacterRoleTooltip char_role={Role.LOVER} scale={false} />
            </li>
            <li>
              <CharacterRoleTooltip char_role={Role.BODYGUARD} scale={false} />
            </li>
            <li>
              <CharacterRoleTooltip char_role={Role.DOCTOR} scale={false} />
            </li>
            <li>
              <CharacterRoleTooltip char_role={Role.TELEPATH} scale={false} />
            </li>
            <li>
              <CharacterRoleTooltip char_role={Role.INVESTIGATOR} scale={false} />
            </li>
          </ul>
        </li>
        <li>All players must use their action if they are able to.</li>
        <li>All players on the evil team will know each other and what roles they have.</li>
        <li>
          During the day phase, all characters can talk to each other. After discussion, any player
          can accuse any other player of being evil. All accused players will have a chance to
          defend themselves and all accusers will give a reasoning. Then votes are cast anonymously
          (players may vote for anyone, even a non-accused player or themselves). Votes are tallied
          and if a player has the majority of votes (and at least half), they will be exiled. If the
          votes are tied, no one is exiled.
        </li>
        <li>
          After votes are tallied and anyone voted out has been exiled, a new night phase begins.
        </li>
        <li>Once a player has been killed/exiled, they can no longer talk or vote.</li>
        <li>
          The <b style={{ color: GOOD_TEXT_COLOR }}>Village</b> team wins once the{" "}
          <CharacterRoleTooltip char_role={Role.ASSASSIN} scale={false} /> has been exiled by the{" "}
          <b style={{ color: GOOD_TEXT_COLOR }}>Village</b> or killed for any other reason. It does
          not matter if other <b style={{ color: EVIL_TEXT_COLOR }}>Evil</b> players are still
          alive.
        </li>
        <li>
          The <b style={{ color: EVIL_TEXT_COLOR }}>Evil</b> team wins when the{" "}
          <b style={{ color: EVIL_TEXT_COLOR }}>Evil</b> players equal or out-number the combined
          total of <b style={{ color: GOOD_TEXT_COLOR }}>Village</b> and{" "}
          <b style={{ color: SOLO_TEXT_COLOR }}>Solo</b> players.
        </li>
        <li>
          A <b style={{ color: SOLO_TEXT_COLOR }}>Solo</b> player wins when their specific win
          condition is met. They do not win if the <b style={{ color: GOOD_TEXT_COLOR }}>Village</b>{" "}
          wins, nor if the <b style={{ color: EVIL_TEXT_COLOR }}>Evil</b> team wins.
        </li>
      </ul>
    </div>
  );
}
