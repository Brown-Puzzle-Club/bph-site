import angry from "@/assets/bluenoir/angry.png";
import curious from "@/assets/bluenoir/curious.png";
import embarassed from "@/assets/bluenoir/embarassed.png";
import evil from "@/assets/bluenoir/evil.png";
import excited from "@/assets/bluenoir/excited.png";
import happy from "@/assets/bluenoir/happy.png";
import nervous from "@/assets/bluenoir/nervous.png";
import neutral from "@/assets/bluenoir/neutral.png";
import phone from "@/assets/bluenoir/phone.png";
import proud from "@/assets/bluenoir/proud.png";
import sad from "@/assets/bluenoir/sad.png";
import sensitive from "@/assets/bluenoir/sensitive.png";
import smug from "@/assets/bluenoir/smug.png";
import surprised from "@/assets/bluenoir/surprised.png";
import thinking from "@/assets/bluenoir/thinking.png";
import tired from "@/assets/bluenoir/tired.png";

import { MajorCaseEnum } from "./constants";
import type { DjangoContext } from "./django_types";
import { numberOfMajorCaseSolves } from "./utils";

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
  EVIL = "evil",
  EXCITED = "excited",
  PHONE = "phone",
}

export const BluenoirReactionImage: Record<BluenoirReaction, string> = {
  [BluenoirReaction.NEUTRAL]: neutral,
  [BluenoirReaction.HAPPY]: happy,
  [BluenoirReaction.SAD]: sad,
  [BluenoirReaction.ANGRY]: angry,
  [BluenoirReaction.SURPRISED]: surprised,
  [BluenoirReaction.EMBARRASSED]: embarassed,
  [BluenoirReaction.SENSITIVE]: sensitive,
  [BluenoirReaction.PROUD]: proud,
  [BluenoirReaction.NERVOUS]: nervous,
  [BluenoirReaction.THINKING]: thinking,
  [BluenoirReaction.TIRED]: tired,
  [BluenoirReaction.SMUG]: smug,
  [BluenoirReaction.CURIOUS]: curious,
  [BluenoirReaction.EVIL]: evil,
  [BluenoirReaction.EXCITED]: excited,
  [BluenoirReaction.PHONE]: phone,
};

export interface Dialogue {
  text: string;
  reaction: BluenoirReaction;
}

export interface Story {
  slug: string;
  dialogues: Dialogue[];
  title?: string;
  description?: string;
}

export const BluenoirStories: Record<string, Story> = {
  "main-page-intro": {
    slug: "main-page-intro",
    title: "Introduction",
    description: "Welcome to the Brown Investigative Bureau",
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
        text: "Desk work!!",
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
  "major-case-complete-1": {
    slug: "first-major-case-complete",
    title: "First Discovery",
    description: "You've solved your first major case!",
    dialogues: [
      {
        text: "Heh ... Not bad work back there, kid.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "We just might make a great detective out of you, yet.",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "Eh, speaking of ... Sorry if my welcome wasn't exactly the 'warmest' back at new employee orientation.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "I've been a bit of a solo act for a long time. Last time I worked with a partner ... ah ...",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "Well, let's just say, in a great big detective agency like this one, it's easy to lose your way.",
        reaction: BluenoirReaction.NERVOUS,
      },
      {
        text: "I doubt that'll happen to you, though.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "'Specially since you seem so tied to this desk, for whatever reason.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "After seeing your performance with the Cult of Lucifer, I think you're ready to handle some more serious work now.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "The final pin seems to lead to a location on Brown University campus ...",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "Think you're ready to save a life? I'll call to let you know when to be there.",
        reaction: BluenoirReaction.HAPPY,
      },
    ],
  },
  "major-case-complete-2": {
    slug: "second-major-case-complete",
    title: "Second Discovery",
    description: "You've solved your second major case!",
    dialogues: [
      {
        text: "Look who's done it again!",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "Nice work, kiddo. At this rate, you'll have the entire agency eating out of the palm of your hand.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "If I could put money on race for Detective of the Month, you'd be my top pony. The agency's already buzzing about us.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Hell, with Carberry gone, you could even have a shot at Deputy Detective.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "But, ah, I really hate to say this, kid, but ... maybe it'd be good to take a break from all the gloom and doom for a little while?",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "Catch a flicker. Kiss a dame. Do anything, just live a little. It doesn't have to be all work, work, work all the time.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "I just don't wanna see you end up like me. Grizzled and grim with a vaguely tragic backstory and a crippling nicotine addiction.",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Take it from me, this industry's got more seedy underbellies than my Aunt Winnie after she got that IBS diagnosis.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "Hell, even Carberry himself knew it better than anybody.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "When the two of us founded the BIB together, he was barely older than you. Fresh off the corkboard, so to speak.",
        reaction: BluenoirReaction.SAD,
      },
      {
        text: "But then, as the years wore on, the screws up in that great, terrifying enigma that was his grotesquely oversized dome wiggled looser and looser.",
        reaction: BluenoirReaction.SAD,
      },
      {
        text: "The bastard stewed his hat more than a Michelin star chef at the trilby factory. He was a drunk, I mean. And a vain one, at that.",
        reaction: BluenoirReaction.ANGRY,
      },
      {
        text: "Always would go on these rambling lectures about 'Archaic Greek Architectural Revetments in Connection with Ionian Phonology', whatever the hell that means.",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Anyways, point being: if that's what this industry does to a successful detective, imagine what it'll do to a mediocre one.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "This place will chew you up and spit you out in a heartbeat, and I don't wanna see .. Er, I don't wanna lose another ... ah ...",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "Well ... I'll quit going soft on you now. You know what I mean.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
    ],
  },
  "major-case-complete-3": {
    slug: "third-major-case-complete",
    title: "Final Discovery",
    description: "You've solved your second major case!",
    dialogues: [
      {
        text: "... Wow, kid.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "You've really done it. Three biggest killers in Providence, in the lockup, all thanks to the BIB's newest rookie.",
        reaction: BluenoirReaction.EXCITED,
      },
      {
        text: "I guess I don't really have anything to say, except ...",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "I'm proud of you.",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "After what happened with Carberry, my old partner, I never thought I'd ever do the whole 'teamwork' thing again.",
        reaction: BluenoirReaction.SAD,
      },
      {
        text: "I dunno. I guess maybe this hard boiled detective's got a gooey yellow center.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "Heh. Ain't that a wag. I've gone up against the crooks and killers, the dredges of society, without breaking a sweat, but the only thing to make me flinch is ... Is, um ...",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "*RING RING*",
        reaction: BluenoirReaction.PHONE,
      },
      {
        text: "*RING RING*",
        reaction: BluenoirReaction.PHONE,
      },
      {
        text: "Uh ... One sec, kid. Sorry.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "*click*",
        reaction: BluenoirReaction.PHONE,
      },
      {
        text: "Hello?",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "He said WHAT? On his WHO? Over his sister's WHERE?",
        reaction: BluenoirReaction.SURPRISED,
      },
      {
        text: "O-Okay. Thank you. Yes, I understand.",
        reaction: BluenoirReaction.NERVOUS,
      },
      {
        text: "...",
        reaction: BluenoirReaction.EVIL,
      },
      {
        text: "That was the bureau's board of directors.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "I've just been promoted to Head Detective.",
        reaction: BluenoirReaction.SURPRISED,
      },
      {
        text: "I ... uhm ... I don't know what to say.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "... I'm gonna be Head Detective! Me, Bluenoir, Head Detective of the Brown Investigative Bureau! If I didn't have such balanced iron levels, I could just about keel over in joy.",
        reaction: BluenoirReaction.EXCITED,
      },
      {
        text: "They're swearing me in later today.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "I know you're busy gumshoeing and whatnot, but ... it'd make me just about as happy as a hophead in a dope shop if you could be there for the ceremony.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "Just you wait, kiddo. This is the beginning of a new era of hawkshaw. It's gonna be bigger, better, and even more 'Noir'.",
        reaction: BluenoirReaction.EXCITED,
      },
      {
        text: "Smoke-free areas will become a thing of the past, alongside any color with a non-alliterative hex code.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "As for you, well ... You've shown just about as much promise as any rookie in the BIB's history.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "How does 'Deputy Detective' sound?",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "And, yes, I mean it. The world is our oyster, pally. All that's left is to grotesquely crack it open and suck out the sweet, delectable delights from its gnarled center.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "But, first, let's tie a ribbon on all the 'Murder Mystery' shenanigans so we can go and celebrate!",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "You're the one who's gathered the evidence, made the suspects, connected the dots ... I have my own theories, and I'm sure that you do, too.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "So, the time has come to figure out the big question that I'm sure's been tickling your brain: which of these knuckleheaded goons killed Josiah Carberry?",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  // these downwards are NON NOTIFICATION, NON CENTER
  "colored-thread-verdict": {
    slug: "colored-thread-verdict",
    dialogues: [
      {
        text: "Hmm ... A religious zealot goes rogue and dispatches the head of the city's top detective agency in hopes of buying time to perform the ritual for their twisted little cult.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "It's a crazy story. Just crazy enough to be true!",
        reaction: BluenoirReaction.EXCITED,
      },
      {
        text: "Nice work, kid. I think we can go ahead and declare this case closed. After all, I am Head Detective. Hehehe.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Hey, whaddaya say we ditch the desk, head out to a gin mill, and get so blotto we can't tell up from down? My treat. It's the least I can do, after what a help you've been.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "Just let me grab my coat. I should be ready in two flits of a floozy's skirt.",
        reaction: BluenoirReaction.EXCITED,
      },
    ],
  },
  "social-deduction-verdict": {
    slug: "social-deduction-verdict",
    dialogues: [
      {
        text: "Hmm ... A rich aristocrat gets brainwashed by a vengeful spirit and dispatches the head of the city's top detective agency in hopes of buying time to perform their twisted little rituals.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "It's a crazy story. Just crazy enough to be true!",
        reaction: BluenoirReaction.EXCITED,
      },
      {
        text: "Nice work, kid. I think we can go ahead and declare this case closed. After all, I am Head Detective. Hehehe.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Hey, whaddaya say we ditch the desk, head out to a gin mill, and get so blotto we can't tell up from down? My treat. It's the least I can do, after what a help you've been.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "Just let me grab my coat. I'll be ready in two flits of a floozy's skirt.",
        reaction: BluenoirReaction.EXCITED,
      },
    ],
  },
  "data-verdict": {
    slug: "data-verdict",
    dialogues: [
      {
        text: "Hmm ... The head of the city's top detective agency gets infected by a rogue AI and goes postal, pulling the Dutch Act.",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "It's a crazy story. Just crazy enough to be true!",
        reaction: BluenoirReaction.EXCITED,
      },
      {
        text: "Nice work, kid. I think we can go ahead and declare this case closed. After all, I am Head Detective. Hehehe.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Hey, whaddaya say we ditch the desk, head out to a gin mill, and get so blotto we can't tell up from down? My treat. It's the least I can do, after what a help you've been.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "Just let me grab my coat. I'll be ready in two flits of a floozy's skirt.",
        reaction: BluenoirReaction.EXCITED,
      },
    ],
  },
  "bluenoir-verdict-1": {
    slug: "bluenoir-verdict-1",
    dialogues: [
      {
        text: "...",
        reaction: BluenoirReaction.EVIL,
      },
      {
        text: "... Hehe. Good one, kid.",
        reaction: BluenoirReaction.NERVOUS,
      },
      {
        text: "W-Why don't you try that one again?",
        reaction: BluenoirReaction.EMBARRASSED,
      },
    ],
  },
  "bluenoir-verdict-2": {
    slug: "bluenoir-verdict-2",
    dialogues: [
      {
        text: "Are you stewed to the hat, or something, kid? Seriously. Make an actual guess. The smartassery is beginning to piss me off.",
        reaction: BluenoirReaction.ANGRY,
      },
    ],
  },
  "bluenoir-verdict-3": {
    slug: "bluenoir-verdict-3",
    dialogues: [
      {
        text: "...",
        reaction: BluenoirReaction.EVIL,
      },
      {
        text: "........",
        reaction: BluenoirReaction.EVIL,
      },
      {
        text: "...................",
        reaction: BluenoirReaction.EVIL,
      },
      {
        text: "Say, i-is it getting hot in here, or ... ?",
        reaction: BluenoirReaction.NERVOUS,
      },
      {
        text: "Jesus Christ, my gut is killing me ...",
        reaction: BluenoirReaction.NERVOUS,
      },
      {
        text: "Kid, any chance you gotta cigarette on you? No?",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "Ah ... screw it. I gotta run!",
        reaction: BluenoirReaction.NERVOUS,
      },
      {
        text: "*Bluenoir grabs a pile of documents off his desk and scurries away.*",
        reaction: BluenoirReaction.NEUTRAL,
      },
    ],
  },
  "whales-case-solve": {
    slug: "whales-case-solve",
    dialogues: [
      {
        text: "You did… whale on this one.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Better get the coast guard! Oh, wait, they're already dead. RIP.",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "birbs-at-brown-case-solve": {
    slug: "birbs-at-brown-case-solve",
    dialogues: [
      {
        text: "Great work detectives, you've busted the birbs!",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Hope you enjoyed your walk around Brown's campus!",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "mr-cat-case-solve": {
    slug: "mr-cat-case-solve",
    dialogues: [
      {
        text: "Purrfect job! I bet you're feline good",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "You'll go down in hiss-tory",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "penny-puzz-case-solve": {
    slug: "penny-puzz-case-solve",
    dialogues: [
      {
        text: "You sleighed",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "Best in snow!",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "He should've laid off the te-kill-ya",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "exile-case-solve": {
    slug: "exile-case-solve",
    dialogues: [
      {
        text: "Way to go! His “High Infidelity” led to some serious “Bad Blood”.",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "At least this “Vigilante Shit” gave her some “closure”",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "“Is it over now?”",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "nyt-case-solve": {
    slug: "nyt-case-solve",
    dialogues: [
      {
        text: "Let's all raise a glass to the greatest games writer of our generation.",
        reaction: BluenoirReaction.HAPPY,
      },
    ],
  },
  "god-of-the-labyrinth-case-solve": {
    slug: "god-of-the-labyrinth-case-solve",
    dialogues: [
      {
        text: "So it WAS the robot after all!",
        reaction: BluenoirReaction.SMUG,
      },
      {
        text: "I wonder why R lied to the author…",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "I'll add this to the Incomplete History of Secret Organizations.",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "nomenclept-case-solve": {
    slug: "nomenclept-case-solve",
    dialogues: [
      {
        text: "Ah, I remember now! Gourd Wilson used to be a good friend of mine.",
        reaction: BluenoirReaction.HAPPY,
      },
    ],
  },
  "twiqh-case-solve": {
    slug: "twiqh-case-solve",
    dialogues: [
      {
        text: "Sebald? I feel like I know that guy from somewhere…",
        reaction: BluenoirReaction.THINKING,
      },
      {
        text: "I'll add this to the Incomplete History of Secret Organizations.",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "microinfluencer-case-solve": {
    slug: "microinfluencer-case-solve",
    dialogues: [
      {
        text: "Nice work! I doubt even Carberry himself could've figured that one out like you did.",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "... Seriously. I'm dropping the veil, here.",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Everybody likes to talk about him like he was the most brilliant detective to ever live, or something, but really he was just a serial yapper. I was the one who did most of the actual rough-and-tumble work.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "Sometimes, I wondered if he used to give me the worst assignments on purpose, because he knew he didn't deserve to be Head Detective ...",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Bluenoir, the workhorse; Josiah, the show pony. Yadda, yadda, yadda. I'll spare you the gory details.",
        reaction: BluenoirReaction.NEUTRAL,
      },
      {
        text: "Moral of the story, kid: don't ever let anybody treat you like you're lesser. Even if it's somebody you care about.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "If I ever make you feel like an asshole, I give you permission to sock me a good one, then and there. In fact, it's an order.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "Nothing keeps a bear humble like a smartass rookie by his side.",
        reaction: BluenoirReaction.SMUG,
      },
    ],
  },
  "blues-clues-case-solve": {
    slug: "blues-clues-case-solve",
    dialogues: [
      {
        text: "So it's a blue, anthropomorphic animal solving clues with their human companion? Sheesh ... these guys need to get their own rub.",
        reaction: BluenoirReaction.NEUTRAL,
      },
    ],
  },
  "maze-case-solve": {
    slug: "maze-case-solve",
    dialogues: [
      {
        text: "Great work, kiddo.",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "For a second, there, you almost reminded me of ...",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "... Ah. Let's just move on, shall we?",
        reaction: BluenoirReaction.EMBARRASSED,
      },
    ],
  },
  "showdown-case-solve": {
    slug: "showdown-case-solve",
    dialogues: [
      {
        text: "Oh ... Would you look at that. You solved it.",
        reaction: BluenoirReaction.TIRED,
      },
      {
        text: "Sorry I've been quiet this round, kid. I swear to you, I'm not going postal.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "I've just been ... thinking, I guess. About Carberry.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "...",
        reaction: BluenoirReaction.SAD,
      },
      {
        text: "... I don't talk about it often, but we used to be partners. Him and I.",
        reaction: BluenoirReaction.SAD,
      },
      {
        text: "We founded the Brown Investigative Bureau together. He was always the more enterprising of us two, so he got all the credit.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "But, make no mistake, through the feuding and neuroticism, we were about as close to family as an anthropomorphic blue bear and a psychoceramics expert can get.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "Or, at least, we used to be.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "After founding the agency, things took a turn for the worse. All the competition and favoritism certainly succeeded in driving a wedge between us ...",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "But, for a while, there, our life was pretty sweet.",
        reaction: BluenoirReaction.HAPPY,
      },
      {
        text: "You remind me a lot of him, y'know. The best parts of him, anyways.",
        reaction: BluenoirReaction.SENSITIVE,
      },
      {
        text: "... Whoa! For a second there, I almost just felt ... an emotion?",
        reaction: BluenoirReaction.SURPRISED,
      },
      {
        text: "Uff. Maybe it's best for me to just quit this little sob fest while I'm ahead.",
        reaction: BluenoirReaction.EMBARRASSED,
      },
      {
        text: "Keep your chin up, kid. You're doing great work. I'm proud of you.",
        reaction: BluenoirReaction.PROUD,
      },
      {
        text: "... Josiah would be, too.",
        reaction: BluenoirReaction.SENSITIVE,
      },
    ],
  },
};

const MAIN_PAGE_IDLE: Dialogue[] = [
  {
    text: "Looks like they got you doing the easy work huh cupcake",
    reaction: BluenoirReaction.SMUG,
  },
  {
    text: "It's been a long day, I'm grabbing Baja's for dinner",
    reaction: BluenoirReaction.TIRED,
  },
  {
    text: "I love working at the B.I.B.",
    reaction: BluenoirReaction.HAPPY,
  },
  {
    text: "My fedora collection knows no bounds",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "I'm blue da ba dee da ba di",
    reaction: BluenoirReaction.SMUG,
  },
  {
    text: "*puffs cigar* ",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "*coughs in lung cancer*",
    reaction: BluenoirReaction.ANGRY,
  },
  {
    text: "Back in my day, we didn't have all these new-fangled computers to do our jobs for us",
    reaction: BluenoirReaction.ANGRY,
  },
  {
    text: "Kids these days have it too easy",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "Are you lost babygirl",
    reaction: BluenoirReaction.CURIOUS,
  },
  {
    text: "In case you haven't noticed, I'm weird. I'm a weirdo. I don't fit in. And I don't want to fit in. Have you ever seen me without this stupid fedora on? That's weird.",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "Pretty dark and stormy out tonight ...",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "Wonder who the next head detective's gonna be, now that Carberry's gone.",
    reaction: BluenoirReaction.THINKING,
  },
  {
    text: "Noir slang, etc.",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "BIB wants me, rookies fear me",
    reaction: BluenoirReaction.CURIOUS,
  },
];

const MAIN_PAGE_IDLE_CASE_COUNT: Record<0 | 1 | 2 | 3, Dialogue[]> = {
  0: [
    {
      text: "Tch ...",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "Hmm ...",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "What are you just standing around for? We have work to do.",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "What are you lookin' at?",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "Buzz off.",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Get a move on.",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "They don't pay me near enough to deal with rookies.",
      reaction: BluenoirReaction.TIRED,
    },
    {
      text: "Scram.",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "Don't lay an egg, kid",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Try not to mess anything up",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "Don't touch my papers!",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "Grrr ...",
      reaction: BluenoirReaction.ANGRY,
    },
  ],
  1: [
    {
      text: "Good work, kid, I'm proud of you",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "Not bad, rookie. Not bad",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "You're a real gee, kid",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "We make a pretty great team, don't we?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Say, how about this one? 'Three blondes walk into a bar ... You'd think one of them would've seen it.' Hehe.",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "What's the matter, kid? Bear got your tongue?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "At this rate, you'll be Detective of the Month in no time.",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "A bear's greatest weapon is a keen eye, and his greatest ally is the dark. Or, wait, maybe that's a cat ...",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "It takes two shots to kill a man. First, a shot of liquor to numb the pain. Then, you shoot him.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "If I had a greenback for every time someone called me nutty ... Well, I'd have a few more greenbacks than I do now, which is zero.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "One time I made the mistake of telling someone what I really thought of them. Since then, I've only made that same mistake once, maybe twice a day.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Some people think that bears have nine lives. It's not true, of course, but having a little mystery to your reputation never hurts.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "I don't drink to forget. In the circles I run in, you don't have the luxury of forgetting. But damn, do I drink.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "You learn to smile real pretty in this profession. You gotta have a smile that greets 'hello' as your trigger finger's busy waving goodbye.",
      reaction: BluenoirReaction.SMUG,
    },
  ],
  2: [
    {
      text: "You know, I never had a kid, but if I did, I hope they'd be like you.",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "You're a real gee, kid.",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "Thanks for helping on my case.",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "Whew, I did a lot of hard work on that case.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "You couldn't have done it without me!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "The board of directors will be really glad I cracked this one!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Carberry kinda lost it towards the end ... Well, maybe we shouldn't talk about it here.",
      reaction: BluenoirReaction.SAD,
    },
    {
      text: "Holmes is so overrated. ",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "What do you call an alligator detective? An investi-gator! ... Heh. My old partner loved that one.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "My old partner would've liked you. You remind me of him sometimes.",
      reaction: BluenoirReaction.SENSITIVE,
    },
    {
      text: "Damnit, Carberry drove me crazy, but the bastard always did know how to make me laugh ...",
      reaction: BluenoirReaction.SENSITIVE,
    },
    {
      text: "The third Baja's? That was Carberry's doing. He loves the place, so he ordered the city to build a new one closer to the agency.",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Carberry once flipped a table because they got his Baja's order wrong. That was towards the end ...",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "A little birdie told me that Detective of the Month is practically yours!",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "Say, do you think I would look good in silver?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "'Chief Detective Bluenoir' ... Sort of has a nice ring, doesn't it?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "If we were eggs, I'd be hardboiled, and you would be sunny side. As for Carberry ... scrambled.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "It takes two shots to kill a man. First, a shot of liquor to numb the pain. Then, you shoot him.",
      reaction: BluenoirReaction.SMUG,
    },
  ],
  3: [
    {
      text: "The future is bright, kiddo. Go take a rest. I'll handle things here.",
      reaction: BluenoirReaction.PROUD,
    },
  ],
};

const MINOR_CASE_IDLE_GENERIC: Dialogue[] = [
  {
    text: "This operation stinks like cheap bourbon. Time to put it on ice.",
    reaction: BluenoirReaction.ANGRY,
  },
  {
    text: "Watch your back, kid.",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "If anybody bothers you, send 'em my way. My heater's been itching for a taste of the action.",
    reaction: BluenoirReaction.SMUG,
  },
  {
    text: "Hmm ...",
    reaction: BluenoirReaction.THINKING,
  },
  {
    text: "Oof ... I need a drink.",
    reaction: BluenoirReaction.TIRED,
  },
  {
    text: "*puffs cigar*",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "Good detective work is like good jazz. You gotta know when to give the other guy a turn to run the show. That's why I'm letting you do all the work.",
    reaction: BluenoirReaction.SMUG,
  },
];

const MINOR_CASE_IDLE_BY_CASE: Record<string, Dialogue[]> = {
  whales: [
    {
      text: "You know, I've always liked fish. Maybe it's because I'm a bear.",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "Whaling is a real threat to the ocean ecosystem!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Time to go off into the big blue wet thing!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Yarr.",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "I never knew whales were such fascinating creatures.",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "This reminds me of this one time Carberry sent me out to sea to solve a cruise ship mystery. Had to shit in a hole to the ocean for months. Such is the life of a glamorous detective.",
      reaction: BluenoirReaction.NEUTRAL,
    },
  ],
  "birbs-at-brown": [
    {
      text: "My life goal is to find a birb.",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "Are those mischievous mallards causing trouble again?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "I may look tough, but those little crochet birds bring me so much joy",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "I have post notifications on",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "We need to put these birbs behind bars",
      reaction: BluenoirReaction.ANGRY,
    },
  ],
  "mr-cat": [
    {
      text: "You're kitten close!",
      reaction: BluenoirReaction.PROUD,
    },
    {
      text: "You look pretty purr-plexed…",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Put your thinking cat on",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Meow you're talking!",
      reaction: BluenoirReaction.EXCITED,
    },
  ],
  "penny-for-dreadful-news": [
    {
      text: "This puzzle is snow joke",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Lay off the ‘nog and use your noggin.",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "Ho-Ho-How are you so bad at this?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Never could stand Rudolph the Reindeer. Guy's got a real vanity complex.",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "Carberry and I once took a case at the North Pole. Had to burn our trilbys, just to stay alive.",
      reaction: BluenoirReaction.NEUTRAL,
    },
  ],
  exile: [
    {
      text: "Legally I didn't say this, but it looks like this guy deserved it",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "This place gives me the creeps",
      reaction: BluenoirReaction.NERVOUS,
    },
    {
      text: "I certainly wouldn't want to be out in this weather",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Sometimes crime is justified",
      reaction: BluenoirReaction.NEUTRAL,
    },
  ],
  nyt: [
    {
      text: "Remember when they made the wordle SALLY the other day? That was so lame",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "You really have to be a detective to solve the Connections nowadays",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Have you played that new Strands game? I'm really bad at it.",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Back in my day detective work was hard, and you get to sit there and play puzzle games?",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "STARE-CLOUD-PINKY never fails",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "The B.I.B. employee benefits should include a NYT games subscription",
      reaction: BluenoirReaction.SMUG,
    },
  ],
  "god-of-the-labyrinth": [
    {
      text: "Ugh, I better not have to read this whole thing.",
      reaction: BluenoirReaction.TIRED,
    },
    {
      text: "Something ain't right here…",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "This inventor guy's a weirdo.",
      reaction: BluenoirReaction.NERVOUS,
    },
    {
      text: "What's so good about this detective R, anyway?",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "Man, the narrator really is an idiot.",
      reaction: BluenoirReaction.SMUG,
    },
  ],
  nomenclept: [
    {
      text: "I sure am glad you're doing all the legwork!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "What is this, radio theater?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Nomen… clept. What does that even mean?",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "Hey, you heard what Cassette Man said!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "I used to know this guy… for some reason, I can't remember his name…",
      reaction: BluenoirReaction.THINKING,
    },
  ],
  twiqh: [
    {
      text: "What a series of unfortunate events for this Godot guy…",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "Hey, I didn't volunteer for this.",
      reaction: BluenoirReaction.ANGRY,
    },
    {
      text: "At least I don't have to read 13 books to solve this murder.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Soon you'll tell me there's a secret organization behind this whole play.",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Hey, did you catch the reenactment earlier?",
      reaction: BluenoirReaction.SMUG,
    },
  ],
  maze: [
    {
      text: "Where are you even supposed to go?",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "That's some nice procedurally-generated carpet right there.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "What a cute little sprite!",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "Josiah n' I loved games like this when we were kids.",
      reaction: BluenoirReaction.SENSITIVE,
    },
  ],
  // (Special: this ellipsis should be the only bit of idle dialogue bluenoir has access to for this one)
  //  ^- orion note: I am confused on why this is the vibe for the pokemon puzzle?
  //  ^- aren explanation: there is a lore dump once showdown is complete, he's being coy about it
  showdown: [
    {
      text: "...",
      reaction: BluenoirReaction.SMUG,
    },
  ],
  "financial-crimes": [
    {
      text: "You're a real national treasure (a Nicholas Cage level IRS evader)",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Work your asset off",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "He's kinda hot, right?",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Hey Alexa, play “Fuck Taxes” by Lil Heez",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "White collar crime. The opposite of Film Noir.",
      reaction: BluenoirReaction.NEUTRAL,
    },
  ],
};

const WORDLE_FAIL_PROMPTS = [
  {
    text: "Ah, that's alright, kid. You'll get it next time.",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "Nice try.",
    reaction: BluenoirReaction.NEUTRAL,
  },
  {
    text: "Eh ... Are you sloshed, or something?",
    reaction: BluenoirReaction.NERVOUS,
  },
  {
    text: "Who are you, and what have you done with my intern?",
    reaction: BluenoirReaction.ANGRY,
  },
  {
    text: "Maybe lay off smelling the barrel for a while, kid?",
    reaction: BluenoirReaction.EMBARRASSED,
  },
  {
    text: "Are you dense?",
    reaction: BluenoirReaction.ANGRY,
  },
  {
    text: "Maybe you're not cut out for detective life after all ...",
    reaction: BluenoirReaction.EMBARRASSED,
  },
  {
    text: "I give up. Come find me again when you've finally figured it out.",
    reaction: BluenoirReaction.ANGRY,
  },
  {
    text: "...",
    reaction: BluenoirReaction.TIRED,
  },
];

const MAJOR_CASE_DIALOGUE: Record<MajorCaseEnum, Dialogue[]> = {
  [MajorCaseEnum.COLORED_THREAD]: [
    {
      text: "Haven't gotten to do a high profile case like this in a while. Nice to be back in the swing of things.",
      reaction: BluenoirReaction.HAPPY,
    },
  ],
  [MajorCaseEnum.SOCIAL_DEDUCTION]: [
    {
      text: "Should've paid attention in high school English",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "ಠ_ಠ The eyes of TJ Eckleburg do not approve",
      reaction: BluenoirReaction.CURIOUS,
    },
    {
      text: "Good one, old sport",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "This reminds me of a game I used to play",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Well, someone must be lying",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "These monsters sure are messy",
      reaction: BluenoirReaction.THINKING,
    },
    {
      text: "Werewolfsheim and I had a fling back in '83. Swell  guy, but a bit ... ehm, hairy.",
      reaction: BluenoirReaction.EMBARRASSED,
    },
    {
      text: "Haven't gotten to do a high profile case like this in a while. Nice to be back in the swing of things.",
      reaction: BluenoirReaction.HAPPY,
    },
  ],
  [MajorCaseEnum.DATA]: [
    {
      text: "Imagine if you had to actually listen to all of these!",
      reaction: BluenoirReaction.HAPPY,
    },
    {
      text: "What a crummy old system.",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Data? I hardly know ‘a!",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "Don't lie to me, I know you've searched up swearing.",
      reaction: BluenoirReaction.SMUG,
    },
    {
      text: "This reminds me of a video game.",
      reaction: BluenoirReaction.NEUTRAL,
    },
    {
      text: "Wait, who's sleeping with who?",
      reaction: BluenoirReaction.THINKING,
    },
  ],
};

function randomChoice(idle_dialogue_options: Dialogue[]): Dialogue {
  const randomIndex = Math.floor(Math.random() * idle_dialogue_options.length);
  return idle_dialogue_options[randomIndex];
}

// dialog access:

export const getMainPageIdleDialogue = (): Dialogue => {
  return randomChoice(MAIN_PAGE_IDLE);
};

export const getMainPageIdleDialogueWithMajorCases = (context: DjangoContext): Dialogue => {
  const case_solve_count = numberOfMajorCaseSolves(context);
  const idle_dialogue_options =
    MAIN_PAGE_IDLE_CASE_COUNT[case_solve_count as 0 | 1 | 2 | 3].concat(MAIN_PAGE_IDLE);
  return randomChoice(idle_dialogue_options);
};

export const getMinorCaseIdleDialogue = (slug: string): Dialogue => {
  const idle_dialogue_options = MINOR_CASE_IDLE_BY_CASE[slug].concat(MINOR_CASE_IDLE_GENERIC);
  return randomChoice(idle_dialogue_options);
};

export const getMajorCaseIdleDialogue = (majorCaseEnum: MajorCaseEnum): Dialogue => {
  const dialogue_options = MAJOR_CASE_DIALOGUE[majorCaseEnum];
  return randomChoice(dialogue_options);
};

export const wordleFailDialogue = (fail_count: number): Dialogue => {
  return WORDLE_FAIL_PROMPTS[Math.min(fail_count, WORDLE_FAIL_PROMPTS.length - 1)];
};
