

import { context } from "../../../context";
// console.log(context)
import pfpDaisycula from "../../../assets/major_cases/social-deduction/pfp-daisycula.png";
import pfpGorgon from "../../../assets/major_cases/social-deduction/pfp-gorgon.png";
import pfpGreenribbon from "../../../assets/major_cases/social-deduction/pfp-greenribbon.png";
import pfpInvisiguy from "../../../assets/major_cases/social-deduction/pfp-invisiguy.png";
import pfpWolfguy from "../../../assets/major_cases/social-deduction/pfp-wolfguy.png";

export const MISS_TEXT = "?????"

function titleCase(s: string): string{
  const words = s.split(" ");
  return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

// TODO: update with actual puzzle slugs
// puzzle slugs are techincally safe for anyone to see, but we should still keep them secret
const NUM_TO_SLUG: { [key: number]: string } = {
  0: "sd-mc-1",
  1: "sd-mc-2",
  2: "sd-mc-3",
  3: "sd-mc-4",
  4: "sd-mc-5"
}

export function fetchMinorCaseCharacterName(n: number): string {
  return titleCase(context?.team?.minor_case_solves?.["social-deduction"]?.[NUM_TO_SLUG[n]]?.["answer"] ?? MISS_TEXT)
}

export function isMinorCaseCharacterSolved(n: number): boolean {
  const solves = context?.team?.minor_case_solves;
  return solves !== undefined && "social-deduction" in solves && NUM_TO_SLUG[n] in solves["social-deduction"]
}

function numberOfCasesSolves(): number {
  const solves = context?.team?.minor_case_solves;
  if (solves === undefined || !("social-deduction" in solves)) {
    return 0;
  }
  return Object.keys(solves["social-deduction"]).length;
}
export const NUM_CASES_SOLVED: number = numberOfCasesSolves();

export enum InternalCharacter {
  NONE = "NONE",
  INVISIGUY = "INVISIGUY",
  DAISYCULA = "DAISYCULA",
  GORGON = "GORGON",
  GREEN_RIBBON = "GREEN_RIBBON",
  WOLF_GUY = "WOLF_GUY",
  ANXIOUS_GHOST = "ANXIOUS_GHOST",
  HAPPY_GHOST = "HAPPY_GHOST",
  HEART_GHOST = "HEART_GHOST",
  NORMAL_GHOST = "NORMAL_GHOST",
  SLEEPY_GHOST = "SLEEPY_GHOST",
}

export const CHAR_NAME : { [key in InternalCharacter]: string } = {
  NONE: "",
  INVISIGUY: "Ghoulsby",
  DAISYCULA: "Miss Daisycula",
  GORGON: "Lady Gorgon Baker",
  GREEN_RIBBON: "Mournful Wilson",
  WOLF_GUY: "Werewolfsheim",
  // THIS IS TO MAKE SURE THAT NOBODY CAN READ THE ANSWERS FROM THE SOURCE CODE
  HEART_GHOST: fetchMinorCaseCharacterName(0),
  NORMAL_GHOST: fetchMinorCaseCharacterName(1),
  HAPPY_GHOST: fetchMinorCaseCharacterName(2),
  ANXIOUS_GHOST: fetchMinorCaseCharacterName(3),
  SLEEPY_GHOST: fetchMinorCaseCharacterName(4),
}

export enum Role {
  ASSASSIN = "Assassin",
  BODYGUARD = "Bodyguard",
  DOCTOR = "Doctor",
  ENCHANTER = "Enchanter",
  FOOL = "Fool",
  GOSSIP = "Gossip",
  HEADHUNTER = "Headhunter",
  INVESTIGATOR = "Investigator",
  LOVER = "Lover",
  RESURRECTED = "Resurrected",
  SILENCER = "Silencer",
  TELEPATH = "Telepath",
  VILLAGER = "Villager",
  ZEALOT = "Zealot",
}


export const GOOD_ROLE_COLOR = "#218c3a59";
export const EVIL_ROLE_COLOR = "#c4565645";
export const NEUTRAL_ROLE_COLOR = "#e8d25a61";
export const SOLO_ROLE_COLOR = "#7748986e";

export const GOOD_TEXT_COLOR = "#aae17c";
export const EVIL_TEXT_COLOR = "#ff8585";
export const SOLO_TEXT_COLOR = "#caaff4";

// map  all the enum values of Character or Role to their respective asset strings
export const  CharacterRoleAssetMap = {
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

export const CharacterRoleColorMap = {
  [InternalCharacter.NONE]: "",
  [InternalCharacter.INVISIGUY]: "#73687a78", // alt #947fc14f
  [InternalCharacter.DAISYCULA]: "#79493d6e",
  [InternalCharacter.GORGON]: "#97d0ae36",
  [InternalCharacter.GREEN_RIBBON]: "#c4c05645",
  [InternalCharacter.WOLF_GUY]: "#d79e7b3d", // alt #a5592a61
  [InternalCharacter.ANXIOUS_GHOST]: "#1e1b1b5e",
  [InternalCharacter.HAPPY_GHOST]: "#1e1b1b5e",
  [InternalCharacter.HEART_GHOST]: "#1e1b1b5e",
  [InternalCharacter.NORMAL_GHOST]: "#1e1b1b5e",
  [InternalCharacter.SLEEPY_GHOST]: "#1e1b1b5e",
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
  [Role.ZEALOT]: GOOD_ROLE_COLOR,
}