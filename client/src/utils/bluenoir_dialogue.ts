import angry from "../assets/bluenoir/angry.png";
import curious from "../assets/bluenoir/curious.png";
import neutral from "../assets/bluenoir/neutral.png";
import proud from "../assets/bluenoir/proud.png";
import surprised from "../assets/bluenoir/surprised.png";
import thinking from "../assets/bluenoir/thinking.png";

export enum BluenoirReaction {
  NEUTRAL = "neutral",
  HAPPY = "happy",
  SAD = "sad",
  ANGRY = "angry",
  SURPRISED = "surprised",
  EMBARRASSED = "embarrassed",
  SENSITIVE = "sensitive",
  PROUD = "proud",
  NERVOUS = "nervous",
  THINKING = "thinking",
  TIRED = "tired",
  SMUG = "smug",
  CURIOUS = "curious",
}

export const BluenoirReactionImage: Record<BluenoirReaction, string> = {
  [BluenoirReaction.NEUTRAL]: neutral,
  [BluenoirReaction.HAPPY]: neutral,
  [BluenoirReaction.SAD]: neutral,
  [BluenoirReaction.ANGRY]: angry,
  [BluenoirReaction.SURPRISED]: surprised,
  [BluenoirReaction.EMBARRASSED]: neutral,
  [BluenoirReaction.SENSITIVE]: neutral,
  [BluenoirReaction.PROUD]: proud,
  [BluenoirReaction.NERVOUS]: neutral,
  [BluenoirReaction.THINKING]: thinking,
  [BluenoirReaction.TIRED]: neutral,
  [BluenoirReaction.SMUG]: neutral,
  [BluenoirReaction.CURIOUS]: curious,
};

export interface Dialogue {
  text: string;
  reaction: BluenoirReaction;
}

export interface Story {
  slug: string;
  dialogues: Dialogue[];
}
