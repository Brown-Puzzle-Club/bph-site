

import { context } from "../../../context";

function titleCase(s: string): string{
  const words = s.split(" ");
  return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

// TODO: update with actual puzzle slugs
// puzzle slugs are techincally safe for anyone to see, but we should still keep them secret
const NUM_TO_SLUG: { [key: number]: string } = {
  0: "slug1",
  1: "slug2",
  2: "slug3",
  3: "slug4",
  4: "slug5"
}

export function fetchMinorCaseCharacterName(n: number): string {
  return titleCase(context?.team?.solves?.["social-deduction"]?.[NUM_TO_SLUG[n]]?.["answer"] ?? "?????");
}

export function isMinorCaseCharacterSolved(n: number): boolean {
  const solves = context?.team?.solves;
  return solves !== undefined && "social-deduction" in solves && NUM_TO_SLUG[n] in solves["social-deduction"]
}

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