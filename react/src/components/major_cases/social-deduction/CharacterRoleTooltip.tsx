import { CHAR_NAME, InternalCharacter, Role } from "./SocialDeductionEnums";

import pfpDaisycula from "../../../assets/major_cases/social-deduction/pfp-daisycula.png";
import pfpGorgon from "../../../assets/major_cases/social-deduction/pfp-gorgon.png";
import pfpGreenribbon from "../../../assets/major_cases/social-deduction/pfp-greenribbon.png";
import pfpInvisiguy from "../../../assets/major_cases/social-deduction/pfp-invisiguy.png";
import pfpWolfguy from "../../../assets/major_cases/social-deduction/pfp-wolfguy.png";

// map  all the enum values of Character or Role to their respective asset strings
const  CharacterRoleAssetMap = {
  [InternalCharacter.NONE]: "",
  [InternalCharacter.INVISIGUY]: pfpInvisiguy,
  [InternalCharacter.DAISYCULA]: pfpDaisycula,
  [InternalCharacter.GORGON]: pfpGorgon,
  [InternalCharacter.GREEN_RIBBON]: pfpGreenribbon,
  [InternalCharacter.WOLF_GUY]: pfpWolfguy,
  [InternalCharacter.ANXIOUS_GHOST]: "",
  [InternalCharacter.HAPPY_GHOST]: "",
  [InternalCharacter.HEART_GHOST]: "",
  [InternalCharacter.NORMAL_GHOST]: "",
  [InternalCharacter.SLEEPY_GHOST]: "",
  [Role.ASSASSIN]: "",
  [Role.BODYGUARD]: "",
  [Role.DOCTOR]: "",
  [Role.ENCHANTER]: "",
  [Role.FOOL]: "",
  [Role.GOSSIP]: "",
  [Role.HEADHUNTER]: "",
  [Role.INVESTIGATOR]: "",
  [Role.LOVER]: "",
  [Role.RESURRECTED]: "",
  [Role.SILENCER]: "",
  [Role.TELEPATH]: "",
  [Role.VILLAGER]: "",
  [Role.ZEALOT]: "",
}

const GOOD_ROLE_COLOR = "#97d0ae36";
const EVIL_ROLE_COLOR = "#c4c05645";
const NEUTRAL_ROLE_COLOR = "#a5592a61";
const SOLO_ROLE_COLOR = "#79493d6e";


const CharacterRoleColorMap = {
  [InternalCharacter.NONE]: "",
  [InternalCharacter.INVISIGUY]: "#947fc14f",
  [InternalCharacter.DAISYCULA]: "#79493d6e",
  [InternalCharacter.GORGON]: "#97d0ae36",
  [InternalCharacter.GREEN_RIBBON]: "#c4c05645",
  [InternalCharacter.WOLF_GUY]: "#a5592a61",
  [InternalCharacter.ANXIOUS_GHOST]: "#2c282887",
  [InternalCharacter.HAPPY_GHOST]: "#2c282887",
  [InternalCharacter.HEART_GHOST]: "#2c282887",
  [InternalCharacter.NORMAL_GHOST]: "#2c282887",
  [InternalCharacter.SLEEPY_GHOST]: "#2c282887",
  [Role.ASSASSIN]: EVIL_ROLE_COLOR,
  [Role.BODYGUARD]: GOOD_ROLE_COLOR,
  [Role.DOCTOR]: GOOD_ROLE_COLOR,
  [Role.ENCHANTER]: EVIL_ROLE_COLOR,
  [Role.FOOL]: SOLO_ROLE_COLOR,
  [Role.GOSSIP]: GOOD_ROLE_COLOR,
  [Role.HEADHUNTER]: SOLO_ROLE_COLOR,
  [Role.INVESTIGATOR]: GOOD_ROLE_COLOR,
  [Role.LOVER]: GOOD_ROLE_COLOR,
  [Role.RESURRECTED]: NEUTRAL_ROLE_COLOR,
  [Role.SILENCER]: EVIL_ROLE_COLOR,
  [Role.TELEPATH]: GOOD_ROLE_COLOR,
  [Role.VILLAGER]: GOOD_ROLE_COLOR,
  [Role.ZEALOT]: EVIL_ROLE_COLOR,
}

export default function CharacterRoleTooltip({char_role, scale}: {char_role: InternalCharacter | Role, scale: boolean})  {
  const tooltipColor = CharacterRoleColorMap[char_role];
  const tooltipAsset = CharacterRoleAssetMap[char_role];
  const name = (char_role in InternalCharacter) ? CHAR_NAME[char_role as InternalCharacter] : char_role;

  return (
    <div
      className={`flex items-center px-2 py-1 rounded-xl`}
      style={{
        backgroundColor: tooltipColor,
        fontSize: scale ? `2.25vw` : undefined,
        width: 'fit-content',
      }}
    >
      <b className="block">{name}</b>
      {tooltipAsset && (
        <img
          src={tooltipAsset}
          alt={`${char_role} profile`}
          className="rounded-full top-0 left-0 br-1 ml-2"
          style={{
            width: scale ? `3vw` : undefined,
            height: scale ? `3vw` : undefined,
          }}
        />
      )}
    </div>
  )
}