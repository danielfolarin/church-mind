import type { Look, Scripture, Story } from "../types";
import { d, HE, leadsWith, m, n, s, t, WEB } from "./kit";

// A Week at Wrenfield.
//
// A first-year student, a long way from home, in the week of a midterm that a
// scholarship depends on. A copy of the paper is going round. See kit.ts for
// the rules every world follows.

const KAI: Look = { manner: "lively", build: { height: 1.04, shoulders: 108, hips: 86, limbs: 20 }, stance: "pockets", legs: "#2A2F3A", shoes: "#E8DCC8", skin: "#D9B08C", shade: "#C2976F", hair: "#17110F", hairStyle: "side", top: "#7A4A8A", topStyle: "hoodie", accent: "#E8DCC8" };
const MEI: Look = { manner: "calm", build: { height: 0.95, shoulders: 86, hips: 82, limbs: 17 }, stance: "clasped", skirt: "#3F3345", shoes: "#2A2020", slim: true, skin: "#EDC9A8", shade: "#D6AE8B", hair: "#17110F", hairStyle: "long", top: "#C2553F", topStyle: "cardigan", accent: "#F4EBDD", lip: "#8A3A32", glasses: true };
const OKONKWO: Look = { manner: "steady", build: { height: 0.99, shoulders: 98, hips: 94, limbs: 20 }, stance: "book", skirt: "#2E2E33", longSkirt: true, shoes: "#1A1614", slim: true, skin: "#6F4631", shade: "#5B3827", hair: "#2A1F1A", hairStyle: "bun", top: "#2F6F73", topStyle: "collar", accent: "#E8DCC8", lip: "#4A1F1C", glasses: true, earrings: true };
const GRACE: Look = { manner: "warm", build: { height: 1, shoulders: 92, hips: 86, limbs: 18 }, stance: "cup", legs: "#2B3A55", shoes: "#E8DCC8", slim: true, skin: "#A8744C", shade: "#915F3B", hair: "#1B1412", hairStyle: "wavy", top: "#B8862F", topStyle: "plain", accent: "#F4EBDD", lip: "#6A2A26", earrings: true, scarf: "#6B3F5A" };
const TOBI: Look = { manner: "confident", build: { height: 1.05, shoulders: 114, hips: 90, limbs: 22 }, stance: "akimbo", legs: "#D9D2C4", shoes: "#3A2A20", skin: "#7A4B31", shade: "#643B25", hair: "#17110F", hairStyle: "short", top: "#1F3A5A", topStyle: "collar", accent: "#F4EBDD" };
const MUM: Look = { manner: "calm", build: { height: 0.94, shoulders: 94, hips: 94, limbs: 20 }, stance: "clasped", skirt: "#5A3A4A", longSkirt: true, shoes: "#2A2020", slim: true, skin: "#8E5B3C", shade: "#774A30", hair: "#3A2A20", hairStyle: "bun", top: "#55704F", topStyle: "cardigan", accent: "#E8DCC8", lip: "#5A2420", earrings: true };

const INTEGRITY_WALK: Scripture = {
  reference: "Proverbs 10:9",
  translation: WEB,
  text: "He who walks blamelessly walks surely, but he who perverts his ways will be found out.",
  contextTitle: "In context",
  context: [
    "Proverbs collects observations about how life tends to go. This one is about footing: a person with nothing to hide can put their whole weight on each step.",
    "It is not a promise that honest people get the best marks. It is a description of what it is like to live without looking over your shoulder.",
  ],
};

const HOSPITALITY: Scripture = {
  reference: "Hebrews 13:2",
  translation: WEB,
  text: "Don’t forget to show hospitality to strangers, for in doing so, some have entertained angels without knowing it.",
  contextTitle: "In context",
  context: [
    "The writer is finishing a long letter with plain instructions for ordinary life. The word translated “hospitality” means, literally, love of the stranger.",
    "The stranger is not a project. The verse hints at the opposite: that the person at your table may be bringing more than you are giving.",
  ],
};

const GRACIOUS_SPEECH: Scripture = {
  reference: "Colossians 4:6",
  translation: WEB,
  text: "Let your speech always be with grace, seasoned with salt, that you may know how you ought to answer each one.",
  contextTitle: "In context",
  context: [
    "Paul is telling a small church how to talk with neighbours who don’t share their faith. Grace comes first; salt, which gives flavour and keeps things honest, comes with it.",
    "He says “each one”. An answer is given to a person, not to a room, and not in order to win.",
  ],
};

const FAR_SIDE: Scripture = {
  reference: "Psalm 139:9–10",
  translation: WEB,
  text: "If I take the wings of the dawn, and settle in the uttermost parts of the sea; Even there your hand will lead me, and your right hand will hold me.",
  contextTitle: "In context",
  context: [
    "The writer is imagining the farthest place he could possibly go: as far east as the sunrise, as far west as the sea. He finds that God is already there.",
    "It was written long before anyone flew anywhere. It reads as though it were written for departure gates.",
  ],
};

const CONFESSION: Scripture = {
  reference: "1 John 1:9",
  translation: WEB,
  text: "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.",
  contextTitle: "In context",
  context: [
    "John is writing to people who already belong to God, not to people trying to get in. Confession here is not grovelling to earn a way back. It is telling the truth to a Father who is already faithful.",
    "Forgiveness is where repair begins. It frees you to go and put things right with the people involved, whatever that costs.",
  ],
};

const ALL = ["mon-day", "mon-eve", "wed-day", "wed-eve", "fri-day", "fri-eve", "sun-day", "sun-eve"];
const EVENINGS = ["mon-eve", "wed-eve", "fri-eve", "sun-eve"];
const STUDIED = ["studied_a", "studied_b", "studied_c"];

export const wrenfieldWeek: Story = {
  id: "wrenfield-week",
  title: "A Week at Wrenfield",
  subtitle: "One exam, one scholarship, and a file everybody else has opened.",
  minutes: 15,

  world: {
    name: "Wrenfield University",
    tagline: "Exams, fees and a long way from home, among people still working out who they are.",
    themes: ["Study", "Honesty", "Belonging", "Faith"],
  },
  map: { ground: "green", backdrop: "halls", mirror: true },
  dog: "Professor",
  banter: [
    "Is this the queue for the printer or for the meaning of life?",
    "I’ve had four coffees and a banana. I can see sound.",
    "Nine o’clock lectures should be illegal.",
    "The ducks have unionised. Don’t feed the grey one.",
    "I’m not lost. I’m exploring without a destination.",
    "My essay is due at noon. It is eleven fifty.",
    "Someone put a traffic cone on the chaplain’s bike again.",
    "The library’s third floor smells of fear and noodles.",
    "Do you know where Hartley is? I’ve been here two years.",
    "I came for a degree and stayed for the soup.",
    "Professor is a very good boy.",
    "Freshers’ flu is a state of mind. Also a virus.",
    "You look like someone who has done the reading. Teach me.",
  ],

  intro: {
    place: "Wrenfield University",
    paragraphs: [
      "Wrenfield is a university town with a slow brown river through the middle of it. There is a library that never quite closes, a chapel that never quite warms up, and four thousand students who arrived, like you, not knowing anyone.",
      "Some of them believe what you believe. Most don’t. All of them are working out who they will be when nobody from home is watching.",
    ],
    playerTraits: [
      "That’s you: first year, Economics, a long flight from home",
      "On a scholarship that needs an average of 70",
      "Works the returns desk at the Wren Library",
      "Part of the Lantern, the student fellowship at St Aldhelm’s",
      "Shares Flat 4C with {partner}",
    ],
    partnerTraits: [
      "Your flatmate: second year, Computer Science",
      "Knows where everything is, and who to ask",
      "Generous to a fault, allergic to rules",
      "Thinks faith is fine, for other people",
    ],
    howToPlay:
      "You have one week: four days, each with a morning and an evening. Every time, you choose one place to be. Shifts pay the fees but wear you out, the exam is on Friday whether you are ready or not, and some people will only ask once.",
  },

  leads: leadsWith({ name: "Kai", pronouns: HE, look: KAI, voice: { kind: "male", variant: 2, pitch: 1.08, rate: 1.03 } }),

  cast: [
    { id: "mei", name: "Mei", look: MEI, voice: { kind: "female", variant: 1, pitch: 1.08 }, traits: ["Exchange student, here for one term", "Three doors down in Larch Court", "Eats most meals alone", "Hasn’t said what she believes; nobody has asked"] },
    { id: "okonkwo", name: "Dr. Okonkwo", look: OKONKWO, voice: { kind: "female", variant: 5, pitch: 0.95, rate: 0.96 }, traits: ["Teaches Statistics for Economists", "Marks hard, explains patiently", "Office door propped open on Wednesdays"] },
    { id: "grace", name: "Grace", look: GRACE, voice: { kind: "female", variant: 4, pitch: 1.04 }, traits: ["Final-year medic; leads the Lantern", "Runs on tea and four hours’ sleep", "Listens first"] },
    { id: "tobi", name: "Tobi", look: TOBI, voice: { kind: "male", variant: 1 }, traits: ["On your course", "Charming, generous, never short of money", "Has not started the essay"] },
    { id: "mum", name: "Mum", look: MUM, voice: { kind: "female", variant: 3, pitch: 0.88, rate: 0.92 }, traits: ["Seven time zones away", "Rings on Mondays", "Prays for you by name every morning"] },
  ],

  narrator: { kind: "female", variant: 2, pitch: 0.95, rate: 0.95 },

  qualityNotes: {
    wisdom: "You went looking for people who had been here before you, and listened.",
    integrity: "You were the same person with the door shut as with it open.",
    compassion: "You noticed the people nobody was looking at, and kept their dignity whole.",
    courage: "You said the hard, plain thing when silence would have been easier.",
    trust: "You brought God the fear itself, and not a tidied version of it.",
  },

  start: { money: 220, energy: 3, bond: 2, place: "flat" },

  slots: [
    { id: "mon-day", day: "Monday", time: "Morning" },
    { id: "mon-eve", day: "Monday", time: "Evening" },
    { id: "wed-day", day: "Wednesday", time: "Morning" },
    { id: "wed-eve", day: "Wednesday", time: "Evening" },
    { id: "fri-day", day: "Friday", time: "Morning" },
    { id: "fri-eve", day: "Friday", time: "Evening" },
    { id: "sun-day", day: "Sunday", time: "Morning" },
    { id: "sun-eve", day: "Sunday", time: "Evening" },
  ],

  places: {
    chapel: { name: "St Aldhelm’s Chapel", x: 81, y: 22, icon: "chapel", at: "west" },
    library: { name: "Wren Library", x: 45, y: 20, icon: "hall", at: "north" },
    hartley: { name: "Hartley Building", x: 14, y: 25, icon: "tower", at: "east" },
    cafe: { name: "The Common Room", x: 71, y: 49, icon: "cup", at: "mid" },
    flat: { name: "Larch Court, Flat 4C", x: 36, y: 51, icon: "door", at: "lane" },
    quad: { name: "The Quad", x: 83, y: 77, icon: "green", at: "green" },
    river: { name: "The Wren", x: 34, y: 86, icon: "water", at: "bank" },
  },

  // The paths of the campus. People walk from junction to junction.
  roads: {
    junctions: {
      w0: [100, 37], west: [81, 36], cross: [59, 35], north: [45, 34.5], top: [24, 33], east: [14, 32.5], e0: [0, 32],
      n0: [59, 0], mid: [59, 49], square: [59, 63], s0: [61, 100],
      t0: [24, 0], lane: [36, 64.5], corner: [27, 65], bank: [34, 82], b0: [38, 100],
      l0: [100, 63], green: [83, 63], r0: [0, 67],
    },
    streets: [
      ["w0", "west"], ["west", "cross"], ["cross", "north"], ["north", "top"], ["top", "east"], ["east", "e0"],
      ["n0", "cross"], ["cross", "mid"], ["mid", "square"], ["square", "s0"],
      ["t0", "top"], ["top", "corner"], ["corner", "bank"], ["bank", "b0"],
      ["l0", "green"], ["green", "square"], ["square", "lane"], ["lane", "corner"], ["corner", "r0"],
    ],
  },

  // What the player can do, and when. Order here is the order shown.
  opportunities: [
    // Things the story is waiting on
    { id: "leak", key: true, place: "flat", slots: ["mon-eve", "wed-eve"], with: ["partner"], title: "{partner} has something to show you", blurb: "“Come to the kitchen. Don’t bring anyone.”", scene: "leak" },
    { id: "answer", key: true, place: "flat", slots: ["wed-eve"], with: ["partner"], when: { all: ["stalling"], none: ["refused", "has_paper", "reported_leak"] }, title: "Give {partner} your answer", blurb: "He said it wasn’t going anywhere. Neither is Friday.", scene: "answer" },
    { id: "the_file", tempt: "ease", place: "flat", slots: ["wed-eve"], when: { all: ["has_paper"], none: ["opened", "refused", "reported_leak"] }, title: "The file on your phone", blurb: "Statistics_Midterm_FINAL.pdf. Unopened. So far.", scene: "file" },
    { id: "lantern", key: true, place: "chapel", slots: ["wed-eve"], with: ["grace"], title: "The Lantern, at St Aldhelm’s", blurb: "Tea, toast, and people who ask how you really are.", energy: 1, bond: { grace: 1 }, scene: "lantern" },
    { id: "warn_kai", key: true, place: "flat", slots: ["wed-eve"], with: ["partner"], when: { all: ["reported_leak"], none: ["warned_kai"] }, title: "Tell {partner} what you told Dr. Okonkwo", blurb: "He is going to walk into a different paper on Friday.", energy: -1, grow: { courage: 1, compassion: 1 }, scene: "warn_kai" },
    { id: "confess", key: true, place: "flat", slots: ["sun-eve"], when: { all: ["cheated"], none: ["owned_up"] }, title: "Write to Dr. Okonkwo", blurb: "No excuses. Just what you did.", grow: { integrity: 1, courage: 1 }, scene: "confess" },
    { id: "counsel", key: true, place: "chapel", slots: ["sun-eve"], with: ["grace"], when: { all: ["cheated"], none: ["owned_up"] }, title: "Tell Grace what you did", blurb: "Then go and do what needs doing.", grow: { wisdom: 1 }, scene: "counsel" },
    { id: "peace", key: true, place: "flat", slots: ["sun-eve"], with: ["partner"], when: { all: ["path_scold"], none: ["made_peace"] }, title: "Knock on {partner}’s door", blurb: "You were right about the paper. You were wrong about him.", grow: { compassion: 1, courage: 1 }, scene: "peace" },

    // Work and money
    { id: "desk_mon", game: "books", place: "library", slots: ["mon-day"], with: ["mei"], title: "Work the returns desk", blurb: "Residence fees are due on Wednesday.", money: 70, energy: -2, scene: "desk_mon" },
    { id: "desk_wed", game: "books", place: "library", slots: ["wed-day"], with: ["mei"], title: "Work the returns desk", blurb: "The trolley is never empty.", money: 70, energy: -2, scene: "desk_wed" },
    { id: "tobi_offer", tempt: "money", place: "cafe", slots: ["mon-eve", "wed-day"], with: ["tobi"], title: "Tobi wants a favour", blurb: "“It’s two thousand words. I’ll make it worth your while.”", scene: "tobi_offer" },
    { id: "give_back", place: "cafe", slots: ["sun-day"], with: ["tobi"], when: { all: ["ghostwrote"], none: ["returned_cash"], minMoney: 150 }, title: "Give Tobi his money back", blurb: "You can’t un-write the essay. You can stop being paid for it.", grow: { integrity: 1 }, scene: "give_back" },

    // Study
    { id: "lecture_mon", place: "hartley", slots: ["mon-day"], with: ["okonkwo", "tobi"], title: "Go to the revision lecture", blurb: "Dr. Okonkwo is working through last year’s paper.", energy: -1, flags: ["studied_a"], scene: "lecture" },
    { id: "office_hours", place: "hartley", slots: ["wed-day"], with: ["okonkwo"], title: "Dr. Okonkwo’s office hours", blurb: "Room 214. The door is propped open with a stapler.", scene: "office_hours" },
    { id: "seminar", place: "hartley", slots: ["wed-day"], with: ["tobi"], title: "Ideas and Society seminar", blurb: "This week: “Is belief a private matter?”", energy: -1, scene: "seminar" },
    { id: "study_night", place: "library", slots: ["wed-eve"], with: ["mei"], title: "Revise in the library", blurb: "Second floor, by the window. Bring a jumper.", energy: -1, flags: ["studied_b"], scene: "study_night" },

    // {partner} and the flat
    { id: "kai_breakfast", place: "flat", slots: ["mon-day"], with: ["partner"], title: "Breakfast with {partner}", blurb: "He is making pancakes. It is not going well.", bond: { partner: 1 }, scene: "kai_breakfast" },
    { id: "kai_after", place: "cafe", slots: ["fri-day"], with: ["partner"], when: { none: ["path_scold"] }, title: "Coffee with {partner} after the exam", blurb: "He’s buying. He wants to compare notes.", bond: { partner: 1 }, scene: "kai_after" },
    { id: "party", place: "flat", slots: ["fri-eve"], with: ["partner", "tobi"], title: "{partner}’s end-of-exams party", blurb: "Flat 4C, from nine. Half the corridor is coming.", scene: "party" },

    // Mei
    { id: "mei_lunch", place: "cafe", slots: ["fri-day"], with: ["mei"], title: "Lunch with Mei", blurb: "Corner table. There’s a chair with her bag on it.", flags: ["met_mei"], bond: { mei: 1 }, scene: "mei_lunch" },
    { id: "potluck", place: "chapel", slots: ["fri-eve"], with: ["grace", "mei"], title: "The Lantern’s Friday supper", blurb: "Bring a dish from home, or just bring yourself.", energy: 1, scene: "potluck" },
    { id: "mei_walk", place: "river", slots: ["sun-day"], with: ["mei"], when: { all: ["met_mei"] }, title: "Walk by the Wren with Mei", blurb: "She goes home in three weeks.", bond: { mei: 1 }, scene: "mei_walk" },

    // Home
    { id: "mum_call", place: "flat", slots: ["mon-eve"], with: ["mum"], title: "Mum is calling", blurb: "It isn’t dawn yet where she is. She has been up since five.", scene: "mum_call" },

    // Sunday
    { id: "service", place: "chapel", slots: ["sun-day"], with: ["grace"], title: "Sunday at St Aldhelm’s", blurb: "Cold pews, good singing, soup afterwards.", energy: 1, scene: "service" },
    { id: "supper", place: "flat", slots: ["sun-eve"], with: ["partner"], when: { none: ["cheated", "path_scold"] }, title: "Sunday supper in 4C", blurb: "{partner} is cooking. Lower your expectations.", energy: 1, bond: { partner: 1 }, scene: "supper" },

    // Always there
    { id: "pray_first", place: "river", slots: EVENINGS, when: { none: ["prayed"] }, title: "Walk down to the Wren and pray", blurb: "No agenda. Just tell God the truth.", energy: 1, grow: { trust: 1 }, flags: ["prayed"], scene: "river_first" },
    { id: "pray_again", repeatable: true, place: "river", slots: EVENINGS, when: { all: ["prayed"] }, title: "Walk down to the Wren and pray", blurb: "Bring the day with you and set it down.", energy: 1, scene: "river_again" },
    { id: "quad", repeatable: true, place: "quad", slots: ["wed-day", "fri-day", "sun-day"], title: "Lie on the quad", blurb: "Do nothing, in public, like everyone else.", energy: 1, scene: "quad" },
    { id: "rest", repeatable: true, place: "flat", slots: ALL, title: "Rest in your room", blurb: "Door shut. Phone in the drawer.", energy: 2, flags: ["rested"], scene: "rest_room" },

    // These happen by themselves
    { id: "fees", auto: true, place: "flat", slots: ["wed-day"], title: "Residence fees", blurb: "", scene: "fees_day" },
    { id: "exam", auto: true, place: "hartley", slots: ["fri-day"], title: "The Statistics midterm", blurb: "", scene: "exam" },
    { id: "reckoning", auto: true, place: "flat", slots: ["sun-eve"], when: { all: ["cheated"], none: ["owned_up"] }, title: "An email from Dr. Okonkwo", blurb: "", scene: "reckoning" },
  ],

  nodes: {
    // ——— Work: the Wren Library ———
    desk_mon: {
      setting: "library",
      caption: "Monday morning · Wren Library",
      onStage: ["mei"],
      beats: [
        n("The returns desk at the Wren Library is the quietest job on campus and pays seventy dollars a shift. You stamp, you sort, you point people towards the printers."),
        n("Near noon a girl you half recognise from Larch Court comes to the desk holding a campus map upside down. Her card says Mei Lin, exchange programme.", { react: { mei: "worried" } }),
        d("mei", "Excuse me. Is there a floor where it is allowed to eat? I have been eating on the stairs. I think that is not allowed either.", "worried"),
        t("Three weeks into term, and she has been eating lunch on a staircase."),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "lunch", label: "“I finish in ten minutes. Come and eat with me.”", grow: { compassion: 1 }, flags: ["met_mei"], bond: { mei: 1 }, next: "desk_lunch" },
        { id: "point", label: "Circle the café on her map and get back to the trolley.", next: "desk_point" },
      ],
    },
    desk_lunch: {
      setting: "cafe",
      caption: "Monday lunchtime · The Common Room",
      beats: [
        n("You take her to the Common Room, which does a decent soup and lets you sit as long as you like."),
        d("mei", "At home, nobody eats alone. Here, everybody does, and they look at their phones so that it seems like a choice.", "thoughtful"),
        d("you", "I did the same thing my first month. I was on the fire escape.", "warm"),
        d("mei", "The fire escape! That is better than the stairs. More air.", "warm"),
        n("She laughs for the first time. You swap numbers. It took ten minutes and a bowl of soup."),
      ],
      next: "map",
    },
    desk_point: {
      setting: "library",
      caption: "Monday morning · Wren Library",
      onStage: ["mei"],
      beats: [
        n("You circle the café and slide the map back. She thanks you twice, the way people do when they are not sure they have understood."),
        t("She’ll find it. Probably. The trolley is full again."),
      ],
      next: "map",
    },
    desk_wed: {
      setting: "library",
      caption: "Wednesday morning · Wren Library",
      onStage: [],
      beats: [
        n("Wednesday’s trolley is mostly Statistics textbooks, returned by people who have given up on them or no longer think they need them."),
        t("You know which. The course group chat has been very quiet and very busy.", { when: { any: ["did:leak", "heard_leak"] } }),
      ],
      next: [{ when: { all: ["met_mei"] }, to: "desk_wed_mei" }, { to: "desk_wed_alone" }],
    },
    desk_wed_mei: {
      setting: "library",
      caption: "Wednesday morning · Wren Library",
      effects: { flags: ["studied_c"] },
      beats: [
        d("mei", "I brought you this. Chilli oil. My mother posted three jars, and I had nobody to give them to.", "warm"),
        d("mei", "Also, hypothesis testing. I can explain it in four minutes. Your lecturer takes fifty.", "warm"),
        n("She does it in three, on the back of a returns slip. Something that has been fogged for a fortnight comes clear."),
      ],
      next: "map",
    },
    desk_wed_alone: {
      setting: "library",
      caption: "Wednesday morning · Wren Library",
      onStage: ["mei"],
      beats: [
        n("The girl from Larch Court is at the window table, alone, with a lunchbox and a dictionary. She looks up when you pass with the trolley, and then down again."),
        t("You have seen her on her own every day this week."),
      ],
      prompt: "A second chance.",
      choices: [
        { id: "hello", label: "Stop the trolley. “I’m sorry I didn’t ask before. Have you eaten?”", grow: { compassion: 1 }, flags: ["met_mei"], bond: { mei: 1 }, next: "desk_second" },
        { id: "pass", label: "Keep pushing. You’re on the clock.", next: "map" },
      ],
    },
    desk_second: {
      setting: "library",
      caption: "Wednesday morning · Wren Library",
      beats: [
        d("mei", "I have eaten. But I have not talked. Sit, if you are allowed.", "warm"),
        n("You take your break at her table. She has a great deal to say about campus soup, most of it fair."),
        t("It was easier than walking past. You’re not sure why it took you three days."),
      ],
      next: "map",
    },

    // ——— Study ———
    lecture: {
      setting: "lecture",
      caption: "Monday morning · Hartley Building, Room 101",
      onStage: ["okonkwo"],
      effects: { flags: ["heard_leak"] },
      beats: [
        d("okonkwo", "Question four. Half of you lost marks here last year for the same reason: you tested the wrong thing, very carefully.", "thoughtful"),
        n("She works it through on the board twice, the second time slowly. It is the first time a confidence interval has seemed like something a person might actually want."),
        d("tobi", "Why are you writing all that down? There’s a paper going round. The actual paper. Ask your flatmate.", "warm"),
        t("You look at the board, and then at your notes, and say nothing. But you heard it.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    office_hours: {
      setting: "library",
      caption: "Wednesday morning · Hartley Building, Room 214",
      onStage: ["okonkwo"],
      beats: [
        n("Room 214 smells of coffee and whiteboard pens. The chair for students has a cushion on it that says, in cross-stitch, “Show your working.”"),
        d("okonkwo", "Sit. You’re one of my scholarship students. What can I do for you?", "warm"),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "help", label: "Ask her to go through hypothesis testing once more.", grow: { wisdom: 1 }, flags: ["studied_c"], next: "office_help" },
        { id: "report", when: { any: ["did:leak", "heard_leak"] }, label: "Tell her a copy of Friday’s paper is going round. Don’t name anyone.", grow: { courage: 1, integrity: 1 }, flags: ["reported_leak"], next: "office_report" },
        { id: "worry", label: "Tell her you’re afraid of losing the scholarship.", grow: { trust: 1 }, flags: ["okonkwo_backs"], next: "office_worry" },
      ],
    },
    office_help: {
      setting: "library",
      caption: "Wednesday morning · Hartley Building, Room 214",
      beats: [
        n("She does it with coins from her desk drawer. Heads, tails: how surprised should you be? Twenty minutes later you could teach it."),
        d("okonkwo", "You didn’t need me. You needed someone to say it slowly. Most of this subject is that.", "warm"),
      ],
      next: "map",
    },
    office_report: {
      setting: "library",
      caption: "Wednesday morning · Hartley Building, Room 214",
      beats: [
        d("you", "I’m not going to tell you who. But Friday’s paper is out. A lot of people have it."),
        n("She takes off her glasses and looks at the ceiling for a moment.", { react: { okonkwo: "sad" } }),
        d("okonkwo", "Thank you. I had wondered why nobody was coming to office hours. I’ll write another tonight.", "thoughtful"),
        d("okonkwo", "You’ve just made your own week harder, for the sake of two hundred people who will never know. I notice that.", "warm"),
        t("Kai has that paper. He is going to walk into a different one."),
      ],
      next: "map",
    },
    office_worry: {
      setting: "library",
      caption: "Wednesday morning · Hartley Building, Room 214",
      beats: [
        d("you", "If I don’t get seventy, I go home. My family has put everything into this."),
        d("okonkwo", "I came here on a bursary with one suitcase, a long time ago. I know what that weighs.", "thoughtful"),
        d("okonkwo", "Here is something nobody tells you. The scholarship office listens to lecturers. If you sit my paper honestly and fall short, I will write to them myself. I can’t do that for a mark I don’t trust.", "warm"),
      ],
      next: "map",
    },
    seminar: {
      setting: "lecture",
      caption: "Wednesday morning · Hartley Building, Seminar Room B",
      onStage: ["tobi"],
      beats: [
        n("Ideas and Society: twelve chairs in a circle, and a tutor who has not slept. This week’s question is on the board. Is belief a private matter?"),
        n("A boy in a rowing fleece says religion is a comfort blanket for people who can’t handle statistics. There is laughter. The tutor looks round the circle."),
        n("“Does anyone here actually believe in God? Not culturally. Actually.” Nobody moves. Tobi is looking straight at you.", { react: { you: "worried" } }),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "speak", label: "Put your hand up, and answer plainly.", grow: { courage: 1 }, flags: ["spoke_up"], next: "seminar_speak" },
        { id: "preach", label: "Take the rowing fleece apart, point by point.", flags: ["preached"], next: "seminar_preach" },
        { id: "quiet", label: "Look at your notes until the moment passes.", flags: ["quiet_seminar"], next: "seminar_quiet" },
      ],
    },
    seminar_speak: {
      setting: "lecture",
      caption: "Wednesday morning · Hartley Building, Seminar Room B",
      beats: [
        d("you", "I do. Actually. I don’t think it makes me cleverer than anyone here. It’s the reason I’m less frightened than I would be otherwise."),
        n("A pause. The rowing fleece opens his mouth, and the tutor holds up a hand."),
        n("“That’s the first sentence this term that cost somebody something. Let’s start from there.” The hour that follows is the best the seminar has had."),
        s(GRACIOUS_SPEECH),
      ],
      next: "map",
    },
    seminar_preach: {
      setting: "lecture",
      caption: "Wednesday morning · Hartley Building, Seminar Room B",
      beats: [
        n("You are well prepared. You have read more than he has, and you use all of it. By the end he has stopped arguing, and so has everybody else."),
        n("“Thank you,” says the tutor. “That was a closing statement. I was hoping for a conversation.”"),
        d("tobi", "Remind me never to disagree with you about anything.", "thoughtful"),
        t("You won. Nobody in that circle is going to ask you a real question now.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    seminar_quiet: {
      setting: "lecture",
      caption: "Wednesday morning · Hartley Building, Seminar Room B",
      beats: [
        n("The tutor waits a moment longer, then moves on. Tobi raises an eyebrow at you and says nothing."),
        t("Nobody would have minded. That is what makes it sit so badly."),
      ],
      next: "map",
    },
    study_night: {
      setting: "library",
      caption: "Wednesday evening · Wren Library, second floor",
      onStage: [],
      beats: [
        n("The second floor at night is green lamps and the sound of two hundred people turning pages. You work the past paper properly, with the clock running."),
        d("mei", "You are doing question four the long way. May I?", "warm", { when: { all: ["met_mei"] } }),
        n("She shows you the short way. Then you tell her what a p-value is in plain words, and she writes it in the margin in two languages.", { when: { all: ["met_mei"] } }),
        t("The file would have been faster. This is yours.", { when: { any: ["has_paper", "stalling"] } }),
        n("By closing time you have done all nine kinds of question. Four of them you actually understand."),
      ],
      next: "map",
    },

    // ——— Kai and the paper ———
    kai_breakfast: {
      setting: "kitchen",
      caption: "Monday morning · Flat 4C",
      beats: [
        n("The smoke alarm in 4C has a cereal bowl taped over it. Kai is at the hob with a spatula and the expression of a man defusing something."),
        d("partner", "First one’s always a sacrifice. Sit. You look like you’ve been up since six worrying about a scholarship.", "warm"),
        d("you", "Five."),
        d("partner", "Overachiever. Eat this. It’s structurally a pancake.", "warm"),
        n("It is burnt on one side and raw in the middle, and he has given you the better of the two. In your second week he walked you to every building on your timetable, so you wouldn’t have to ask."),
        t("He thinks church is a nice hobby, like bouldering. He has never once made you feel stupid for going."),
      ],
      next: "map",
    },
    leak: {
      setting: "kitchen",
      caption: "Evening · Flat 4C, the kitchen",
      beats: [
        n("Kai shuts the kitchen door, which nobody in 4C has ever done, and turns his laptop round."),
        d("partner", "Friday’s Statistics paper. The real one. Someone in third year got it off a shared drive. It’s been round half the course since Sunday.", "thoughtful"),
        d("partner", "I’m not asking if you approve. I’m telling you because you’re the only one I know with a scholarship riding on it, and you’d be walking in blind against two hundred people who aren’t.", "warm"),
        t("Seventy. You need an average of seventy to stay. He isn’t trying to corrupt you. He is trying to look after you, in the only way that occurs to him.", { react: { you: "worried" } }),
        n("The file sits on the screen. Statistics_Midterm_FINAL.pdf."),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "no", label: "“No. Thank you for thinking of me. I’d rather sit it blind.”", grow: { integrity: 1 }, flags: ["refused"], next: "leak_no" },
        { id: "take", tempt: "ease", label: "“Send it. I probably won’t even open it.”", flags: ["has_paper"], next: "leak_take" },
        { id: "wait", label: "“I need to think. Don’t send it yet.”", flags: ["stalling"], next: "leak_wait" },
        { id: "scold", label: "Tell him exactly what you think of people who cheat.", flags: ["refused", "path_scold"], bond: { partner: -2 }, next: "leak_scold" },
      ],
    },
    leak_no: {
      setting: "kitchen",
      caption: "Evening · Flat 4C, the kitchen",
      beats: [
        d("partner", "Blind. Against a room full of people who’ve seen it.", "thoughtful"),
        d("you", "If I keep the scholarship that way, it isn’t mine. I’d know every time the money came in."),
        d("partner", "You’re mad. I mean that with affection.", "warm"),
        n("He closes the laptop. He doesn’t delete the file, and you don’t ask him to. That is his to decide."),
        t("You notice that you’re afraid, and that being afraid hasn’t changed the answer."),
      ],
      next: "map",
    },
    leak_take: {
      setting: "kitchen",
      caption: "Evening · Flat 4C, the kitchen",
      beats: [
        n("Your phone buzzes on the counter. One attachment."),
        d("partner", "There. Insurance. Open it or don’t.", "warm"),
        t("Probably won’t. You heard yourself say “probably”.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    leak_wait: {
      setting: "kitchen",
      caption: "Evening · Flat 4C, the kitchen",
      beats: [
        d("partner", "Sure. It’s not going anywhere. Neither is Friday.", "neutral"),
        t("You haven’t said yes. You are aware that you also haven’t said no."),
      ],
      next: "map",
    },
    answer: {
      setting: "kitchen",
      caption: "Wednesday evening · Flat 4C, the kitchen",
      beats: [
        d("partner", "So. Wednesday. In or out? I’m not going to ask again; it’s getting embarrassing for both of us.", "thoughtful"),
        t("Two days of not deciding. It has been more tiring than either answer would have been."),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "no", label: "“Out. Thank you for thinking of me. I’d rather sit it blind.”", grow: { integrity: 1, courage: 1 }, flags: ["refused"], next: "leak_no" },
        { id: "take", tempt: "ease", label: "“Send it.”", flags: ["has_paper"], next: "file" },
      ],
    },
    leak_scold: {
      setting: "kitchen",
      caption: "Evening · Flat 4C, the kitchen",
      beats: [
        d("you", "Do you know what it costs my family for me to be here? And you’re passing this round like a takeaway menu. It’s pathetic. All of you."),
        n("It comes out colder than you meant, and you let it stand anyway. Kai’s face does something you haven’t seen it do before.", { react: { partner: "hurt" } }),
        d("partner", "Right. I was trying to help you. Noted.", "hurt"),
        n("He takes the laptop to his room. You were right about the paper. The kitchen is very quiet."),
        t("You said a true thing in a way designed to make him small. You’re not sure what to call that.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    file: {
      setting: "room",
      caption: "Wednesday evening · your room",
      beats: [
        n("Half past eleven. The file is still in your messages, unopened: a small grey paperclip."),
        n("Through the wall you can hear Kai laughing at something. In the group chat, forty people are being very careful not to mention it."),
        t("Everyone else has seen it. You would only be levelling the field. You have rehearsed that sentence so often that it almost sounds like something you believe.", { react: { you: "worried" } }),
      ],
      prompt: "What do you do with it?",
      choices: [
        { id: "open", tempt: "ease", label: "Open it. Just to see how hard it is.", flags: ["opened"], next: "file_open" },
        { id: "delete", label: "Delete it, and go and tell Kai you’re out.", grow: { integrity: 1, courage: 1 }, flags: ["refused"], next: "file_delete" },
        { id: "leave", label: "Leave it there, unopened, and go to sleep.", next: "file_leave" },
      ],
    },
    file_open: {
      setting: "room",
      caption: "Wednesday evening · your room",
      beats: [
        n("It is nine questions. You read all nine. You can’t unread them."),
        n("By one o’clock you have worked every answer twice. It doesn’t feel like revising. It feels like learning the lines of a play."),
        t("You tell yourself you’ll decide on Friday whether to use it. Part of you knows that the deciding was just now.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    file_delete: {
      setting: "kitchen",
      caption: "Wednesday evening · Flat 4C",
      beats: [
        n("You delete it, and then empty the folder it goes to, because you know yourself."),
        d("you", "I got rid of it. I’m sitting it straight."),
        d("partner", "You came to tell me that at midnight?", "thoughtful"),
        d("partner", "Fine. Respect. You’re still mad.", "warm"),
        t("You sleep better than you have all week."),
      ],
      next: "map",
    },
    file_leave: {
      setting: "room",
      caption: "Wednesday evening · your room",
      beats: [n("You put the phone face down on the desk and turn off the lamp."), t("Not opening it isn’t the same as refusing it. But it isn’t nothing, either.")],
      next: "map",
    },
    warn_kai: {
      setting: "kitchen",
      caption: "Wednesday evening · Flat 4C",
      effects: { flags: ["warned_kai", "studied_b"], bond: { partner: 1 } },
      beats: [
        d("you", "I need to tell you something before Friday. I told Dr. Okonkwo there’s a paper going round. I didn’t give her a name. She’s setting a new one."),
        n("Kai puts his fork down very carefully.", { react: { partner: "hurt" } }),
        d("partner", "You did what? I showed you that as a favour.", "hurt"),
        d("you", "I know you did. That’s why I’m telling you to your face, tonight, and not letting you find out in the exam hall. I’ve got two days and all my notes. Sit down."),
        n("He swears, at length, at the ceiling. Then he fetches his laptop."),
        d("partner", "You are the most annoying person I have ever lived with. Start at confidence intervals.", "thoughtful"),
      ],
      next: "map",
    },

    // ——— The Lantern ———
    lantern: {
      setting: "hall",
      caption: "Wednesday evening · St Aldhelm’s Chapel",
      onStage: ["grace"],
      beats: [
        n("The Lantern meets in the side room of St Aldhelm’s, where the radiator works. Eleven students, two teapots, and a rule that nobody is allowed to say “fine”."),
        d("grace", "Right. Real answers only. How’s the week?", "warm"),
        n("A second-year says she hasn’t rung her dad since August. A boy from Engineering thinks he chose the wrong degree. Nobody fixes anybody."),
        d("grace", "And you? You’ve got the look of someone doing sums.", "thoughtful"),
      ],
      prompt: "What do you tell them?",
      choices: [
        { id: "paper", when: { any: ["has_paper", "stalling"], none: ["refused"] }, label: "Tell them about the paper, and that you haven’t decided.", grow: { wisdom: 1, trust: 1 }, flags: ["counsel"], next: "lantern_paper" },
        { id: "scared", when: { all: ["refused"], none: ["path_scold"] }, label: "Tell them you turned the paper down, and that you’re scared.", grow: { trust: 1 }, flags: ["counsel", "studied_c"], next: "lantern_scared" },
        { id: "kai", when: { all: ["path_scold"] }, label: "Tell them what you said to Kai.", grow: { wisdom: 1 }, flags: ["counsel"], next: "lantern_kai" },
        { id: "home", label: "Tell them you miss home more than you expected.", grow: { trust: 1 }, next: "lantern_home" },
        { id: "fine", label: "“Busy. Exams. You know.”", next: "lantern_fine" },
      ],
    },
    lantern_paper: {
      setting: "hall",
      caption: "Wednesday evening · St Aldhelm’s Chapel",
      beats: [
        n("You tell them. Nobody gasps. Two people look at their tea in a way that suggests they have the same file."),
        d("grace", "I’m not going to tell you what to do. You already know what I think. I’ll ask you something instead.", "thoughtful"),
        d("grace", "Who do you want to be on Saturday morning? Friday’s over in two hours. You have to be that person for a lot longer.", "warm"),
        s(INTEGRITY_WALK),
        n("Someone refills your cup without asking. Nobody makes you promise anything."),
      ],
      next: "map",
    },
    lantern_scared: {
      setting: "hall",
      caption: "Wednesday evening · St Aldhelm’s Chapel",
      beats: [
        d("you", "I said no to it. And I think I might fail. Both of those are true."),
        d("grace", "Then we’ll pray about the second one, and I’ll bring my first-year stats notes to your flat tomorrow. I got sixty-three. They’re not good notes. They’re honest notes.", "warm"),
        n("They pray for you by name. It is strange and steadying to be said aloud like that."),
      ],
      next: "map",
    },
    lantern_kai: {
      setting: "hall",
      caption: "Wednesday evening · St Aldhelm’s Chapel",
      beats: [
        d("you", "I was right. I keep saying that to myself. I was right."),
        d("grace", "You probably were. Was he an enemy, or a friend offering you the wrong thing?", "thoughtful"),
        d("grace", "You can keep the “no” and take back the contempt. They don’t come as a set.", "warm"),
        t("His door is four steps from yours. It has felt like more than that since Monday."),
      ],
      next: "map",
    },
    lantern_home: {
      setting: "hall",
      caption: "Wednesday evening · St Aldhelm’s Chapel",
      beats: [
        d("you", "My mum rings on Mondays. I tell her everything’s wonderful. Then I sit on my bed for an hour."),
        d("grace", "I did that for a whole term in second year. Then I told mine the truth, and she said, “I know. I’m your mother.”", "warm"),
        n("The room laughs, gently. Three of the people in it are far from home. You hadn’t known."),
      ],
      next: "map",
    },
    lantern_fine: {
      setting: "hall",
      caption: "Wednesday evening · St Aldhelm’s Chapel",
      beats: [
        d("grace", "Mm. That’s a “fine” wearing a hat. I’ll let it go. The door’s open on Wednesdays, and my phone’s on always.", "warm"),
        t("You could have said it. The moment was right there, and it was safe."),
      ],
      next: "map",
    },

    // ——— Tobi ———
    tobi_offer: {
      setting: "cafe",
      caption: "The Common Room, a corner table",
      onStage: ["tobi"],
      beats: [
        d("tobi", "Two thousand words on market failure, due Friday. I have written the title. It’s a very good title.", "warm"),
        d("tobi", "You’re the best writer on the course, and you work in a library for seventy dollars a go. I’ll give you a hundred and fifty to write mine. Cash. Tonight.", "warm"),
        n("He puts the notes on the table between the cups. They are very clean, the way money is when it comes out of someone else’s account."),
        t("Residence fees are $290. You have {money}.", { when: { none: ["did:fees"] } }),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "write", tempt: "money", label: "Take the money. It’s only an essay.", money: 150, flags: ["ghostwrote"], next: "tobi_write" },
        { id: "coach", label: "“I won’t write it. I’ll sit with you for an hour and help you plan it.”", grow: { compassion: 1, integrity: 1 }, flags: ["coached"], bond: { tobi: 1 }, next: "tobi_coach" },
        { id: "no", label: "“No. And don’t ask anyone else, either.”", grow: { integrity: 1 }, flags: ["refused_tobi"], next: "tobi_no" },
      ],
    },
    tobi_write: {
      setting: "cafe",
      caption: "The Common Room, a corner table",
      beats: [
        n("You write it in four hours, well, in a voice a little duller than your own. He reads the first paragraph and grins."),
        d("tobi", "Worth every cent. Same again next month?", "warm"),
        t("You have just sold something you didn’t know had a price. A hundred and fifty, as it turns out.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    tobi_coach: {
      setting: "cafe",
      caption: "The Common Room, a corner table",
      beats: [
        n("He groans, and then gets out a pen. It turns out he has ideas. Nobody has ever made him put them in order."),
        d("tobi", "My dad pays for everything. Tutors, the flat, all of it. I’ve never actually had to find out whether I can do this.", "thoughtful"),
        d("you", "Paragraph two is yours. All I did was ask questions."),
        n("He writes four hundred words before the café closes, and looks at them as if someone else had done it."),
      ],
      next: "map",
    },
    tobi_no: {
      setting: "cafe",
      caption: "The Common Room, a corner table",
      beats: [
        d("tobi", "Wow. All right. It was a business proposal, not a confession.", "hurt"),
        n("He picks up the notes and his coffee, and goes to find someone hungrier."),
        t("You were right to refuse. You might have left him somewhere to go.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    give_back: {
      setting: "cafe",
      caption: "Sunday morning · The Common Room",
      effects: { money: -150, flags: ["returned_cash"] },
      beats: [
        n("You put the envelope on the table. A hundred and fifty: the same notes, if you could have managed it."),
        d("you", "I shouldn’t have taken it. I can’t un-write the essay. I can at least not be paid for it."),
        d("tobi", "You’re giving money back. Who does that?", "thoughtful"),
        d("tobi", "It came back with a seventy-two, you know. Best mark I’ve ever had. I felt nothing. Isn’t that strange?", "sad"),
        n("He turns the envelope over a couple of times. Then he asks, not quite looking at you, whether the offer of an hour with a pen is still open."),
      ],
      next: "map",
    },

    // ——— Home ———
    mum_call: {
      setting: "room",
      caption: "Monday evening · your room",
      onStage: ["mum"],
      beats: [
        n("Her face fills the screen, too close, the way it always is. Behind her the kitchen light is on and the radio is going. It is not yet dawn there."),
        d("mum", "There you are. You look thin. Are you eating? How is the course? Your father wants to know if it is cold.", "warm"),
        t("The course is hard. The fees are due on Wednesday. You have eaten toast for three days. She got up at five to make this call.", { react: { you: "worried" } }),
      ],
      prompt: "What do you tell her?",
      choices: [
        { id: "truth", label: "Tell her the truth: it’s hard, you’re lonely, and you’re staying.", grow: { trust: 1, courage: 1 }, flags: ["told_mum_truth"], bond: { mum: 1 }, next: "mum_truth" },
        { id: "mask", tempt: "ease", label: "“Everything’s wonderful. Top of the class. Don’t worry.”", flags: ["masked_mum"], next: "mum_mask" },
      ],
    },
    mum_truth: {
      setting: "room",
      caption: "Monday evening · your room",
      beats: [
        d("you", "It’s harder than I said it would be. I haven’t made many friends yet. I’m not coming home. I just didn’t want to keep pretending."),
        n("She is quiet for a moment. The radio plays behind her.", { react: { mum: "sad" } }),
        d("mum", "Good. Now I know what to pray for. I have been praying for “everything wonderful” for six weeks, and I could tell God was confused.", "warm"),
        d("mum", "Eat something that is not bread. And find one person. One is enough to start with.", "warm"),
      ],
      next: "map",
    },
    mum_mask: {
      setting: "room",
      caption: "Monday evening · your room",
      beats: [
        d("mum", "Top of the class! I will tell your aunt. I will tell everyone.", "warm"),
        n("She is so pleased. You watch her be pleased about a person who doesn’t exist."),
        t("You wanted to protect her. You have also made sure she can’t help.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    fees_day: {
      setting: "room",
      caption: "Wednesday morning · your room",
      beats: [n("Wednesday. The accommodation office has emailed before you are properly awake: residence fee instalment, $290, due today.", { react: { you: "worried" } })],
      next: [{ when: { minMoney: 290 }, to: "fees_paid" }, { to: "fees_short" }],
    },
    fees_paid: {
      setting: "room",
      caption: "Wednesday morning · your room",
      effects: { money: -290, flags: ["fees_paid"] },
      beats: [
        n("You pay it, and watch the balance fall to almost nothing."),
        t("Tobi’s money is in that payment. The room is paid for. It doesn’t feel entirely like yours.", { when: { all: ["ghostwrote"] } }),
        t("{money} until the next shift. But the door of 4C still opens with your key.", { when: { none: ["ghostwrote"] }, react: { you: "warm" } }),
      ],
      next: "map",
    },
    fees_short: {
      setting: "room",
      caption: "Wednesday morning · your room",
      beats: [n("You have {money}. You try the sum with the shift you haven’t worked yet, and it still comes out short.")],
      prompt: "What do you do?",
      choices: [
        { id: "plan", label: "Go to the accommodation office and ask for a payment plan.", grow: { integrity: 1, courage: 1 }, flags: ["fees_plan"], next: "fees_plan" },
        { id: "kai", when: { none: ["path_scold"] }, label: "Tell Kai you’re short, and let him help.", grow: { trust: 1 }, flags: ["fees_helped"], next: "fees_helped" },
        { id: "avoid", tempt: "ease", label: "Archive the email. Deal with it after the exam.", flags: ["fees_avoided"], next: "fees_avoided" },
      ],
    },
    fees_plan: {
      setting: "room",
      caption: "Wednesday morning · the accommodation office",
      effects: { payUpTo: 145 },
      beats: [
        n("The woman at the desk has a lanyard covered in badges and has clearly had this conversation four hundred times. She does not make you feel like the four hundred and first."),
        n("“Half today, half on the first. You came in before the deadline, so there’s no late fee. Sign here.”"),
        t("Asking was the expensive part. The rest was a form.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    fees_helped: {
      setting: "kitchen",
      caption: "Wednesday morning · Flat 4C",
      effects: { payUpTo: 290 },
      beats: [
        d("you", "I’m short on the residence fees. I hate saying that out loud."),
        d("partner", "How short? That’s it? I spent more than that on a jacket I don’t even like.", "warm"),
        d("partner", "Pay me back when you can. Or just don’t be weird about it for the rest of the year. Your choice.", "warm"),
        n("He sends it before you have finished protesting. You came here meaning to be the one who helps. It is uncomfortable, and good for you, to be the other one."),
      ],
      next: "map",
    },
    fees_avoided: {
      setting: "room",
      caption: "Wednesday morning · your room",
      beats: [
        n("You archive it. A second email comes at noon with a red flag on it. You archive that too."),
        t("It hasn’t gone away. It has just stopped being somewhere you look."),
      ],
      next: "map",
    },

    // ——— The exam ———
    exam: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: ["okonkwo"],
      beats: [
        n("Two hundred desks in rows, one clock, and Dr. Okonkwo at the front with a stack of papers held against her chest. Phones go in the box by the door."),
        d("okonkwo", "You have ninety minutes. You may turn over.", "neutral"),
      ],
      next: [{ when: { all: ["reported_leak"] }, to: "exam_new" }, { when: { all: ["opened"] }, to: "exam_known" }, { to: "exam_plain" }],
    },
    exam_new: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: [],
      effects: { flags: ["sat_honest"] },
      beats: [
        n("Question one is about fertiliser yields. The paper in the group chat was about bus timetables. A sound goes through the room like wind through a field."),
        n("Three rows ahead, Kai has gone completely still.", { when: { none: ["warned_kai"] } }),
        n("Three rows ahead, Kai turns round, finds you, and gives the smallest possible nod. Then he picks up his pen.", { when: { all: ["warned_kai"] } }),
      ],
      next: [{ when: { any: STUDIED }, to: "exam_ready" }, { to: "exam_hard" }],
    },
    exam_known: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: [],
      beats: [
        n("Question one is about bus timetables. You know the answer before you have finished reading it. You know all nine."),
        n("Your hand is steady. That is the strange part."),
        t("Nobody would ever be able to tell.", { react: { you: "worried" } }),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "write", tempt: "ease", label: "Write what you memorised.", flags: ["cheated"], next: "exam_cheated" },
        { id: "hand", label: "Put your hand up, and tell her you have seen this paper.", grow: { courage: 1, integrity: 1 }, flags: ["owned_up", "hand_up"], next: "exam_hand" },
      ],
    },
    exam_cheated: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: [],
      beats: [
        n("You finish with forty minutes to spare, and spend them putting in small deliberate mistakes, so that it will look as though a person wrote it."),
        t("That last part is the bit you will remember.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    exam_hand: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      beats: [
        n("Your arm goes up before you have agreed to it. Dr. Okonkwo comes down the aisle and bends to listen. You say it in six words."),
        n("She looks at you for a long moment, then picks up your paper. Two hundred people watch you follow her out."),
        d("okonkwo", "You’ll sit a different paper on Tuesday, in my office. I have to report that you had this one. I will also report that you told me yourself, before a single mark was written. That part matters.", "thoughtful"),
        t("Your legs are shaking. You have not felt this light since Monday.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    exam_plain: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: [],
      effects: { flags: ["sat_honest"] },
      beats: [
        n("Question one is about bus timetables. You read it the way you would read anything for the first time."),
        t("The file is in the box by the door, on your phone, still unopened.", { when: { all: ["has_paper"], none: ["refused"] } }),
        n("All around you, pens are moving very fast and very early."),
      ],
      next: [{ when: { any: STUDIED }, to: "exam_ready" }, { to: "exam_hard" }],
    },
    exam_ready: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: [],
      effects: { flags: ["exam_ready"] },
      beats: [
        n("It is hard, and you can do it. Not all of it; question seven beats you fairly. But the confidence interval comes out the way it did when someone showed you, and you know why."),
        t("Whatever this mark turns out to be, you will be able to look at it.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    exam_hard: {
      setting: "lecture",
      caption: "Friday morning · Hartley Building, Room 101",
      onStage: [],
      effects: { flags: ["exam_hard"] },
      beats: [
        n("Question three might as well be in another alphabet. You write what you know, show every line of your working, and leave two questions half done."),
        t("It won’t be seventy. It will be yours.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    kai_after: {
      setting: "cafe",
      caption: "Friday, after the exam · The Common Room",
      beats: [
        d("partner", "That was not the paper. That was NOT the paper. Fertiliser! I revised buses! Somebody told her, and I’d love to know who.", "worried", { when: { all: ["reported_leak"], none: ["warned_kai"] } }),
        t("You could tell him now. It would have been kinder on Wednesday.", { when: { all: ["reported_leak"], none: ["warned_kai"] }, react: { you: "worried" } }),
        d("partner", "Fertiliser. You called it. I got maybe half, and half is more than I’d earned. Thanks to you and your flashcards.", "warm", { when: { all: ["warned_kai"] } }),
        d("partner", "I heard somebody walked out with Okonkwo ten minutes in. Tell me that wasn’t you.", "worried", { when: { all: ["hand_up"] } }),
        d("you", "It was me.", undefined, { when: { all: ["hand_up"] } }),
        d("partner", "You had it. You had the whole thing in your head, and you put your hand up.", "thoughtful", { when: { all: ["hand_up"] } }),
        d("partner", "Easiest exam of my life. You?", "warm", { when: { none: ["reported_leak", "hand_up"] } }),
        d("you", "Easy enough.", undefined, { when: { all: ["cheated"] } }),
        t("You both drink your coffee. Neither of you says well done.", { when: { all: ["cheated"] }, react: { you: "sad" } }),
        d("you", "Hard. Fair, though.", undefined, { when: { all: ["sat_honest"], none: ["reported_leak"] } }),
      ],
      next: [{ when: { any: ["refused", "hand_up", "warned_kai"] }, to: "kai_asks" }, { to: "map" }],
    },
    kai_asks: {
      setting: "cafe",
      caption: "Friday, after the exam · The Common Room",
      beats: [d("partner", "Can I ask you something? You could have had an easy week. Nobody would’ve known. Is that the church thing, or are you just built like that?", "thoughtful")],
      prompt: "What do you tell him?",
      choices: [
        { id: "share", label: "Tell him the truth, plainly, without a sermon.", grow: { courage: 1 }, flags: ["shared_faith"], bond: { partner: 1 }, next: "kai_share" },
        { id: "shrug", label: "“Just built like that, I suppose.”", next: "kai_shrug" },
      ],
    },
    kai_share: {
      setting: "cafe",
      caption: "Friday, after the exam · The Common Room",
      beats: [
        d("you", "It’s the church thing. I think I’m already loved, before the mark comes back. So the mark doesn’t get to tell me who I am. I forget that about twice a day."),
        d("partner", "Huh.", "thoughtful"),
        d("partner", "That’s annoyingly coherent. I was hoping for something I could make fun of.", "warm"),
        n("He buys the second coffee without being asked. For Kai, that is a theological statement."),
      ],
      next: "map",
    },
    kai_shrug: {
      setting: "cafe",
      caption: "Friday, after the exam · The Common Room",
      beats: [
        d("partner", "Hm. No. I’ve met how people are built. That wasn’t it.", "thoughtful"),
        t("He asked a real question, and you handed him a shrug. He’ll ask again. He’s like that."),
      ],
      next: "map",
    },

    // ——— Friday night ———
    party: {
      setting: "kitchen",
      caption: "Friday evening · Flat 4C",
      onStage: ["partner"],
      beats: [
        n("By ten there are forty people in a flat built for five. Someone has put a traffic cone on the fridge. The bass is coming up through the floor."),
        d("partner", "You came! I had money on you being in the library. Drink?", "warm", { when: { none: ["path_scold"] } }),
        n("Kai sees you across the room, and looks away. It is his party, and you live here. You stay anyway.", { when: { all: ["path_scold"] }, react: { partner: "hurt" } }),
        n("Half the room is celebrating. The other half revised bus timetables, and is drinking about it.", { when: { all: ["reported_leak"] } }),
      ],
      prompt: "How do you spend the night?",
      choices: [
        { id: "guest", label: "Stay. Keep a clear head, and keep an eye on people.", grow: { compassion: 1 }, flags: ["good_guest"], next: "party_guest" },
        { id: "drink", tempt: "ease", label: "Drink until you stop feeling like the odd one out.", flags: ["drunk"], energy: -1, next: "party_drunk" },
        { id: "hide", label: "Go to your room and put your headphones on.", flags: ["hid"], next: "party_hide" },
      ],
    },
    party_guest: {
      setting: "kitchen",
      caption: "Friday evening · Flat 4C",
      beats: [
        n("You dance badly, on purpose. You hold someone’s coat. At one o’clock a first-year you don’t know is grey-faced on the stairs, and you sit with her until her flatmate comes."),
        d("partner", "You’re weirdly good at parties for someone who doesn’t drink at them.", "warm", { when: { none: ["path_scold"] } }),
        t("You didn’t have to become someone else to be in the room. You hadn’t been sure of that."),
      ],
      next: "map",
    },
    party_drunk: {
      setting: "kitchen",
      caption: "Saturday, far too early · Flat 4C",
      onStage: [],
      beats: [
        n("It works, for about an hour. Then it works too well. You remember the traffic cone, and telling a stranger something about your mother, and then the bathroom floor."),
        n("You wake at six with a blanket over you that you didn’t fetch, and a glass of water by your hand."),
        t("Kai. It could only have been Kai. He never mentions it. That is its own kind of grace, and it came from a direction you weren’t watching.", { when: { none: ["path_scold"] } }),
        t("Somebody looked after you. You don’t know who. You weren’t much use to anyone last night, including yourself.", { when: { all: ["path_scold"] } }),
      ],
      next: "map",
    },
    party_hide: {
      setting: "room",
      caption: "Friday evening · your room",
      beats: [
        n("You lie on your bed with your headphones on, facing the wall, listening to the muffled sound of everyone you live with being happy."),
        t("You tell yourself it is conviction. It feels a great deal more like fear.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    potluck: {
      setting: "hall",
      caption: "Friday evening · St Aldhelm’s Chapel",
      onStage: ["grace"],
      beats: [n("Trestle tables down the nave of St Aldhelm’s, and on them the cooking of eleven countries, most of it made in shared kitchens with one working hob.")],
      next: [{ when: { all: ["met_mei"] }, to: "potluck_mei" }, { to: "potluck_plain" }],
    },
    potluck_mei: {
      setting: "hall",
      caption: "Friday evening · St Aldhelm’s Chapel",
      effects: { flags: ["mei_potluck"], bond: { mei: 1 } },
      beats: [
        n("Mei comes in behind you holding a covered dish in both hands, as if it might be refused at the door.", { react: { mei: "worried" } }),
        d("grace", "You must be Mei. That smells incredible. You’re between Engineering and the jollof. Good luck.", "warm"),
        n("By nine she is teaching four people to fold dumplings, and laughing with her whole face.", { react: { mei: "warm" } }),
        s(HOSPITALITY),
        d("grace", "Nobody’s going to preach at anyone tonight. We just feed people. It’s the most theological thing we do.", "warm"),
      ],
      next: "map",
    },
    potluck_plain: {
      setting: "hall",
      caption: "Friday evening · St Aldhelm’s Chapel",
      beats: [
        d("grace", "Nobody’s going to preach at anyone tonight. We just feed people. It’s the most theological thing we do.", "warm"),
        n("You eat three kinds of rice and something you can’t name, and laugh more than you have since you landed."),
        t("The girl from Larch Court isn’t here. Nobody thought to ask her. You could have.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    mei_lunch: {
      setting: "cafe",
      caption: "Friday lunchtime · The Common Room",
      onStage: ["mei"],
      beats: [
        n("Mei is at the corner table with a tray, a textbook, and a chair she has put her bag on, the way you do so it looks as though you are expecting someone."),
        d("you", "Is that chair waiting for anybody?"),
        d("mei", "It was waiting for you, then. Sit. You look like a person who has finished an exam. I prescribe noodles.", "warm"),
        n("She tells you about her city: nine million people, a river you can’t see across, a grandmother who thinks “abroad” is an illness you recover from."),
        d("mei", "People here are very kind and very busy. They say “we should get coffee” and it means goodbye. You are the first one who meant it.", "thoughtful"),
      ],
      next: "map",
    },
    mei_walk: {
      setting: "river",
      caption: "Sunday morning · beside the Wren",
      beats: [
        n("The Wren is slow and brown and full of ducks. Mei walks with her hands in her sleeves."),
        d("mei", "I go home in three weeks. When I came, I thought I would count the days. Now I am counting them the other way.", "thoughtful"),
        d("mei", "You go to the church with the cold benches. I looked in once. I did not know if someone like me is allowed.", "thoughtful"),
        d("you", "You’re allowed. You’d be allowed if you only came for the soup.", "warm"),
        n("She folds something out of a bus ticket as she walks, and puts it in your hand at the bridge: a paper crane, slightly lopsided."),
        d("mei", "For the person who asked if I had eaten.", "warm"),
      ],
      next: "map",
    },

    // ——— Sunday ———
    service: {
      setting: "hall",
      caption: "Sunday morning · St Aldhelm’s Chapel",
      onStage: ["grace"],
      beats: [
        n("St Aldhelm’s on a Sunday: forty students, three professors, and a heating system that gave up in the 1970s. Grace is on the door in gloves, handing out service sheets."),
        n("The chaplain says that God is not waiting at the end of your degree to see how you did. He is in the week with you, including the parts you would rather he had missed."),
        t("Including Friday. You sit very still.", { when: { all: ["cheated"], none: ["owned_up"] }, react: { you: "sad" } }),
        t("You sing the last hymn louder than you meant to.", { when: { all: ["sat_honest"] }, react: { you: "warm" } }),
        d("grace", "Lunch is soup. It’s always soup. Stay.", "warm"),
      ],
      next: "map",
    },
    supper: {
      setting: "kitchen",
      caption: "Sunday evening · Flat 4C",
      beats: [
        n("Kai has made a curry from a video he stopped watching halfway through. It is, against every expectation, good."),
        n("Mei has brought the chilli oil. Kai has put it on everything, and is crying, and refuses to stop.", { when: { all: ["met_mei"] } }),
        d("partner", "Results on Tuesday. Whatever. Tonight we eat.", "warm"),
        t("Six weeks ago you ate toast alone in this kitchen. You say grace in your head, and mean every word.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    reckoning: {
      setting: "room",
      caption: "Sunday evening · your room",
      beats: [
        m("okonkwo", "To everyone taking Statistics for Economists: a number of Friday’s scripts match, almost line for line, a paper that was circulating beforehand. I would much rather hear it from you than from the exams office. My door is open tomorrow from nine."),
        t("A number of scripts. She hasn’t said which. She doesn’t have to.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    confess: {
      setting: "room",
      caption: "Sunday evening · your room",
      effects: { flags: ["owned_up"] },
      beats: [
        n("You write it four times. The first three have the word “but” in them."),
        m("you", "Dr. Okonkwo, I had the paper before the exam, and I used it. I am not writing to explain. I am writing to tell you, and to ask what I should do next."),
        n("You send it before you can read it again. Her reply comes within the hour."),
        m("okonkwo", "Thank you. Room 214, nine o’clock. Bring nothing. This will cost you something, and I will see that it costs you no more than it should."),
        t("The scholarship may go. For the first time since Wednesday night, you can breathe all the way in.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    counsel: {
      setting: "hall",
      caption: "Sunday evening · St Aldhelm’s Chapel",
      effects: { flags: ["told_grace"] },
      beats: [
        n("Grace is stacking chairs after the evening service. She takes one look at you, and puts the chair down."),
        d("you", "I used the paper. I’ve got a mark that isn’t mine."),
        d("grace", "Okay. Thank you for telling me. Sit down before you fall down.", "warm"),
        d("grace", "I’m not going to tell you it’s fine. You wouldn’t believe me, and you’d be right. I’ll tell you it’s forgivable, which is better.", "thoughtful"),
        s(CONFESSION),
        d("grace", "God isn’t the one you need to email, though. Do you want to do it now, here, or shall I walk you back?", "warm"),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "now", label: "Write to Dr. Okonkwo now, with Grace beside you.", grow: { integrity: 1, courage: 1 }, next: "confess" },
        { id: "later", tempt: "ease", label: "“Not tonight. I need to think.”", next: "counsel_later" },
      ],
    },
    counsel_later: {
      setting: "hall",
      caption: "Sunday evening · St Aldhelm’s Chapel",
      beats: [
        d("grace", "All right. It’ll keep. So will the offer.", "warm"),
        t("She doesn’t push. The email is still unwritten. It is harder to carry, now that someone else knows what it weighs."),
      ],
      next: "map",
    },
    peace: {
      setting: "kitchen",
      caption: "Sunday evening · Flat 4C",
      effects: { flags: ["made_peace"], bond: { partner: 2 } },
      beats: [
        n("His door has a sticker on it that says DO NOT DISTURB UNLESS FOOD. You knock anyway."),
        d("you", "I’m not here to take back what I think about the paper. I’m here because of how I said it. You were trying to look after me, and I called you pathetic."),
        n("Kai leans on the door frame for a while.", { react: { partner: "thoughtful" } }),
        d("partner", "I’ve been called worse. Not by anyone I liked.", "sad"),
        d("you", "I’m sorry. No “but”."),
        d("partner", "I still think you’re wrong. I think you’re the kind of wrong I’d want on a jury.", "warm"),
        n("He goes back in, and comes out with two forks."),
      ],
      next: "map",
    },

    // ——— Always there ———
    river_first: {
      setting: "river",
      caption: "Evening · beside the Wren",
      beats: [
        n("The path by the Wren is unlit past the boathouse. You walk until the noise of the campus drops away."),
        t("I’m a long way from everyone who knows me. I’m frightened about Friday. I don’t know who I am here yet."),
        s(FAR_SIDE),
        n("Nothing is solved. The river goes on being a river. You walk back slower than you came."),
      ],
      next: "map",
    },
    river_again: {
      setting: "river",
      caption: "Evening · beside the Wren",
      beats: [n("You walk the same path and say the day out loud, the good parts and the embarrassing ones. It takes as long as it takes."), t("It still helps to be heard.")],
      next: "map",
    },
    quad: {
      setting: "garden",
      caption: "The Quad",
      beats: [
        n("You lie on the grass with your bag under your head, like everyone else, and watch a frisbee go back and forth for half an hour."),
        t("Nobody needs anything from you. It is a strange feeling, and you let it stay."),
      ],
      next: "map",
    },
    rest_room: {
      setting: "room",
      caption: "Your room, Larch Court",
      beats: [n("You shut the door, put your phone in the desk drawer, and sleep in the afternoon like a child."), t("The week doesn’t fall apart while you aren’t holding it.")],
      next: "map",
    },
  },

  // How the week of the exam turned out. The first one that fits is used.
  endings: [
    {
      id: "owned",
      when: { all: ["owned_up"] },
      title: "Room 214",
      kind: "A changed course",
      setting: "library",
      beats: [
        n("You opened the paper. Then, in the exam hall, with every answer in your head and nobody watching, you put your hand up.", { when: { all: ["hand_up"] } }),
        n("You used the paper, and it worked. Then you wrote four drafts of an email, and sent the one without a “but” in it.", { when: { all: ["cheated"] } }),
        n("You didn’t do it alone. Grace sat beside you while you typed, and never touched the keyboard.", { when: { all: ["cheated", "told_grace"] } }),
        n("Dr. Okonkwo did what she said she would. There was a meeting, and a letter on your file, and you sat a different paper in her office with the door open. She also wrote to the scholarship office: two pages, in your favour."),
        n("You kept your place, narrowly, and on probation. You are not the student who never got it wrong. You are learning to be the one who goes back."),
      ],
      scripture: {
        reference: "Proverbs 28:13",
        translation: WEB,
        text: "He who conceals his sins doesn’t prosper, but whoever confesses and renounces them finds mercy.",
        contextTitle: "In context",
        context: [
          "Proverbs notices how things tend to go. Hiding a wrong takes constant work, and the work is never finished. Mercy is found on the far side of saying it out loud.",
          "Confession is not how you earn God’s welcome. It is how you stop hiding from a welcome that was already there.",
        ],
      },
      questions: ["Is there something you are still spending effort to keep hidden?", "Who is the person you would have to tell, and what makes their door feel so far away?"],
    },
    {
      id: "scold",
      when: { all: ["path_scold"], none: ["made_peace"] },
      title: "Right, and Alone",
      kind: "An unfinished ending",
      setting: "kitchen",
      beats: [
        n("You turned the paper down, and you were right to. You also told Kai he was pathetic, and you have not taken that back."),
        n("He is polite now. He labels his milk. When people on the corridor ask what Christians are like, he has a story, and it is about the night he tried to help a friend."),
        n("Being right about a thing is not the same as being loving in it. But an apology has no expiry date, and his door is four steps from yours."),
      ],
      scripture: {
        reference: "Galatians 6:1",
        translation: WEB,
        text: "Brothers, even if a man is caught in some fault, you who are spiritual must restore such a one in a spirit of gentleness; looking to yourself so that you also aren’t tempted.",
        contextTitle: "In context",
        context: [
          "Paul is telling a church what to do when one of them goes wrong. He assumes they will want to put it right, and tells them how: gently, as people who know they could just as easily be next.",
          "He doesn’t say the fault is unimportant. He says the person matters, and that contempt is a temptation of its own.",
        ],
      },
      questions: ["Have you ever been right in a way that made someone smaller?", "What would it sound like to keep your “no” and lose the contempt?"],
    },
    {
      id: "hidden",
      when: { all: ["cheated"] },
      title: "The Mark You Can’t Enjoy",
      kind: "An unresolved road",
      setting: "room",
      beats: [
        n("Eighty-six. Top of the year. The scholarship office sent a card."),
        n("Your mother has told your aunt. Your aunt has told everyone.", { when: { all: ["masked_mum"] } }),
        n("You find you don’t go to office hours any more. In seminars you are careful not to seem too good at statistics. You have stopped walking by the river, because the river is where you say true things."),
        n("You told Grace, and stopped there. She hasn’t mentioned it since. She still saves you a seat.", { when: { all: ["told_grace"] } }),
        n("Nothing has collapsed. That is the heavy part. But Room 214 still has a chair with a cushion on it, and the door is still propped open."),
      ],
      scripture: {
        reference: "Matthew 11:28",
        translation: WEB,
        text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.",
        contextTitle: "In context",
        context: ["Jesus says this to people worn out by what they are carrying, including what they carry in secret. The invitation is not withdrawn because of what is in the bag."],
      },
      questions: ["What have you got that you can’t enjoy, because of how you got it?", "What would you have to put down in order to rest?"],
    },
    {
      id: "honest",
      when: { any: ["refused", "reported_leak"] },
      title: "An Honest Mark",
      kind: "An honest ending",
      setting: "lecture",
      beats: [
        n("You said no to the paper, out loud, and sat the exam with nothing but what was in your head.", { when: { all: ["refused"] } }),
        n("You never took the paper. You went to Room 214 and told Dr. Okonkwo it was out, which cost you the easiest exam of your life.", { when: { all: ["reported_leak"], none: ["refused"] } }),
        n("It was not painless. For ninety minutes you watched other people’s pens move faster than yours, and did not know what it would cost you."),
        n("You apologised to Kai for the way you said it, and kept what you said. He respects the second more because of the first.", { when: { all: ["made_peace"] } }),
        n("Kai still thinks you are mad. He has also started asking you, before he does something, what you would do. He says it is for research.", { when: { none: ["path_scold"] } }),
        n("Whatever the scholarship office decides, the number on the page is a true account of you. You can stand on it."),
      ],
      scripture: INTEGRITY_WALK,
      questions: ["Where are you tempted to level the field by doing what everyone else is doing?", "What would it be worth to you to have nothing to hide?"],
    },
    {
      id: "undecided",
      title: "The File You Never Opened",
      kind: "A week that ran out",
      setting: "room",
      beats: [
        n("You never opened the paper. You also never quite refused it. It sat on your phone all week, like a door left on the latch.", { when: { all: ["has_paper"] } }),
        n("You asked Kai for time, and the week ran out before you gave him an answer. You sat the exam honestly, more or less by default.", { when: { all: ["stalling"] } }),
        n("All week Kai wanted to show you something, and all week you were somewhere else. You sat the exam honestly, without knowing there was any other way to sit it.", { when: { none: ["did:leak"] } }),
        n("Your mark is your own, and that is not nothing."),
        n("But Kai assumes you used it, like everyone else. You never told him otherwise, so the one person who was watching learned nothing about what you actually believe.", { when: { all: ["did:leak"] } }),
        n("Half the room had seen the paper. You only found out afterwards, from their faces.", { when: { none: ["did:leak"] } }),
        n("The question will come round again. It always does. Next time, you can answer it out loud."),
      ],
      scripture: {
        reference: "Matthew 5:37",
        translation: WEB,
        text: "But let your ‘Yes’ be ‘Yes’ and your ‘No’ be ‘No.’ Whatever is more than these is of the evil one.",
        contextTitle: "In context",
        context: [
          "Jesus is talking about people who hedge: who qualify every promise so that they can never quite be held to it. He asks for something simpler, a yes or a no that means what it says.",
          "He isn’t condemning anyone for needing time. He is offering the relief of having actually decided.",
        ],
      },
      questions: ["Is there a decision you are making by not making it?", "Who is watching to see what you will actually say?"],
    },
  ],

  // Things to keep. Each is earned by how a week went, and collected across weeks.
  keepsakes: [
    { id: "w_pen", icon: "🖊️", name: "The exam pen", when: { all: ["sat_honest"] }, text: "Chewed at one end. Every mark it made was yours." },
    { id: "w_note", icon: "📝", name: "A note from Dr. Okonkwo", when: { all: ["owned_up"] }, text: "“Thank you for coming. That took more than the exam did.”" },
    { id: "w_crane", icon: "🕊️", name: "A paper crane", when: { all: ["did:mei_walk"] }, text: "Folded from a bus ticket. “For the person who asked if I had eaten.”" },
    { id: "w_oil", icon: "🌶️", name: "A jar of Mei’s chilli oil", when: { all: ["met_mei"] }, text: "Her mother posted three. This one had nobody to go to, until you." },
    { id: "w_pancake", icon: "🥞", name: "Kai’s pancake recipe", when: { all: ["did:kai_breakfast"] }, text: "“Step one: lower your expectations.”" },
    { id: "w_sticky", icon: "🚪", name: "A sticky note on your door", when: { all: ["made_peace"] }, text: "“Still think you’re wrong. Pancakes at ten?”" },
    { id: "w_candle", icon: "🕯️", name: "A stub of Lantern candle", when: { any: ["did:lantern", "did:potluck"] }, text: "From the side room where nobody is allowed to say “fine”." },
    { id: "w_voice", icon: "📞", name: "A voice note from Mum", when: { all: ["told_mum_truth"] }, text: "Forty seconds of her kitchen radio, and then: “Eat something that is not bread.”" },
    { id: "w_feather", icon: "🪶", name: "A feather from the Wren", when: { all: ["prayed"] }, text: "Picked up on the unlit path past the boathouse. It marks your place in the Psalms." },
    { id: "w_sheet", icon: "📖", name: "Sunday’s service sheet", when: { all: ["did:service"] }, text: "Handed over by someone wearing gloves indoors." },
    { id: "w_envelope", icon: "✉️", name: "An empty envelope", when: { all: ["returned_cash"] }, text: "It held a hundred and fifty dollars. You gave them back." },
    { id: "w_plan", icon: "✏️", name: "Tobi’s essay plan", when: { all: ["coached"] }, text: "Four boxes and an arrow, in his handwriting. He kept the essay. He gave you this." },
    { id: "w_handout", icon: "🗒️", name: "A seminar handout", when: { all: ["spoke_up"] }, text: "The tutor wrote on it: “Good. Come and argue with me properly.”" },
    { id: "w_blanket", icon: "🥛", name: "A glass of water", when: { all: ["drunk"] }, text: "Left beside you on the bathroom floor. Nobody has ever mentioned it." },
  ],

  // The other strands of the week. Each beat that fits is shown.
  threads: [
    {
      title: "The mark",
      beats: [
        n("Seventy-one. Not top of the year, and entirely yours. You read the number four times.", { when: { all: ["exam_ready"] } }),
        n("Fifty-eight. The scholarship office asked for a meeting. Dr. Okonkwo came to it with you, and did most of the talking. You are on review, not on a plane.", { when: { all: ["exam_hard", "okonkwo_backs"] } }),
        n("Fifty-eight. The scholarship office wants a meeting, and you don’t yet know how it will go. You do know you will be able to look at them when you walk in.", { when: { all: ["exam_hard"], none: ["okonkwo_backs"] } }),
        n("You sat a different paper in Room 214 on Tuesday, with the door open. Sixty-four. There is a note on your file, and beside it a second note, in Dr. Okonkwo’s handwriting.", { when: { all: ["hand_up"] } }),
        n("The eighty-six was struck out. You resat in Room 214 and got sixty-six. It is the lowest mark you have ever been proud of.", { when: { all: ["cheated", "owned_up"] } }),
        n("Eighty-six, in black and white, with your name beside it. You have put the card from the scholarship office in a drawer.", { when: { all: ["cheated"], none: ["owned_up"] } }),
      ],
    },
    {
      title: "Kai",
      beats: [
        n("You went back to Kai’s door and apologised for the contempt, not the conviction. He came out with two forks.", { when: { all: ["made_peace"] } }),
        n("You told Kai to his face that you had reported the paper, and then sat up with him until two. He passed. He tells people you are the most annoying person he has ever lived with, and says it like a compliment.", { when: { all: ["warned_kai"] } }),
        n("Kai walked into a paper he hadn’t revised for, and worked out afterwards who had told. He resits in August. He isn’t angry so much as careful with you now. Telling him first would have cost one hard evening.", { when: { all: ["reported_leak"], none: ["warned_kai"] } }),
        n("Kai asked why, and you told him without a sermon. He hasn’t come to St Aldhelm’s. He has started saying “your lot” with something like fondness.", { when: { all: ["shared_faith"] } }),
        n("On Friday night Kai put a blanket over you and a glass of water by your hand, and never mentioned it. Grace arrived from a direction you weren’t watching.", { when: { all: ["drunk"], none: ["path_scold"] } }),
        n("Kai covered your fees without making you feel small. You are paying him back twenty dollars a week. He keeps forgetting to count it.", { when: { all: ["fees_helped"] } }),
        n("You hardly saw Kai this week. He left you a pancake under a plate on Monday. It was still there on Thursday.", { when: { none: ["did:leak", "did:kai_breakfast", "did:kai_after", "did:party", "did:supper", "fees_helped"] } }),
      ],
    },
    {
      title: "Mei",
      beats: [
        n("Mei gave you a paper crane folded from a bus ticket. She goes home in three weeks, and has asked whether the church with the cold benches does soup on her last Sunday. It does.", { when: { all: ["did:mei_walk"] } }),
        n("At the Lantern’s supper Mei taught four people to fold dumplings. She has been back twice. Nobody has asked her what she believes. She has started asking them.", { when: { all: ["mei_potluck"] } }),
        n("You ate with Mei once, and meant to again. She still waves. One bowl of soup was more than anyone else had offered. There is room for a second.", { when: { all: ["met_mei"], none: ["did:mei_walk", "mei_potluck"] } }),
        n("The exchange student from Larch Court ate on the library stairs this week. You saw her, more than once. She goes home in three weeks.", { when: { none: ["met_mei"] } }),
      ],
    },
    {
      title: "Home and money",
      beats: [
        n("You told your mother the truth. She has stopped praying for “everything wonderful”, and started praying for you.", { when: { all: ["told_mum_truth"] } }),
        n("Your mother thinks you are top of the class and never lonely. She is very proud of someone you invented for her. The real one could ring on Monday.", { when: { all: ["masked_mum"] } }),
        n("Your mother rang on Monday and you let it ring. She left a message, mostly the sound of her kitchen. She will ring next Monday too.", { when: { none: ["did:mum_call"] } }),
        n("You paid the residence fees in full, on the day, with money you had earned at a returns desk.", { when: { all: ["fees_paid"], none: ["ghostwrote"] } }),
        n("You were short, and you went to the accommodation office before they came to you. Half now, half on the first, and no late fee.", { when: { all: ["fees_plan"] } }),
        n("The fees are still unpaid, and there are two red-flagged emails you haven’t opened. They will not be smaller after the exam. Only later.", { when: { all: ["fees_avoided"] } }),
        n("You wrote Tobi’s essay for a hundred and fifty dollars. It came back with a seventy-two and his name on it. He would like another next month.", { when: { all: ["ghostwrote"], none: ["returned_cash"] } }),
        n("You gave Tobi his money back. He has asked for an hour with a pen instead, and turned up for it early.", { when: { all: ["returned_cash"] } }),
        n("You wouldn’t write Tobi’s essay, so you helped him find out that he could. Sixty-one, all his own. It is on his fridge.", { when: { all: ["coached"] } }),
      ],
    },
    {
      title: "The seminar",
      beats: [
        n("In a circle of twelve, you said that you believe, and that it doesn’t make you cleverer than anyone. Two people have stopped you since to ask what you meant.", { when: { all: ["spoke_up"] } }),
        n("You won the argument in Seminar Room B. Nobody in it has asked you a question since.", { when: { all: ["preached"] } }),
        n("Somebody asked whether anyone actually believes, and you looked at your notes. The question will be asked again. They always are.", { when: { all: ["quiet_seminar"] } }),
      ],
    },
    {
      title: "Rest",
      beats: [
        n("You stopped. By the river, on the quad, in a cold pew, or behind your own shut door. The week did not fall apart while you weren’t holding it.", { when: { any: ["prayed", "rested", "did:lantern", "did:service", "did:quad", "did:potluck"] } }),
        n("You never stopped once this week. Everything you did, you did tired. Rest was on the map the whole time; it is allowed.", { when: { none: ["prayed", "rested", "did:lantern", "did:service", "did:quad", "did:potluck"] } }),
      ],
    },
  ],
};
