import CharacterRoleTooltip from "./CharacterRoleTooltip";
import { Role } from "./SocialDeductionEnums";


export default function Rules() {
  return (
    <div className="rules content px-10 py-10">
      <ul className="space-y-1 list-disc list-inside">
        <li>This game consists of multiple rounds, each with two phases: a night phase and a day phase.</li>
        <li>Night Phase 1 is a set-up round. Each player will be assigned a role in secret and no roles will be duplicated, though some roles will remain unused. During night 1, every player except the Assassin will be able to perform their role-designated action if they have one. No one will be killed by the Assassin on the first night.</li>
        <li>Every role belongs to one of three designations: Village, Evil, and Solo. All Village players are trying to work together to identify the Assassin and exile them by voting. The Evil players are trying to kill all the Village and Solo players. Any Solo player is on their own team (Solo players do not work together) and has a separate win condition.</li>
        <li>The Assassin must be a part of every game.</li>
        <li>During the night phase, if a player has a nighttime ability, they will perform that action in the following order
          <ul className="list-[circle] list-inside ps-10">
            <li>Silencer + Enchanter + Assassin (evil team)</li>
            <li><CharacterRoleTooltip char_role={Role.LOVER} scale={false}/></li>
            <li>Body Guard</li>
            <li>Doctor</li>
            <li>Telepath</li>
            <li>Investigator</li>
          </ul>
        </li>
        <li>All players must use their action if they are able to.</li>
        <li>All players on the evil team will know each other and what roles they are.</li>
        <li>During the day phase, all characters can talk to each other. After discussion, any player can accuse any other player of being evil. All accused players will have a chance to defend themselves and all accusers will give a reasoning. Then votes are cast anonymously (players may vote for anyone, even a non-accused player or themselves). Votes are tallied and if a player has the majority of votes (and at least half), they will be exiled. If the votes are tied, no one is exiled.</li>
        <li>After votes are tallied and anyone voted out has been exiled, a new night phase begins.</li>
        <li>Once a player has been killed/exiled they can no longer talk or vote.</li>
        <li>The Village team wins once the Assassin has been exiled by the Village. It does not matter if other Evil players are still alive.</li>
        <li>The Evil team wins when the Evil players equal or out-number the combined total of Village and Solo players.</li>
        <li>A Solo player wins when their specific win condition is met. They do not win if the Village wins, nor if the Evil team wins.</li>
      </ul>
    </div>
  )
}