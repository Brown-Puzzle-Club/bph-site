import angry from "../assets/bluenoir/angry.png";
import curious from "../assets/bluenoir/curious.png";
import neutral from "../assets/bluenoir/neutral.png";
import phone from "../assets/bluenoir/phone.png";
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
  PHONE = "phone",
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
  [BluenoirReaction.PHONE]: phone,
};

export interface Dialogue {
  text: string;
  reaction: BluenoirReaction;
}

export interface Story {
  slug: string;
  dialogues: Dialogue[];
}

export const BluenoirStories: Record<string, Story> = {
  "main-page-intro": {
    slug: "main-page-intro",
    dialogues: [
      {
        text: "Tch ... Just my luck, I get the rookies shoved off on me.",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "What's happening, kid? The name's Bluenoir. I'm in charge of the BIB's intern program this year. Though, I suppose you probably knew that already ...",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "Unfortunately, we can't exactly offer you a pretty first impression. BIB's been swamped up to our ears ever since Carberry bit the linoleum.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "Seems like every bit of scum in the city decided to take the chief's 'leave of absence' as an invitation to dustup all the attractive scenery.",
        reaction: BluenoirReaction.ANGRY,
      },
      {
        text: "Yep, you heard it here first. Prison break. Not even Providence's finest hoosegows could contain the excitement of Carberry's untimely demise. Three of our most notorious serial killers are now out roaming the streets.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "On top of it, there's all the 'Detective of the Month' malarkey going on. Everybody's doubly desperate to prove their salt now that Carberry's gone. Backstabbers and mooks everywhere you turn.",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Overall, not a friendly environment for a rookie as green as yourself. Sorry, kiddo. Seems like your grizzled noir detective fantasies might just have to stay in the novel drafts for now.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "But, fear not! The BIB has another special position, filled with just as many tangles, seductions, and heart-stopping thrills as being a hardboiled cop on the street ...",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "Desk work!",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "This is where you'll handle the paperwork for most of our cases. We got robberies, disappearances, murder in all degrees - pick your poison.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "Preferably not arsenic..Though, we do have a department for that, too.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "There's the phone, where you might receive messages from the higher-ups on the Board of Directors.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "And over HERE is where -",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "*RING RING*",
        reaction: BluenoirReaction.PHONE,
      },
      {
        text: "Oh, hold on, kid. I gotta take this.",
        reaction: BluenoirReaction.ANGRY,
      },
      {
        text: "*Click*",
        reaction: BluenoirReaction.PHONE,
      },
      {
        text: "Hello? Yeah, I'm with the kid now. What's going on?",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "... They did WHAT? With WHOM? In his WHERE? With your mother's HUH???",
        reaction: BluenoirReaction.SURPRISED,
      },
      {
        text: "... *Sigh*",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Well, kid, take everything I just said and throw it out the window. Looks like we'll be seeing some action together after all.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "Some nancy's gone haywire and committed a string of murders across town, and all these other mooks are too preoccupied dipping the bills to deal with it.",
        reaction: BluenoirReaction.ANGRY,
      },
      {
        text: "... And, as it turns out, all interns are entitled to at least one macho hardboiled spyguy moment, or else the union is gonna be all up our asses.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "You can enter the case by clicking the folder down below. Just stick close to me, and you should be fine. And try not to mess anything up.",
        reaction: BluenoirReaction.NEUTRAL,
      },
    ],
  },
};
