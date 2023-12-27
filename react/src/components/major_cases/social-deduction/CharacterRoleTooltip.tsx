import { Character, Role } from "./SocialDeductionEnums";

import pfpDaisycula from "../../../assets/major_cases/social-deduction/pfp-daisycula.png";
import pfpGorgon from "../../../assets/major_cases/social-deduction/pfp-gorgon.png";
import pfpGreenribbon from "../../../assets/major_cases/social-deduction/pfp-greenribbon.png";
import pfpInvisiguy from "../../../assets/major_cases/social-deduction/pfp-invisiguy.png";
import pfpWolfguy from "../../../assets/major_cases/social-deduction/pfp-wolfguy.png";

// map  all the enum values of Character or Role to their respective asset strings
const CharacterRoleAssetMap = {
  [Character.NONE]: "",
  [Character.INVISIGUY]: pfpInvisiguy,
  [Character.DAISYCULA]: pfpDaisycula,
  [Character.GORGON]: pfpGorgon,
  [Character.GREEN_RIBBON]: pfpGreenribbon,
  [Character.WOLF_GUY]: pfpWolfguy,
  [Character.ANXIOUS_GHOST]: "",
  [Character.HAPPY_GHOST]: "",
  [Character.HEART_GHOST]: "",
  [Character.NORMAL_GHOST]: "",
  [Character.SLEEPY_GHOST]: "",
  [Role.TANNER]: "",
}

const CharacterRoleColorMap = {
  [Character.NONE]: "",
  [Character.INVISIGUY]: "#947fc14f",
  [Character.DAISYCULA]: "#79493d6e",
  [Character.GORGON]: "#97d0ae36",
  [Character.GREEN_RIBBON]: "#c4c05645",
  [Character.WOLF_GUY]: "#a5592a61",
  [Character.ANXIOUS_GHOST]: "#2c282887",
  [Character.HAPPY_GHOST]: "#2c282887",
  [Character.HEART_GHOST]: "#2c282887",
  [Character.NORMAL_GHOST]: "#2c282887",
  [Character.SLEEPY_GHOST]: "#2c282887",
  [Role.TANNER]: "",
}

export default function CharacterRoleTooltip({char_role, scale}: {char_role: Character | Role, scale: number})  {
  const tooltipColor = CharacterRoleColorMap[char_role];
  const tooltipAsset = CharacterRoleAssetMap[char_role];

  return (
    <div
      className={`flex items-center px-2 py-1 bg-${tooltipColor} rounded-xl`}
      style={{
        backgroundColor: tooltipColor,
        fontSize: `${1.5*scale}vw`,
      }}
    >
      <b className="block">{char_role}</b>
      {tooltipAsset && (
        <img
          src={tooltipAsset}
          alt={`${char_role} profile`}
          className="rounded-full top-0 left-0 br-1 ml-2"
          style={{
            width: `${2*scale}vw`,
            height: `${2*scale}vw`,
          }}
        />
      )}
    </div>
  )
}