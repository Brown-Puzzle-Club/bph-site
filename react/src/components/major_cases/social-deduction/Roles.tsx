import CharacterRoleTooltip, { EVIL_TEXT_COLOR, GOOD_TEXT_COLOR, SOLO_TEXT_COLOR } from "./CharacterRoleTooltip";
import { Role } from "./SocialDeductionEnums";

function RoleDisplay ({role}: {role: Role}) {
  return (
    <>
      <span className="text-xl"><CharacterRoleTooltip char_role={role} scale={false}/>:</span>
      <br></br></>
      )
  }

export default function Roles() {
  return (
    <div className="roles content p-10">
      <ul className="space-y-5">
        <li><RoleDisplay role={Role.ASSASSIN}/> At night, the Assassin convenes with the Silencer and Enchanter under the gleam of the haunting moon. <i>The Assassin acts as the primary villain of the game</i>, assisted by their cronies. Assassins are a part of the evil team. Collectively, the evil team can vote on one player to kill on every night except the first.</li>
        <li><RoleDisplay role={Role.BODYGUARD}/> The Bodyguard was hired by the Hotel Ghoulsby to protect the guests from this game of dire stakes. <i>Their job is to choose one guest every night to protect them</i> from the forces that be. If the player they are protecting is attacked, they can take a hit on behalf of their protected guest and that player will survive. They have a total of two hits before they die, which can be taken either directly by the evil team voting to kill them (1 hit) or if the player they are protecting is set to die (1 hit). If they are voted out by the <b style={{color: GOOD_TEXT_COLOR}}>Village</b>, they do not have an extra life and will be exiled if the <b style={{color: GOOD_TEXT_COLOR}}>Village</b> votes for them.</li>
        <li><RoleDisplay role={Role.DOCTOR}/> The noble doctor has devoted their work to saving other's lives, but now their own is at stake. This obligation to the Hippocratic oath means their work must continue even during a well-needed vacation at Hotel Ghoulsby and they can <i>choose one player to protect each night of the game</i>. If that player is attacked, neither the doctor nor the player are injured. However, the Doctor may not protect themselves, so if they are directly targeted they will die.</li>
        <li><RoleDisplay role={Role.ENCHANTER}/> The Enchanter has psychic visions to assist the evil team by <i>obscuring the auras of their fellow players</i>. With the power granted them by their mystical enchants, they can make one player appear to have an evil aura when viewed by the Telepath. Though powerful, this spell only lasts for one night and the true aura will resume the next night.</li>
        <li><RoleDisplay role={Role.FOOL}/> A depressed cad with some double-crossing tendencies. The Fool is neither good nor evil, but they feel trapped as a servant at Hotel Ghoulsby and want to leave. <i>They win the game if they are exiled by their <b style={{color: GOOD_TEXT_COLOR}}>Village</b></i>, but do not win if they are killed by the <b style={{color: EVIL_TEXT_COLOR}}>Evil</b> team because, coincidentally, they'll never escape if they're dead.</li>
        <li><RoleDisplay role={Role.GOSSIP}/> Always up for a gab, the Gossip knows the sordid truths that plague the halls of Hotel Ghoulsby. As a member of the villager team, <i>they have the ability to learn that a certain role is played by one of two players at the beginning of the game.</i></li>
        <li><RoleDisplay role={Role.HEADHUNTER}/> Why help others when you could make a living killing them? The Headhunter is given a target that they must seek to get voted out by the town. They win the game and receive their reward if this target is killed by the <b style={{color: GOOD_TEXT_COLOR}}>Village</b>. Their target is always on the <b style={{color: GOOD_TEXT_COLOR}}>Village</b> team. </li>
        <li><RoleDisplay role={Role.INVESTIGATOR}/> Ever the observer, the Investigator was brought into the game to help the villagers crack the case… or die trying. <i>Each night, they learn whether any two players are on the same team</i> (ie <b style={{color: GOOD_TEXT_COLOR}}>Village</b>, <b style={{color: EVIL_TEXT_COLOR}}>Evil</b>, or <b style={{color: SOLO_TEXT_COLOR}}>Solo</b>). They do not learn which team the players are on, only that they are on the same or different teams. Two <b style={{color: SOLO_TEXT_COLOR}}>Solo</b> players will appear to be on different teams.</li>
        <li><RoleDisplay role={Role.LOVER}/> An all-around loving person with more to share. As a member of the villager team the Lover visits one player each night. Unfortunately, they're not always the best at choosing their company. <i>If the player they visit is evil OR if that player is killed by the Assassin on that night, the Lover will die.</i></li>
        <li><span className="text-xl"><CharacterRoleTooltip char_role={Role.RESURRECTED} scale={false}/> (<b style={{color: GOOD_TEXT_COLOR}}>Village</b> or <b style={{color: EVIL_TEXT_COLOR}}>Evil</b>):</span><br></br> An indecisive villager with a serial killer gene. The Resurrected <i>acts as a villager until they are killed by the Assassin, at which point they join the evil team.</i></li>
        <li><RoleDisplay role={Role.SILENCER}/> It's always the quiet ones. <i>The Silencer can choose one player each night who will not be able to use their night-time action on that night.</i> Only lasts for one night.</li>
        <li><RoleDisplay role={Role.TELEPATH}/> Not as hot as Edward Cullen, but just as talented at reading minds. The Telepath <i>can view the aura of one player each night</i> (ie <b style={{color: GOOD_TEXT_COLOR}}>Village</b>, <b style={{color: EVIL_TEXT_COLOR}}>Evil</b>, <b style={{color: SOLO_TEXT_COLOR}}>Solo</b>). Watch out for the Enchanter, as this may obscure their ability. </li>
        <li><RoleDisplay role={Role.VILLAGER}/> A good member of the <b style={{color: GOOD_TEXT_COLOR}}>Village</b>. <i>No special abilities.</i> </li>
        <li><RoleDisplay role={Role.ZEALOT}/> It's nice to be a bigshot in a small town. The Zealot is more influential than their fellow villagers. When voting, <i>their vote carries twice the weight.</i> </li>
      </ul>
    </div>
  )
}