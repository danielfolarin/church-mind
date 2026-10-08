import type { Beat, Condition, Look, Mood, Scripture, Story } from "../types";

// A Week in Alder Row.
//
// Everything a player reads is in this file. The week has eight time slots.
// In each one the player picks an Opportunity from the map (see
// `opportunities`), which plays a short scene made of the `nodes` below.
//
// Text may use {partner}, {he}, {him}, {his}, {himself}, {He}, {Him}, {His}
// and {money}. Write them as if the partner were a man; they are swapped
// automatically for the other lead. Don't use the player's name ({you}) in
// anything spoken: players can make their own character, and every line is
// recorded in advance.
//
// Scripture quotations are from the World English Bible (public domain).

// Short ways to write the pieces of a scene.
type Extra = { when?: Condition; react?: Record<string, Mood> };
/** Narration. */
const n = (text: string, extra: Extra = {}): Beat => ({ type: "narration", text, ...extra });
/** The player's private thought. */
const t = (text: string, extra: Extra = {}): Beat => ({ type: "thought", text, ...extra });
/** A spoken line, with the speaker's expression. */
const d = (speaker: string, text: string, mood?: Mood, extra: Extra = {}): Beat => ({ type: "dialogue", speaker, text, mood, ...extra });
/** A phone message. */
const m = (speaker: string, text: string, extra: Extra = {}): Beat => ({ type: "message", speaker, text, ...extra });
/** A Scripture reflection. */
const s = (scripture: Scripture, extra: Extra = {}): Beat => ({ type: "scripture", scripture, ...extra });

const WEB = "World English Bible";

// How each person is drawn. See `Look` in ../types.ts for the options.
const NAOMI: Look = { manner: "graceful", build: { height: 0.98, shoulders: 92, hips: 86, limbs: 18 }, stance: "hip", legs: "#2B3A55", shoes: "#E8DCC8", slim: true, skin: "#8E5B3C", shade: "#774A30", hair: "#1D1412", hairStyle: "puff", top: "#2F6F73", topStyle: "collar", accent: "#E8DCC8", lip: "#5A2420", earrings: true };
const CALEB: Look = { manner: "confident", build: { height: 1.04, shoulders: 114, hips: 88, limbs: 22 }, stance: "akimbo", legs: "#2A2F3A", shoes: "#D9D2C4", skin: "#7C4C30", shade: "#663C25", hair: "#17110F", hairStyle: "short", top: "#3F5A7A", topStyle: "hoodie", accent: "#C9D4E0", lip: "#4E211C" };
const MARCUS: Look = { manner: "easy", build: { height: 1.06, shoulders: 106, hips: 84, limbs: 20 }, stance: "pockets", legs: "#6B5A45", shoes: "#3A2A20", eyes: "#4E6A5A", skin: "#D2A27E", shade: "#B98964", hair: "#4A3122", hairStyle: "side", top: "#55704F", topStyle: "collar", accent: "#E8DCC8" };
const ELENA: Look = { manner: "graceful", build: { height: 1, shoulders: 88, hips: 84, limbs: 17 }, stance: "relaxed", skirt: "#5A3A4A", shoes: "#3A2420", slim: true, eyes: "#5A4630", skin: "#DDB092", shade: "#C59676", hair: "#4B2C20", hairStyle: "wavy", top: "#A8553A", lip: "#8A3A32" };
const RUTH: Look = { manner: "calm", build: { height: 0.93, shoulders: 92, hips: 92, limbs: 19 }, stance: "clasped", skirt: "#3F3345", longSkirt: true, shoes: "#2A2020", slim: true, skin: "#6F4631", shade: "#5B3827", hair: "#BDB7B0", hairStyle: "bun", top: "#6B3F5A", topStyle: "cardigan", accent: "#E8DCC8", lip: "#4A1F1C", glasses: true, earrings: true };
const DEV: Look = { manner: "lively", build: { height: 1, shoulders: 108, hips: 86, limbs: 21 }, stance: "wave", legs: "#2A2F3A", shoes: "#E8DCC8", skin: "#AA7750", shade: "#93633F", hair: "#17120F", hairStyle: "curly", top: "#B5673A", topStyle: "hoodie", accent: "#F1DCC0", beard: true };
const DANIEL: Look = { manner: "steady", build: { height: 1.03, shoulders: 116, hips: 94, limbs: 23 }, stance: "book", legs: "#2E2E33", shoes: "#1A1614", skin: "#7A4B31", shade: "#643B25", hair: "#19120F", hairStyle: "short", top: "#2C3E57", topStyle: "collar", accent: "#E8DCC8", lip: "#4C201B", beard: true, glasses: true };
const TOLU: Look = { manner: "warm", build: { height: 0.97, shoulders: 94, hips: 90, limbs: 19 }, stance: "open", legs: "#2F5FA8", wideLegs: true, shoes: "#2A2020", slim: true, skin: "#8A5638", shade: "#72452C", hair: "#1A1210", hairStyle: "bun", top: "#B8862F", topStyle: "cardigan", accent: "#F1E4CC", lip: "#5C2421", earrings: true, glasses: true };
const PRIYA: Look = { manner: "brisk", build: { height: 0.97, shoulders: 90, hips: 82, limbs: 17 }, stance: "cup", legs: "#2A2523", shoes: "#1A1614", slim: true, skin: "#B48158", shade: "#9C6B45", hair: "#1B1412", hairStyle: "long", top: "#E8DCC8", topStyle: "apron", accent: "#2A2523", lip: "#7A2E2C", earrings: true };

const UNEQUALLY_YOKED: Scripture = {
  reference: "2 Corinthians 6:14",
  translation: WEB,
  text: "Don’t be unequally yoked with unbelievers, for what fellowship have righteousness and iniquity? Or what fellowship has light with darkness?",
  contextTitle: "How this speaks to the decision",
  context: [
    "Paul is writing to a church he loves, in a city full of competing loyalties. His picture comes from the farm: two animals joined by one wooden yoke have to pull in the same direction, or the plough goes nowhere and both are worn down.",
    "He is not telling Christians to keep away from people who believe differently. Elsewhere he says plainly that this would mean leaving the world altogether (1 Corinthians 5:9–10). Nor is the verse a verdict on anyone’s worth or kindness.",
    "It is about the partnerships that bind a whole life, and marriage is the closest yoke there is: two people sharing one direction and one set of deepest loyalties. When Jesus is the centre of one life and not the other, both people end up pulling against someone they love.",
  ],
};

const EASY_YOKE: Scripture = {
  reference: "Matthew 11:28–30",
  translation: WEB,
  text: "Come to me, all you who labor and are heavily burdened, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and humble in heart; and you will find rest for your souls. For my yoke is easy, and my burden is light.",
  contextTitle: "In context",
  context: [
    "A yoke is the wooden beam that joins two animals so they pull together. Jesus is not describing a load dropped onto tired people. He is inviting them to walk in step with him, and promising that he is gentle with those who do.",
    "Everything else in a Christian’s week, the work and the money and the people, is carried from inside this partnership.",
  ],
};

const CONFESSION: Scripture = {
  reference: "1 John 1:9",
  translation: WEB,
  text: "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.",
  contextTitle: "In context",
  context: [
    "John is writing to people who already belong to God, not to people trying to get in. Confession here is not grovelling to earn a way back. It is telling the truth to a Father who is already faithful.",
    "Forgiveness is where repair begins. It frees you to make things right with the person you hurt, without needing them to make you feel better.",
  ],
};

const FORGIVING: Scripture = {
  reference: "Colossians 3:13",
  translation: WEB,
  text: "…bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.",
  contextTitle: "In context",
  context: [
    "Paul is writing to an ordinary church full of people who irritate one another. He assumes there will be real complaints.",
    "Forgiveness here is not pretending nothing happened; it often comes with honest words. It is choosing to release what you are owed, because you have been released from far more.",
  ],
};

const BURDENS: Scripture = {
  reference: "Galatians 6:2",
  translation: WEB,
  text: "Bear one another’s burdens, and so fulfill the law of Christ.",
  contextTitle: "In context",
  context: [
    "Paul is describing what a church is for. The “law of Christ” is love, and one of its plainest forms is letting other people carry what is too heavy for you.",
    "Needing help is not a failure of faith. Refusing it can be a quiet kind of pride.",
  ],
};

const READY_ANSWER: Scripture = {
  reference: "1 Peter 3:15",
  translation: WEB,
  text: "But sanctify the Lord God in your hearts; and always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear…",
  contextTitle: "In context",
  context: [
    "Peter is writing to Christians who are a small, misunderstood minority. He doesn’t tell them to win arguments. He assumes people will ask, because of how they live, and that the answer will be given gently.",
    "Priya asked. You answered. What she does with it is hers.",
  ],
};

const ALL_DAYS = ["mon-day", "mon-eve", "thu-day", "thu-eve", "sat-day", "sat-eve", "sun-day", "sun-eve"];
const EVENINGS = ["mon-eve", "thu-eve", "sat-eve", "sun-eve"];
const HARM = ["path_pause", "path_compromise", "path_pressure", "path_text"];

export const alderRowWeek: Story = {
  id: "alder-row-week",
  title: "A Week in Alder Row",
  subtitle: "Eight choices about where to be. Everything else follows.",
  minutes: 15,

  intro: {
    place: "Alder Row",
    paragraphs: [
      "Alder Row is the kind of neighbourhood where people still know each other’s names. There is a community garden behind the old fire hall, a café called Kindling that stays open late, and Great Haven Assembly, the brick church on the corner whose doors are open more days than they are shut.",
      "Not everyone here believes the same things. Most days, that is simply what it means to be neighbours.",
    ],
    playerTraits: [
      "That’s you: 25, three years in Alder Row",
      "Works the counter at Kindling while finishing a course",
      "Part of Great Haven Assembly and Ruth’s Thursday table",
      "Dating {partner} since the spring",
    ],
    partnerTraits: [
      "Teaches Grade 7 science",
      "Runs the garden’s seed library",
      "Kind, curious and honest",
      "Doesn’t share your faith, and has never pretended to",
    ],
    howToPlay:
      "You have one week: four days, each with a morning and an evening. Every time, you choose one place to go. Work pays the rent but wears you out, people need you at the same hour, and some chances don’t come round again.",
  },

  leads: [
    {
      id: "naomi",
      name: "Naomi",
      partner: "Marcus",
      pronouns: { he: "he", him: "him", his: "his", himself: "himself" },
      look: NAOMI,
      partnerLook: MARCUS,
      voice: { kind: "female", variant: 0 },
      partnerVoice: { kind: "male", variant: 1 },
    },
    {
      id: "caleb",
      name: "Caleb",
      partner: "Elena",
      pronouns: { he: "she", him: "her", his: "her", himself: "herself" },
      look: CALEB,
      partnerLook: ELENA,
      voice: { kind: "male", variant: 0, pitch: 0.95 },
      partnerVoice: { kind: "female", variant: 1, pitch: 1.05 },
    },
  ],

  cast: [
    {
      id: "ruth",
      name: "Ruth",
      look: RUTH,
      voice: { kind: "female", variant: 3, pitch: 0.85, rate: 0.9 },
      traits: ["Hosts the Thursday table", "Married to Samuel for thirty-one years", "Asks better questions than she gives answers"],
    },
    {
      id: "dev",
      name: "Dev",
      look: DEV,
      voice: { kind: "male", variant: 2, pitch: 1.1, rate: 1.03 },
      traits: ["Your closest friend at Great Haven", "Works shifts at the warehouse", "Loyal and funny", "Sure that things tend to work out"],
    },
    {
      id: "priya",
      name: "Priya",
      look: PRIYA,
      voice: { kind: "female", variant: 4, pitch: 1.08 },
      traits: ["Owns Kindling, which makes her your boss", "Not religious", "Tells the truth as if it were a form of affection"],
    },
    {
      id: "daniel",
      name: "Pastor Daniel",
      look: DANIEL,
      voice: { kind: "male", variant: 3, pitch: 0.9, rate: 0.95 },
      traits: ["Leads Great Haven Assembly with his wife, Tolu", "Preaches plainly", "Remembers everyone’s name"],
    },
    {
      id: "tolu",
      name: "Pastor Tolu",
      look: TOLU,
      voice: { kind: "female", variant: 5, pitch: 1 },
      traits: ["Leads Great Haven alongside Daniel", "Asks how you really are", "Waits for the real answer"],
    },
  ],

  narrator: { kind: "female", variant: 2, pitch: 0.95, rate: 0.95 },

  qualityNotes: {
    wisdom: "You went looking for voices wiser than your own, and let them slow you down.",
    integrity: "You let your words and your life say the same thing.",
    compassion: "You held other people’s dignity carefully, even when it cost you.",
    courage: "You said and did the hard thing instead of waiting for it to pass.",
    trust: "You brought God the real thing rather than a tidy version of it.",
  },

  start: { money: 250, energy: 3, bond: 2, place: "home" },

  slots: [
    { id: "mon-day", day: "Monday", time: "Morning" },
    { id: "mon-eve", day: "Monday", time: "Evening" },
    { id: "thu-day", day: "Thursday", time: "Morning" },
    { id: "thu-eve", day: "Thursday", time: "Evening" },
    { id: "sat-day", day: "Saturday", time: "Morning" },
    { id: "sat-eve", day: "Saturday", time: "Evening" },
    { id: "sun-day", day: "Sunday", time: "Morning" },
    { id: "sun-eve", day: "Sunday", time: "Evening" },
  ],

  places: {
    church: { name: "Great Haven Assembly", x: 19, y: 22, icon: "chapel", at: "west" },
    ruth: { name: "Ruth’s House", x: 55, y: 20, icon: "table", at: "north" },
    devs: { name: "Dev’s Flat", x: 86, y: 20, icon: "door", at: "east" },
    cafe: { name: "Kindling Café", x: 29, y: 49, icon: "cup", at: "mid" },
    home: { name: "Home", x: 64, y: 51, icon: "home", at: "lane" },
    garden: { name: "Community Garden", x: 17, y: 77, icon: "leaf", at: "green" },
    river: { name: "River Path", x: 66, y: 86, icon: "water", at: "bank" },
  },

  // The streets of Alder Row. People walk from junction to junction.
  roads: {
    junctions: {
      w0: [0, 37], west: [19, 36], cross: [41, 35], north: [55, 34.5], top: [76, 33], east: [86, 32.5], e0: [100, 32],
      n0: [41, 0], mid: [41, 49], square: [41, 63], s0: [39, 100],
      t0: [76, 0], lane: [64, 64.5], corner: [73, 65], bank: [66, 82], b0: [62, 100],
      l0: [0, 63], green: [17, 63], r0: [100, 67],
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
    { id: "question", key: true, place: "garden", slots: ["mon-eve", "thu-eve", "sat-eve"], with: ["partner"], title: "{partner} asked to talk", blurb: "“Come by the garden after work? There’s something I want to ask you.”", energy: -1, scene: "garden" },
    { id: "table", key: true, place: "ruth", slots: ["thu-eve"], with: ["ruth"], title: "The Thursday table at Ruth’s", blurb: "Soup, eight chairs, and people who ask how you really are.", energy: 1, bond: { ruth: 1 }, scene: "table" },
    { id: "soup", key: true, place: "home", slots: ["sat-day"], with: ["ruth"], when: { none: ["did:table"] }, title: "Ruth is at your door", blurb: "She’s holding a pot wrapped in a tea towel.", bond: { ruth: 1 }, scene: "soup" },
    { id: "conversation", key: true, place: "river", slots: ["sat-eve"], with: ["partner"], when: { all: ["did:question"] }, title: "Meet {partner} at the river", blurb: "{He} wants to show you an apartment listing. You owe {him} an answer.", energy: -1, scene: "talk" },
    { id: "service_guest", key: true, place: "church", slots: ["sun-day"], with: ["partner"], when: { all: ["path_pressure"] }, title: "Sunday service, with {partner}", blurb: "{He} said {he} would come, and {he} will.", energy: 1, scene: "service_guest" },
    { id: "repair", key: true, place: "garden", slots: ["sun-eve"], with: ["partner"], when: { any: HARM, none: ["repaired"] }, title: "Go to {partner} and make it right", blurb: "No excuses. Just the truth you should have started with.", grow: { courage: 1, compassion: 1 }, scene: "repair" },
    { id: "counsel", key: true, place: "ruth", slots: ["sun-eve"], with: ["ruth"], when: { any: HARM, none: ["repaired"] }, title: "Ask Ruth to help you see it straight", blurb: "Then go and do what needs doing.", grow: { wisdom: 1 }, scene: "counsel_again" },

    // Work
    { id: "shift_mon", place: "cafe", slots: ["mon-day"], with: ["priya"], title: "Work the morning shift", blurb: "Priya is short-staffed, and rent is due on Saturday.", money: 90, energy: -2, scene: "shift_till" },
    { id: "shift_thu", place: "cafe", slots: ["thu-day"], with: ["priya"], title: "Work the morning shift", blurb: "The 9:15 rush waits for no one.", money: 90, energy: -2, scene: "shift_customer" },
    { id: "cover", tempt: "money", place: "cafe", slots: ["sat-day"], with: ["priya"], when: { all: ["asked_cover"] }, title: "Cover the Saturday shift", blurb: "Priya asked on Thursday. It’s the same morning as Dev’s move.", money: 90, energy: -2, scene: "cover_shift" },
    { id: "priya_coffee", place: "cafe", slots: ["sun-day"], with: ["priya"], when: { bond: { priya: 2 } }, title: "Coffee with Priya", blurb: "It’s her day off. She asked if you’d come by.", scene: "priya_coffee" },
    { id: "priya_confess", place: "cafe", slots: ["sun-eve"], with: ["priya"], when: { all: ["pocketed"], none: ["confessed"] }, title: "Take the forty dollars back to Priya", blurb: "It has got heavier every day.", grow: { integrity: 1, courage: 1 }, scene: "priya_confess" },

    // Friends
    { id: "dev_ask", place: "cafe", slots: ["mon-eve"], with: ["dev"], title: "Meet Dev at Kindling", blurb: "His text just says: “Got a minute tonight? Need to ask you something.”", scene: "dev_ask" },
    { id: "breakfast", place: "cafe", slots: ["thu-day"], with: ["dev", "priya"], when: { all: ["did:question"] }, title: "Late breakfast with Dev", blurb: "He’s buying. Priya will have opinions.", bond: { dev: 1 }, scene: "cafe_talk" },
    { id: "dev_move", place: "devs", slots: ["sat-day"], with: ["dev"], title: "Help Dev move", blurb: "Third floor, no lift, and the van is only free this morning.", energy: -2, bond: { dev: 1 }, scene: "dev_move" },
    { id: "dev_door", place: "devs", slots: ["sun-eve"], with: ["dev"], when: { none: ["dev_good"] }, title: "Knock on Dev’s door", blurb: "You weren’t the friend he needed this week.", grow: { courage: 1 }, bond: { dev: 1 }, scene: "dev_door" },

    // {partner}
    { id: "seed_morning", place: "garden", slots: ["mon-day"], with: ["partner"], title: "Help {partner} at the seed library", blurb: "{He} has forty envelopes to label and would love the company.", bond: { partner: 1 }, scene: "seed_morning" },
    { id: "film", place: "garden", slots: ["thu-eve"], with: ["partner"], title: "Film night with {partner}", blurb: "{He} got two tickets. It’s the same night as Ruth’s.", money: -30, bond: { partner: 1 }, flags: ["drifted"], scene: "film_night" },
    { id: "text_exit", tempt: "ease", place: "home", slots: ["sat-eve"], when: { all: ["did:question"] }, title: "End it with {partner} by message", blurb: "Face to face would hurt too much.", flags: ["path_text"], scene: "text_exit" },

    // Sunday
    { id: "pastors", place: "church", slots: ["thu-day", "sat-day"], with: ["daniel", "tolu"], title: "Drop in on the pastors", blurb: "The church office door is open, and the kettle is usually on.", scene: "pastors_office" },
    { id: "service", place: "church", slots: ["sun-day"], with: ["daniel", "tolu", "dev"], when: { none: ["path_pressure"] }, title: "Sunday service", blurb: "The doors are open and the coffee is terrible.", energy: 1, scene: "service" },
    { id: "supper", place: "ruth", slots: ["sun-eve"], with: ["ruth"], when: { none: HARM }, title: "Sunday supper at Ruth’s", blurb: "Whoever turns up, and whatever is in the oven.", energy: 1, bond: { ruth: 1 }, scene: "supper" },

    // Always there
    { id: "pray_first", place: "river", slots: EVENINGS, when: { none: ["prayed"] }, title: "Walk the river path and pray", blurb: "No agenda. Just tell God the truth.", energy: 1, grow: { trust: 1 }, flags: ["prayed"], scene: "river_first" },
    { id: "pray_again", repeatable: true, place: "river", slots: EVENINGS, when: { all: ["prayed"] }, title: "Walk the river path and pray", blurb: "Bring the day with you and set it down.", energy: 1, scene: "river_again" },
    { id: "plot", repeatable: true, place: "garden", slots: ["thu-day", "sat-day"], title: "Tend your own plot", blurb: "Four square metres of chard and good intentions.", energy: 1, scene: "plot" },
    { id: "rest", repeatable: true, place: "home", slots: ALL_DAYS, title: "Rest at home", blurb: "Do nothing useful for a few hours. On purpose.", energy: 2, flags: ["rested"], scene: "rest_home" },

    // These happen by themselves
    { id: "rent", auto: true, place: "home", slots: ["sat-day"], title: "Rent day", blurb: "", scene: "rent_day" },
    { id: "reckoning", auto: true, place: "home", slots: ["sun-eve"], when: { any: ["path_pause", "path_compromise"], none: ["repaired"] }, title: "A message from {partner}", blurb: "", scene: "reckoning" },
    { id: "reckoning_church", auto: true, place: "home", slots: ["sun-eve"], when: { all: ["path_pressure"], none: ["did:service_guest", "repaired"] }, title: "A message from {partner}", blurb: "", scene: "reckoning" },
  ],

  nodes: {
    // ——— Work: Kindling ———
    shift_till: {
      setting: "cafe",
      caption: "Monday morning · Kindling Café",
      onStage: ["priya"],
      beats: [
        n("Monday at Kindling is all regulars and one coach party. Priya works the machine; you work the till. By noon your feet ache and the tip jar is respectable.", { react: { priya: "warm" } }),
        n("At close-out, the drawer is forty dollars over. You count it twice. A tourist in the rush, probably: a fifty for a ten-dollar order, gone before her change."),
        n("Priya is out the back with the delivery. Nobody is watching the drawer but you.", { react: { you: "thoughtful" } }),
        t("Rent is $380 on Saturday. You have {money}."),
      ],
      prompt: "What do you do with the forty?",
      choices: [
        { id: "report", label: "Put it in an envelope and tell Priya.", grow: { integrity: 1 }, bond: { priya: 1 }, flags: ["reported"], next: "till_report" },
        { id: "pocket", tempt: "money", label: "Pocket it. Nobody will ever know.", money: 40, flags: ["pocketed"], next: "till_pocket" },
        { id: "leave", label: "Shut the drawer and say nothing.", flags: ["left_till"], next: "till_leave" },
      ],
    },
    till_report: {
      setting: "cafe",
      caption: "Monday morning · Kindling Café",
      beats: [
        d("priya", "You could have kept that, you know. I’d never have noticed.", "thoughtful"),
        d("you", "I’d have noticed."),
        d("priya", "Hm. I’ll hang on to it in case she comes back. If she hasn’t by Friday, it goes in the jar for the Okafors’ fire fund.", "warm"),
        n("She writes the date on the envelope. It is a small thing. It doesn’t feel small."),
      ],
      next: "map",
    },
    till_pocket: {
      setting: "cafe",
      caption: "Monday morning · Kindling Café",
      beats: [
        n("The notes are in your pocket before you have finished deciding. It is only forty dollars. It is also most of the gap between you and Saturday."),
        d("priya", "All balance?"),
        d("you", "All balanced."),
        t("Two words, and neither of them true. You hadn’t expected it to feel like a stone in your shoe.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    till_leave: {
      setting: "cafe",
      caption: "Monday morning · Kindling Café",
      onStage: [],
      beats: [
        n("You shut the drawer. Not yours to take, and not your problem to solve. Priya will find it when she does the books, and wonder."),
        t("It isn’t dishonest, exactly. It isn’t quite honest either."),
      ],
      next: "map",
    },

    shift_customer: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      onStage: ["priya"],
      beats: [
        d("priya", "Odd thing. That tourist from Monday came back for her change. Forty dollars. The drawer balanced that night, so I paid her out of my own pocket.", "thoughtful", { when: { all: ["pocketed"] } }),
        t("You could tell her now. The moment sits there. Then the door opens, and it passes.", { when: { all: ["pocketed"] }, react: { you: "worried" } }),
        d("priya", "Your tourist came back for her forty, by the way. Nearly cried. I told her to thank you.", "warm", { when: { all: ["reported"] } }),
        n("Then the 9:15 rush. A man in a grey coat sends his flat white back twice, and the third time he doesn’t bother to lower his voice."),
        n("“Is it difficult? Is the job difficult for you?” The queue goes silent. Your face is hot.", { react: { you: "hurt", priya: "worried" } }),
      ],
      prompt: "How do you answer him?",
      choices: [
        { id: "kind", label: "Remake it yourself, and ask if he’s having a rough morning.", grow: { compassion: 1 }, flags: ["kind_customer"], next: "customer_kind" },
        { id: "snap", tempt: "ease", label: "Give it back to him exactly as hard as he gave it.", flags: ["snapped"], bond: { priya: -1 }, next: "customer_snap" },
        { id: "cold", label: "Say nothing. Remake it. Seethe.", next: "customer_cold" },
      ],
    },
    customer_kind: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      onStage: ["priya"],
      beats: [
        n("You make the third one slowly, the way Priya taught you, and bring it round the counter yourself."),
        d("you", "That one’s on me. Rough morning?", "warm"),
        n("He stares at the cup. Then his shoulders come down an inch."),
        n("“My wife’s in the General. Third week.” He says it to the coffee. “Sorry. You didn’t deserve that.”", { react: { you: "sad", priya: "thoughtful" } }),
      ],
      next: "priya_asks",
    },
    customer_snap: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      beats: [
        d("you", "It’s difficult when someone’s determined to be miserable about it, yes."),
        n("A couple of people in the queue laugh. The man goes white, then red, then leaves without the coffee. Priya comes round the counter fast."),
        d("priya", "Hey. I don’t care if he started it. Not in my shop.", "hurt"),
        t("You were right about him. It didn’t feel like winning.", { react: { you: "sad" } }),
      ],
      next: "shift_end",
    },
    customer_cold: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      onStage: ["priya"],
      beats: [
        n("You remake it without a word and slide it across without looking up. He takes it without a word. Nobody has behaved badly. Nobody is any better for it."),
        t("You carry him around in your chest for the rest of the shift, composing the things you should have said.", { react: { you: "hurt" } }),
      ],
      next: "shift_end",
    },
    priya_asks: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      beats: [
        d("priya", "How do you do that? I’d have thrown the milk jug at him.", "thoughtful"),
        d("priya", "Is that the church thing? Go on. I’m actually asking.", "warm"),
      ],
      prompt: "What do you tell her?",
      choices: [
        { id: "share", label: "Tell her the truth, plainly, without a sales pitch.", grow: { courage: 1 }, flags: ["shared_faith", "shared_thursday"], bond: { priya: 1 }, next: "priya_share" },
        { id: "deflect", label: "“Honestly? I was just too tired to fight.”", next: "priya_deflect" },
      ],
    },
    priya_share: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      beats: [
        d("you", "Partly, yes. I believe I’ve been treated a great deal better than I deserve. It’s hard to hold on to that and still be stingy with a stranger. I manage it about half the time."),
        d("priya", "Huh.", "thoughtful"),
        d("priya", "That’s the first time anyone has explained it to me without trying to recruit me.", "warm"),
        s(READY_ANSWER),
      ],
      next: "shift_end",
    },
    priya_deflect: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      beats: [
        d("you", "Honestly? I was just too tired to fight."),
        d("priya", "Fair enough."),
        t("It wasn’t a lie. It also wasn’t the answer. She asked a real question and you handed her a shrug.", { react: { you: "thoughtful" } }),
      ],
      next: "shift_end",
    },
    shift_end: {
      setting: "cafe",
      caption: "Thursday, noon · Kindling Café",
      effects: { flags: ["asked_cover"] },
      beats: [
        d("priya", "Before you go. I’m stuck for Saturday morning. Any chance you could cover? Same rate."),
        n("You tell her you’ll see how the week goes. Saturday morning is also when Dev is moving."),
      ],
      next: "map",
    },
    cover_shift: {
      setting: "cafe",
      caption: "Saturday morning · Kindling Café",
      beats: [
        n("Saturday at Kindling is prams, cyclists and a hen party that orders eleven oat lattes. You don’t sit down for four hours."),
        d("priya", "You’re a lifesaver. Envelope’s by the till.", "warm"),
        n("Your phone buzzes on the shelf: a photo from Dev of a fern on a staircase, captioned “made it”. You hadn’t forgotten. You had chosen."),
        t("Ninety dollars. It will help. So would you have, on that staircase.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    priya_coffee: {
      setting: "cafe",
      caption: "Sunday morning · Kindling Café",
      beats: [
        n("Kindling is closed on Sundays. Priya lets you in the back way and makes the coffee herself, slowly, the way she never has time to on a shift.", { react: { priya: "warm" } }),
        t("The forty dollars has been in your pocket since Monday. It has got heavier every day.", { when: { all: ["pocketed"], none: ["confessed"] }, react: { you: "worried" } }),
        d("priya", "So. You vanish every Thursday and every Sunday and come back looking as if someone has taken a rucksack off you. I’m not after converting. I’m nosy. What actually happens?", "thoughtful"),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "confess", when: { all: ["pocketed"], none: ["confessed"] }, label: "“Before that, I have to give you something back.”", grow: { integrity: 1, courage: 1 }, next: "priya_confessed" },
        { id: "share", label: "Answer her honestly: what you find there, and what you don’t.", grow: { courage: 1 }, flags: ["shared_faith"], bond: { priya: 1 }, next: "coffee_share" },
        { id: "light", label: "Keep it light. “Free soup, mostly.”", next: "coffee_light" },
      ],
    },
    coffee_share: {
      setting: "cafe",
      caption: "Sunday morning · Kindling Café",
      beats: [
        d("you", "People who know the worst of me and set a place for me anyway. And an hour when I’m not the centre of my own life. I think that’s most of it."),
        d("you", "I believe God is like that table, only more so. I don’t always feel it. I keep going back."),
        d("priya", "I’m not there. I don’t know that I ever will be.", "thoughtful"),
        d("priya", "But I like that you didn’t sell it to me. Bring me some of the soup sometime.", "warm"),
        s(READY_ANSWER, { when: { none: ["shared_thursday"] } }),
      ],
      next: "map",
    },
    coffee_light: {
      setting: "cafe",
      caption: "Sunday morning · Kindling Café",
      beats: [
        d("you", "Free soup, mostly."),
        d("priya", "Mm. All right."),
        n("She lets it go, and tells you about her sister’s wedding instead. It is a nice morning. You notice that she asked a real question, and that you were the one who made it small.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    priya_confess: {
      setting: "cafe",
      caption: "Sunday evening · the flat above Kindling",
      beats: [
        n("Priya lives above the shop. You stand on the landing long enough that she opens the door before you have knocked.", { react: { priya: "thoughtful", you: "worried" } }),
        d("priya", "You look like someone who’s come to hand in their notice."),
      ],
      next: "priya_confessed",
    },
    priya_confessed: {
      setting: "cafe",
      caption: "Kindling Café",
      effects: { flags: ["confessed"], payUpTo: 40 },
      beats: [
        d("you", "The drawer was forty over on Monday. I took it, and I told you it balanced. You paid that woman out of your own pocket because of me. Here. I’m sorry.", "sad"),
        n("Priya looks at the notes for a while without picking them up.", { react: { priya: "hurt" } }),
        d("priya", "I’d wondered. I didn’t want to have wondered.", "sad"),
        d("priya", "I’m not going to pretend that’s nothing. But you came back with it when you didn’t have to, and that isn’t nothing either. Don’t do it again.", "thoughtful"),
        s(CONFESSION),
        t("She hasn’t said it’s all right. She has said the door is still open. You’ll take it.", { react: { you: "sad" } }),
      ],
      next: "map",
    },

    // ——— Friendship: Dev ———
    dev_ask: {
      setting: "cafe",
      caption: "Monday evening · Kindling Café",
      beats: [
        n("Dev has taken the corner table and hasn’t touched his drink. He is the funniest person you know, and tonight he isn’t trying.", { react: { dev: "worried" } }),
        d("dev", "They’ve cut my hours at the warehouse. Again. And my landlord’s putting the rent up, so I’ve found a cheaper room across town.", "worried"),
        d("dev", "I can cover most of it. I’m a hundred short on the deposit, and it’s due Friday. I get paid the Friday after. I hate asking.", "sad"),
        t("You have {money}. Your own rent is $380, on Saturday.", { react: { you: "worried" } }),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "lend", when: { minMoney: 100 }, label: "Lend him the $100.", money: -100, flags: ["lent"], bond: { dev: 1 }, grow: { compassion: 1 }, next: "dev_lent" },
        { id: "honest", label: "Tell him honestly that you can’t, and offer to help him move.", flags: ["declined_kindly"], grow: { integrity: 1 }, next: "dev_declined" },
        { id: "dodge", tempt: "ease", label: "Say you’ll see what you can do, and change the subject.", flags: ["dodged"], bond: { dev: -1 }, next: "dev_dodged" },
      ],
    },
    dev_lent: {
      setting: "cafe",
      caption: "Monday evening · Kindling Café",
      beats: [
        n("You send it before you can do the arithmetic on your own week."),
        d("dev", "Friday after next. Every cent. I mean it.", "warm"),
        n("He looks ten years younger. You walk home lighter and poorer, doing sums.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    dev_declined: {
      setting: "cafe",
      caption: "Monday evening · Kindling Café",
      beats: [
        d("you", "I can’t, Dev. I’m short for my own rent, and I’m not going to promise money I don’t have. But I’ve got a back and two arms. When’s the move?"),
        d("dev", "Saturday morning. Third floor, no lift."),
        d("dev", "Honestly? Thanks for just saying it. Everyone else has said “let me see” and vanished.", "warm"),
      ],
      next: "map",
    },
    dev_dodged: {
      setting: "cafe",
      caption: "Monday evening · Kindling Café",
      beats: [
        d("you", "Let me see what I can do. Anyway, did you watch the match?"),
        n("He lets you change the subject, because he is kind. You both know what “let me see” means.", { react: { dev: "sad" } }),
      ],
      next: "map",
    },
    cafe_talk: {
      setting: "cafe",
      caption: "Thursday morning · Kindling Café",
      beats: [
        n("Dev orders the full breakfast and eats half of yours. Priya leans on the counter between customers, listening in without apology."),
        n("You tell them about the garden: the question, and the time you asked for.", { when: { all: ["honest_start"] } }),
        n("You tell them about the garden: the question, and the yes you gave before you had finished thinking.", { when: { all: ["easy_yes"] } }),
        n("You tell them about the garden: the question, and the answer you gave. You hear how it sounds as you repeat it.", { when: { all: ["downplayed"] } }),
        d("dev", "Honestly? I think people make this harder than it is. My mum was the only Christian in our house for eight years. Then Dad came to faith, and now he runs the men’s breakfast. God isn’t boxed in by who you date.", "warm"),
        d("priya", "I’m not religious, so tell me if I’m out of my lane. But I’ve watched you talk about your faith, and you don’t talk about it like a hobby. Does {partner} know it’s the middle of everything? Because if I were {him}, I’d want to know that before I built my plans around you.", "thoughtful"),
        d("dev", "That’s a bit heavy for a Thursday, Priya.", "worried"),
        d("priya", "Kind and heavy aren’t opposites.", "warm"),
        t("They are both your friends. They are not saying the same thing. Tonight is the Thursday table at Ruth’s. {partner} has also mentioned a film."),
      ],
      next: "map",
    },
    dev_move: {
      setting: "room",
      caption: "Saturday morning · Dev’s flat",
      onStage: ["dev"],
      beats: [
        n("Third floor, no lift. Dev’s whole life fits into eleven boxes, a mattress and a fern he has kept alive for six years. By the fourth trip your shirt is stuck to your back.", { react: { dev: "warm" } }),
        n("He was surprised to find you at the door. After Monday, he hadn’t expected you.", { when: { all: ["dodged"] } }),
        d("you", "I’m sorry about Monday. “Let me see” was a coward’s no. You deserved a straight answer.", "sad", { when: { all: ["dodged"] } }),
        d("dev", "Yeah. It was. But you’re here carrying my fern, so.", "warm", { when: { all: ["dodged"] } }),
      ],
      next: [{ when: { all: ["lent"] }, to: "dev_debt" }, { to: "dev_move_end" }],
    },
    dev_move_end: {
      setting: "room",
      caption: "Saturday, noon · Dev’s new room",
      effects: { flags: ["dev_good"] },
      beats: [
        d("dev", "I didn’t know who’d show up today. Turns out it was you. I won’t forget that.", "warm"),
        n("You eat chips on the floor of the new room, sitting on boxes. It is smaller and darker than the old place. With two people laughing in it, it will do.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    dev_debt: {
      setting: "room",
      caption: "Saturday morning · the stairs at Dev’s",
      beats: [
        n("On the last trip he stops on the landing and can’t quite look at you.", { react: { dev: "sad" } }),
        d("dev", "About the hundred. I’m not going to have it next Friday. They cut another shift. I should have told you on Wednesday when I found out, and I didn’t, because I couldn’t face it.", "sad"),
        t("You needed that money this week. And he let you find out on a staircase.", { react: { you: "hurt" } }),
      ],
      prompt: "What do you do with that?",
      choices: [
        { id: "talk", label: "Tell him it hurt, and that you’d rather have the truth than be avoided.", grow: { courage: 1 }, bond: { dev: 1 }, flags: ["dev_talk", "dev_good"], next: "dev_talk" },
        { id: "release", label: "Tell him it’s a gift now. He doesn’t owe you.", grow: { compassion: 1 }, bond: { dev: 1 }, flags: ["forgave_debt", "dev_good"], next: "dev_release" },
        { id: "resent", tempt: "ease", label: "Say “it’s fine” and carry the next box in silence.", flags: ["resent"], bond: { dev: -1 }, next: "dev_resent" },
      ],
    },
    dev_talk: {
      setting: "room",
      caption: "Saturday morning · the stairs at Dev’s",
      beats: [
        d("you", "The money I can live without for a while. Being dodged, I can’t. Next time, tell me the day you know. I’d rather be disappointed than managed."),
        d("dev", "That’s fair. That’s completely fair. I’m sorry.", "sad"),
        d("dev", "Twenty a week, starting the Friday I’m paid. I’ll write it down so you never have to chase me.", "warm"),
        n("It isn’t solved. It is honest, and the friendship is still standing in the middle of it.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    dev_release: {
      setting: "room",
      caption: "Saturday morning · the stairs at Dev’s",
      beats: [
        d("you", "Then it isn’t a loan any more. It’s a gift. I mean it. You don’t owe me, and you don’t have to be strange around me.", "warm"),
        n("Dev puts the fern down very carefully and stands there with his hand over his eyes."),
        d("dev", "You can’t afford that.", "sad"),
        d("you", "Probably not. I’m doing it anyway."),
        t("Forgiving a debt costs exactly what the debt was. That is how you know it’s real.", { react: { you: "warm", dev: "warm" } }),
      ],
      next: "map",
    },
    dev_resent: {
      setting: "room",
      caption: "Saturday morning · the stairs at Dev’s",
      beats: [
        d("you", "It’s fine."),
        n("It isn’t, and he knows it isn’t. You carry the last three boxes without talking. Each one is heavier than it has any right to be.", { react: { dev: "sad" } }),
        t("You have kept the right to be owed. It is not as satisfying as it looked.", { react: { you: "hurt" } }),
      ],
      next: "map",
    },
    dev_door: {
      setting: "room",
      caption: "Sunday evening · Dev’s new place",
      effects: { flags: ["dev_good", "dev_repaired"] },
      beats: [
        n("The new building smells of someone else’s cooking. Dev opens the door in odd socks, surprised.", { react: { dev: "thoughtful", you: "worried" } }),
        d("you", "I told you it was fine yesterday. It wasn’t, and I made you pay for it in silence instead of saying so. I’m sorry.", "sad", { when: { all: ["resent"] } }),
        d("you", "I’ve been a poor friend this week. You needed people and I was busy. I’m sorry. I brought biscuits.", "sad", { when: { none: ["resent"] } }),
        d("dev", "I’m not going to say it didn’t sting.", "sad"),
        d("dev", "But you came up three flights to say that, so get in. The kettle is the only thing I’ve unpacked.", "warm", { react: { you: "warm" } }),
      ],
      next: "map",
    },

    // ——— {partner}: the question ———
    seed_morning: {
      setting: "garden",
      caption: "Monday morning · Alder Row Community Garden",
      onStage: ["partner"],
      beats: [
        n("The seed library is a filing cabinet in the potting shed. {partner} labels envelopes in careful block capitals; you sort beans from peas and get it wrong twice.", { react: { partner: "warm", you: "warm" } }),
        d("partner", "Borlotti. Those are borlotti. I’m revoking your sorting privileges.", "warm"),
        n("{He} tells you about the Grade 7 who asked whether seeds are alive or just waiting, and how {he} had to admit {he} wasn’t sure there was a difference."),
        d("partner", "I like that about them. Everything they’ll ever be is already in there. All they need is somewhere to land.", "thoughtful"),
        t("You could stay in this shed for a year. {He} is the easiest person to be around that you have ever met."),
      ],
      next: "map",
    },
    garden: {
      setting: "garden",
      caption: "Early evening · Alder Row Community Garden",
      beats: [
        n("The last of the light is caught in the bean poles. You and {partner} have been tying up tomato vines for an hour, working down the same row from opposite ends, the way you always seem to end up doing."),
        n("Three months of dating. Before that, half a year of Saturday mornings here, trading seedlings and bad jokes."),
        d("partner", "My lease is up in the spring. I’ve been thinking about what comes next.", "thoughtful"),
        d("partner", "And I keep noticing that whatever I picture, you’re in it. So I suppose I’m asking: are we heading somewhere? Somewhere serious?", "warm"),
        d("partner", "I know your faith matters to you. I’ve never wanted to get in the way of that.", "warm"),
        t("You want to say yes. You also know there is a sentence you have never quite said out loud to {him}."),
      ],
      prompt: "How do you answer?",
      choices: [
        { id: "honest", label: "“I care about you. And there’s something I need to be honest about.”", grow: { integrity: 1, courage: 1 }, flags: ["honest_start"], next: "garden_honest" },
        { id: "yes", label: "“Yes. Let’s not overthink it.”", flags: ["easy_yes"], bond: { partner: 1 }, next: "garden_yes" },
        { id: "downplay", label: "“Church is just one part of my life. It won’t be a problem.”", flags: ["downplayed"], bond: { partner: 1 }, next: "garden_downplay" },
      ],
    },
    garden_honest: {
      setting: "garden",
      caption: "Early evening · Alder Row Community Garden",
      beats: [
        d("you", "My faith isn’t one part of my life, exactly. It’s more like the ground everything else is standing on. And I don’t know yet what that means for the two of us. Could I have a little time to think? And to pray?", "worried", { react: { partner: "thoughtful" } }),
        n("{partner} is quiet for a moment. A sprinkler ticks somewhere behind you.", { react: { partner: "sad" } }),
        d("partner", "That’s not the answer I was hoping for. But it’s a real one. Take the time. I’d rather have the truth slowly than something easy tonight.", "warm"),
        n("You walk home with your chest tight and your conscience strangely clear.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    garden_yes: {
      setting: "garden",
      caption: "Early evening · Alder Row Community Garden",
      beats: [
        d("you", "Yes. I think we are. Let’s not overthink it.", "warm"),
        n("{His} whole face opens. {He} laughs, and you laugh, and for the length of the walk home everything is simple.", { react: { partner: "warm" } }),
        n("It is only later, brushing your teeth, that you notice the unfinished sentence is still there, exactly where you left it.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    garden_downplay: {
      setting: "garden",
      caption: "Early evening · Alder Row Community Garden",
      beats: [
        d("you", "Honestly? Church is just one part of my life. It won’t be a problem for us.", undefined, { react: { partner: "worried" } }),
        n("You watch relief move across {his} face.", { react: { partner: "warm" } }),
        d("partner", "Okay. Good. I didn’t want to be the thing that came between you and something you love.", "warm"),
        n("You squeeze {his} hand. Somewhere under your ribs, something small goes quiet, like a lamp being turned down in another room.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    film_night: {
      setting: "garden",
      caption: "Thursday evening · film night at the garden",
      beats: [
        n("Someone has hung a bedsheet between the bean poles and borrowed a projector. {partner} has brought a blanket and far too much popcorn.", { react: { partner: "warm", you: "warm" } }),
        d("partner", "Isn’t Thursday your thing at Ruth’s? I don’t want to pull you away from it.", "thoughtful"),
        d("you", "It’s fine. They won’t miss me for one week."),
        n("The film is terrible and you love it. {He} laughs with {his} whole body. Walking home, you realise you haven’t thought about anything difficult for three hours.", { react: { partner: "warm" } }),
        t("It was a good night. It was also, a little, a hiding place."),
      ],
      next: "map",
    },

    // ——— Ruth: counsel ———
    table: {
      setting: "kitchen",
      caption: "Thursday evening · Ruth’s kitchen",
      beats: [
        n("Ruth’s kitchen smells of ginger and something baking. Eight chairs, nine people, and Samuel carving bread as if it were a sacrament. For an hour nobody asks you to be impressive.", { react: { ruth: "warm", you: "warm" } }),
        n("Afterwards the others drift to the front room. Ruth washes while you dry, and does the thing she always does, which is wait."),
        n("So you tell her about {partner}, and the question in the garden.", { when: { all: ["did:question"] }, react: { you: "worried" } }),
        n("So you tell her about {partner}: how serious it is getting, and the conversation you can feel coming.", { when: { none: ["did:question"] }, react: { you: "worried" } }),
        d("ruth", "Thank you for trusting me with that. I’m not going to hurry you, and I’m not going to hand you a rule and send you home.", "warm"),
      ],
      next: "yoke",
    },
    soup: {
      setting: "room",
      caption: "Saturday morning · your front door",
      onStage: [],
      beats: [
        n("It has been surprisingly easy, this week, not to think about something."),
        n("Then there is a knock, and Ruth is standing in the hallway holding a pot wrapped in a tea towel."),
        d("ruth", "We missed you on Thursday. I’m not here to chase you. I’m just here to notice. And I made too much soup.", "warm", { react: { you: "worried" } }),
        n("You let her in. Over two bowls, in pieces, it comes out: {partner}, how serious it is getting, and how carefully you have been not thinking about it.", { react: { you: "sad" } }),
      ],
      next: "yoke",
    },
    yoke: {
      setting: "kitchen",
      caption: "At the kitchen table",
      beats: [
        d("ruth", "Tell me about {him} first. Not the problem. The person.", "warm"),
        n("You do. It takes a while, and you are smiling by the end of it.", { react: { you: "warm" } }),
        d("ruth", "{He} sounds like someone worth loving. I’m saying that first so you’ll know that nothing I say next is against {him}.", "warm"),
        d("ruth", "There’s a line of Paul’s that people throw at each other like a stone. I’d rather hand it to you like bread. May I?", "thoughtful"),
        s(UNEQUALLY_YOKED, { react: { you: "thoughtful", ruth: "neutral" } }),
        d("ruth", "Samuel and I have pulled the same plough for thirty-one years, and it has still been hard. I can’t imagine doing it facing different ways. That isn’t a rule I’m reciting. It’s something I know in my shoulders.", "warm"),
      ],
      prompt: "What rises in you?",
      choices: [
        { id: "unfair", label: "“That feels unfair. {partner} is kinder than half the people at church.”", grow: { compassion: 1 }, next: "yoke_unfair" },
        { id: "afraid", label: "“I think I already knew. I’ve been afraid of losing {him}.”", grow: { integrity: 1, trust: 1 }, next: "yoke_afraid" },
        { id: "hope", label: "“But what if {he} comes to faith? Couldn’t I be the reason?”", grow: { wisdom: 1 }, next: "yoke_hope" },
      ],
    },
    yoke_unfair: {
      setting: "kitchen",
      caption: "At the kitchen table",
      beats: [
        d("ruth", "{He} might well be. I wouldn’t argue it. This was never about who the better person is. If it were, I’d have been unfit for Samuel on most Tuesdays.", "warm", { react: { you: "hurt" } }),
        d("ruth", "It’s about direction. Following Jesus isn’t your hobby; it’s your road. {partner} is on a road too, and an honest one by the sound of it. The question isn’t which of you is good. It’s whether two people can share one life while walking toward different things.", "thoughtful"),
        d("ruth", "And be angry about it if you need to. God can take your honesty. He would rather have that than your manners.", "warm", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    yoke_afraid: {
      setting: "kitchen",
      caption: "At the kitchen table",
      beats: [
        n("It is out before you can tidy it.", { react: { you: "sad" } }),
        d("ruth", "Of course you are. You love {him}. Fear of loss is what love feels like when it’s holding something it might have to open its hand on.", "warm"),
        d("ruth", "But notice who you’ve been protecting. If you hide the centre of yourself to keep {him}, then the person {he} is keeping isn’t quite you. That isn’t fair to either of you.", "thoughtful"),
        d("ruth", "Jesus doesn’t ask you to stop loving {partner}. He asks you to love {him} truthfully.", "warm", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    yoke_hope: {
      setting: "kitchen",
      caption: "At the kitchen table",
      beats: [
        d("ruth", "I hope {he} does meet Jesus. I’ll pray for that with you, gladly.", "warm", { react: { you: "worried" } }),
        d("ruth", "Dev’s father did, you know, after eight years. That story is true and I thank God for it. But ask Dev’s mother sometime what those eight years were like. Grace that comes afterwards is a gift. It isn’t a plan.", "thoughtful"),
        d("ruth", "And think about it from {partner}’s side. If you date {him} toward a conversion, {he} becomes a project. {He} would never be sure whether you love {him}, or the person you are hoping {he} will turn into. {He} deserves better than that. So do you.", "thoughtful", { react: { you: "sad" } }),
        d("ruth", "Share your faith with {him} freely, as a friend, with no strings. Just don’t make {his} answer the price of your love.", "warm", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },

    // ——— {partner}: the answer ———
    talk: {
      setting: "river",
      caption: "Saturday, dusk · the river path",
      beats: [
        n("You walk as far as the footbridge. {partner} has an apartment listing open on {his} phone: two bedrooms, ten minutes from yours.", { react: { partner: "warm", you: "worried" } }),
        d("partner", "I asked you in the garden, and it has been sitting there all week. I’m not rushing you. But I’d like to know where we’re going before I sign something.", "thoughtful"),
        t("At least {he} knows something is unresolved. You told {him} that much.", { when: { all: ["honest_start"] } }),
        t("You remember the yes you gave in the garden, and how quickly you gave it.", { when: { all: ["easy_yes"] } }),
        t("You remember what you told {him}: just one part of my life. You wince.", { when: { all: ["downplayed"] } }),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "truth", label: "Tell {him} the whole truth.", grow: { courage: 1 }, next: "talk_truth" },
        { id: "compromise", tempt: "ease", label: "Suggest you keep going, and keep your faith out of it.", flags: ["path_compromise"], next: "talk_compromise" },
        { id: "pressure", label: "Ask {him} to come to church tomorrow. Maybe {he}’ll come round.", flags: ["path_pressure"], next: "talk_pressure" },
      ],
    },
    talk_truth: {
      setting: "river",
      caption: "Saturday, dusk · the river path",
      beats: [
        n("You ask {him} to put the phone away for a minute, and {he} does, and looks at you, and waits."),
        t("Your heart is going hard. You pray one word, help, and find that you can begin.", { when: { min: { trust: 1 } } }),
        t("Your heart is going hard. You almost turn it into small talk. Then you begin anyway.", { when: { max: { trust: 0 } } }),
        d("you", "I have to tell you something true, and I’m scared to, because I don’t want to lose you. My faith isn’t one part of my life. Jesus is the centre of it: who I am, what I’m for, how I’d want to raise children, what I’d do with money and Sundays and suffering. I can’t build a marriage where that isn’t shared. And I can’t ask you to pretend.", "worried", { react: { partner: "worried" } }),
        d("partner", "I wondered if this was where the thinking would land. I’m glad you told me in the garden that something was unresolved. I’d have hated to be blindsided.", "sad", { when: { all: ["honest_start"] } }),
        d("partner", "You said yes. In the garden. I asked, and you said yes.", "hurt", { when: { all: ["easy_yes"] } }),
        d("you", "I did. I said it before I had let myself think, because I wanted it to be simple. I’m sorry. You deserved a slower, truer answer.", "sad", { when: { all: ["easy_yes"] } }),
        d("partner", "In the garden you told me it was just one part of your life.", "hurt", { when: { all: ["downplayed"] } }),
        d("you", "I know. That wasn’t true, and I knew it wasn’t when I said it. I was afraid, so I made it small. I’m sorry. You made plans on the strength of that.", "sad", { when: { all: ["downplayed"] } }),
        d("partner", "Can I say my side? I don’t believe what you believe. I’ve tried the idea on, honestly, and it doesn’t fit. Not now, maybe not ever. And I’m not willing to fake it to keep you. You’d know, and I’d know.", "thoughtful"),
        d("you", "I’d never want you to fake it. That’s part of why I love you.", "warm"),
        d("partner", "It still feels like being told I’m not enough.", "hurt"),
        t("This is the moment that matters. How you answer now is what {he} will carry."),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "clear", label: "“You are not less. This is about where I’m going, not what you’re worth.”", grow: { compassion: 1, integrity: 1 }, flags: ["told_truth"], next: "truth_clear" },
        { id: "pause", tempt: "ease", label: "“Maybe we don’t have to decide. Let’s just call it a pause.”", flags: ["path_pause"], next: "truth_pause" },
      ],
    },
    truth_clear: {
      setting: "river",
      caption: "Saturday, dusk · the river path",
      beats: [
        d("you", "You are not less. You are one of the best people I know, and that isn’t changing. This isn’t about your worth. It’s about where I’m going. I’m following Jesus with my whole life, and you would be walking beside someone who is always pulling toward something you don’t want. You deserve a person who is all the way in with you. Not someone quietly waiting for you to change.", "sad", { react: { partner: "hurt" } }),
        n("{partner}’s eyes are wet. So are yours. Neither of you pretends otherwise.", { react: { partner: "sad", you: "sad" } }),
        d("partner", "I think I hate that this makes sense. I don’t agree with what you believe. But I’d rather lose you to something you actually believe than keep half of you.", "sad"),
        d("you", "Thank you for being someone it’s this hard to say goodbye to.", "warm", { react: { partner: "warm" } }),
        n("You stand on the bridge a while longer. It isn’t fixed. It is clean."),
      ],
      next: "map",
    },
    truth_pause: {
      setting: "river",
      caption: "Saturday, dusk · the river path",
      beats: [
        d("you", "Maybe we don’t have to decide tonight. Let’s just call it a pause. See how things are in a while.", "worried", { react: { partner: "hurt" } }),
        n("It is so much easier to say. {partner}’s shoulders drop with relief, and so do yours.", { react: { partner: "warm" } }),
        d("partner", "A pause. Okay. I can do a pause.", "warm"),
        n("Walking home, you tell yourself it was the kind thing. But you saw {his} face, and you know what {he} heard: wait for me.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    talk_compromise: {
      setting: "river",
      caption: "Saturday, dusk · the river path",
      beats: [
        d("you", "I’ve been thinking. What if my faith is just mine? I’ll do Sundays, you do your thing, and we don’t make it a subject.", "worried", { react: { partner: "thoughtful" } }),
        d("partner", "Are you sure? I don’t want you to shrink for me.", "worried"),
        d("you", "I’m sure."),
        n("{He} kisses your forehead and says {he}’ll ring the agent on Monday. Everything is settled. You walk home wondering why settled feels so much like quiet.", { react: { partner: "warm", you: "thoughtful" } }),
      ],
      next: "map",
    },
    talk_pressure: {
      setting: "river",
      caption: "Saturday, dusk · the river path",
      beats: [
        d("you", "Before you sign anything, would you come to church with me tomorrow? Just once. I think if you saw it, you might feel differently.", "worried"),
        d("partner", "Sure. If it matters to you, of course I’ll come.", "warm"),
        n("{He} means it generously. You are already planning where to sit, which songs {he}’ll like, and who ought to talk to {him} afterwards."),
        t("You haven’t told {him} what you’re hoping for. You notice that, and keep walking."),
      ],
      next: "map",
    },
    text_exit: {
      setting: "room",
      caption: "Saturday, 11:40 p.m. · your apartment",
      beats: [
        n("You write it four times. The version you send is short, because short felt safer.", { react: { you: "worried" } }),
        m("you", "I can’t do this anymore. We believe different things and it’s never going to work. 2 Corinthians 6:14. I’m sorry. Please don’t call."),
        n("You turn the phone face down. The right decision, you tell yourself. Done cleanly. The reply comes at one in the morning."),
        m("partner", "Most of a year, and I get a paragraph and a Bible reference. I looked it up. Am I the darkness in this one?"),
        m("partner", "I’d have listened, you know. If you’d told me to my face that you couldn’t build a life with someone who doesn’t share your faith, I’d have been sad and I’d have understood. This just makes me feel like something you had to wash off."),
        t("The decision may have been right. The way you did it was not. Both things are true.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    service_guest: {
      setting: "hall",
      caption: "Sunday morning · Great Haven Assembly",
      onStage: ["partner"],
      beats: [
        n("{partner} comes, because you asked and {he} is generous. {He} shakes every hand, sings none of the songs, and listens to the sermon more carefully than you do.", { react: { partner: "thoughtful" } }),
        n("Pastor Daniel shakes {his} hand at the door and asks about {his} Grade 7s. Pastor Tolu finds {him} a seat. Neither of them asks what {he} believes."),
        n("You spend the hour watching {his} face instead of listening. You nudge {him} at the good lines. Afterwards you steer Ruth towards {him}, then Dev, and mention twice that the Thursday group has room.", { react: { you: "worried" } }),
        n("On the steps outside, {he} stops."),
        d("partner", "Can I ask you something, and will you tell me the truth? Am I a person to you this morning, or a prayer request?", "hurt"),
        d("partner", "I came because I wanted to understand what you love. I didn’t realise I was sitting an exam. If I never believe it, is there still an us? I think I deserved to know that before I walked in.", "hurt"),
        t("You wanted so badly for {him} to know Jesus that you stopped treating {him} the way Jesus treats people.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    reckoning: {
      setting: "room",
      caption: "Sunday evening · your apartment",
      beats: [
        m("partner", "Is this a pause, or a no you haven’t said yet? I can take either one. I just can’t keep standing in the doorway.", { when: { all: ["path_pause"] } }),
        n("You went to church alone this morning and came home with nothing you were allowed to talk about. {partner} asked how it was. You said, “Fine.”", { when: { all: ["path_compromise"] } }),
        m("partner", "I keep thinking about “fine.” Is there a room in you I’m not allowed in? I don’t need to believe what’s in there. I just didn’t think it would be locked.", { when: { all: ["path_compromise"] } }),
        n("You never did make it to church this morning. {partner} did. {He} went because {he} had said {he} would.", { when: { all: ["path_pressure"] } }),
        m("partner", "I sat through the whole thing on my own. Three people told me how glad you’d be. Was I a person to you this weekend, or a prayer request?", { when: { all: ["path_pressure"] } }),
        n("You sit on the edge of your bed with the phone in your hand. There is no undoing it. But there is still tonight, and it is yours to choose.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    counsel_again: {
      setting: "kitchen",
      caption: "Sunday evening · Ruth’s kitchen",
      effects: { flags: ["counsel_again"] },
      beats: [
        n("You tell her all of it, and you don’t make yourself sound better than you were. She pours the tea before she answers.", { react: { you: "sad", ruth: "thoughtful" } }),
        d("ruth", "Well. You did a wrong thing. You are not a wrong thing. Those are different, and the gospel lives in the difference.", "warm"),
        s(CONFESSION),
        d("ruth", "God’s forgiveness you can have before the kettle cools. {partner}’s is {his} to give, in {his} own time, and you mustn’t demand it. An apology isn’t a transaction. You go, you tell the truth, you name what you did without the word “but”, and you let {him} feel however {he} feels.", "thoughtful"),
        d("ruth", "And I’ll be praying the whole time. Go now, while it’s light.", "warm", { react: { you: "warm" } }),
      ],
      next: "repair",
    },
    repair: {
      setting: "garden",
      caption: "Sunday evening · Alder Row Community Garden",
      effects: { flags: ["repaired"] },
      beats: [
        n("You ask {partner} for half an hour, somewhere {he} chooses. {He} picks the garden. The beds you have worked side by side are quiet tonight.", { react: { you: "worried", partner: "sad" } }),
        d("you", "I’m not here to explain myself. I’m here to say I’m sorry, and to say what for.", "sad"),
        t("No “but”, Ruth said. You keep to it.", { when: { all: ["counsel_again"] } }),
        d("you", "I ended things by message because I was afraid of your face. And I threw a verse at you like a door slamming. You are not darkness. You were owed a conversation, and I gave you a verdict.", "sad", { when: { all: ["path_text"] } }),
        d("you", "I invited you to church with an agenda and didn’t tell you. I turned you into something to fix. You came in good faith and I was keeping score. That was wrong, and it isn’t how the God I believe in treats anyone.", "sad", { when: { all: ["path_pressure"] } }),
        d("you", "I told you I could keep my faith out of it. I can’t, and part of me knew that. So I locked a room and let you think the door was your fault. It wasn’t. It was mine.", "sad", { when: { all: ["path_compromise"] } }),
        d("you", "I called it a pause because I couldn’t bear to say the true thing. I left you waiting in a doorway so I wouldn’t have to watch you be hurt. That was me protecting myself, not you.", "sad", { when: { all: ["path_pause"] } }),
        d("you", "Here is the whole truth, the one I should have started with. Jesus is the centre of my life, and I can’t build a marriage where that isn’t shared. That is about my road, not about your worth. You are one of the best people I know.", "worried"),
        n("{partner} doesn’t answer straight away. {He} pulls a dead leaf off a vine and turns it over.", { react: { partner: "thoughtful" } }),
        d("partner", "That’s the first time in a while I’ve felt you were actually talking to me. I’m still hurt. I’m going to be hurt for a bit, and I don’t want you to rush me through it.", "sad"),
        d("you", "I won’t. You don’t owe me being okay.", "warm"),
        d("partner", "I don’t believe what you believe. But I think I can respect it, now that you’ve finally let me see it.", "warm"),
      ],
      next: "map",
    },

    // ——— Faith and rest ———
    river_first: {
      setting: "river",
      caption: "The river path",
      beats: [
        n("You take the long way, along the river. Somewhere past the footbridge you stop composing a prayer and simply start talking."),
        t("I don’t know what I’m doing this week. I’m tired, and I’m trying to be everything to everyone. Here it is. All of it.", { react: { you: "sad" } }),
        n("No voice answers. The water keeps moving. But a line you have heard a hundred times arrives differently tonight."),
        s(EASY_YOKE),
        n("You are already joined to someone, you realise. Everything else this week gets worked out from inside that, not around it.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    river_again: {
      setting: "river",
      caption: "The river path",
      beats: [
        n("The same path, the same water. You bring the day with you and set it down piece by piece: what you’re glad of, what you’re ashamed of, what you still don’t know."),
        n("You don’t walk home with answers. You walk home accompanied.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    plot: {
      setting: "garden",
      caption: "Your plot · Alder Row Community Garden",
      beats: [
        n("Your own plot is four square metres of chard and good intentions. You weed until your thoughts slow down to the speed of your hands."),
        n("A robin supervises from the fence. Nothing here is in a hurry. It is strangely hard to stay anxious around things that grow at their own pace.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    rest_home: {
      setting: "room",
      caption: "At home",
      beats: [
        n("You put your phone in a drawer, make tea you actually finish, and sleep with the window open."),
        t("Rest isn’t a reward for finishing. The work was never going to be finished.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    service: {
      setting: "hall",
      caption: "Sunday morning · Great Haven Assembly",
      beats: [
        n("The doors are open and the coffee is terrible, as it should be. You find a seat near the back. Two rows ahead, Dev is singing too loudly. Across the aisle, Ruth catches your eye and doesn’t make anything of it.", { react: { tolu: "warm", daniel: "warm" } }),
        d("tolu", "Our reading is from Paul’s letter to the Colossians. You have heard it before. Listen as if you hadn’t.", "warm"),
        s(FORGIVING, { react: { you: "thoughtful" } }),
        d("daniel", "Notice that Paul doesn’t say “if anyone ever has a complaint.” He assumes you will. Some of you are sitting three seats from yours.", "thoughtful"),
        d("daniel", "I’m not going to tell you forgiving is easy, or that it means pretending. I’m going to tell you that you have been forgiven more than you will ever be asked to forgive. Start there, and see what you can afford.", "warm"),
        t("You think of who owes you. Then, less comfortably, of who you owe."),
      ],
      next: [{ when: { none: ["dev_good"] }, to: "service_dev" }, { to: "service_end" }],
    },
    service_dev: {
      setting: "hall",
      caption: "Sunday morning · the doors of Great Haven",
      onStage: ["dev"],
      beats: [n("By the door, Dev is putting his coat on. He hasn’t seen you yet.", { react: { you: "worried" } })],
      prompt: "Do you go to him?",
      choices: [
        { id: "go", label: "Catch him before he leaves.", grow: { courage: 1 }, bond: { dev: 1 }, flags: ["dev_good", "dev_repaired"], next: "service_dev_go" },
        { id: "slip", label: "Slip out by the side door.", next: "service_end" },
      ],
    },
    service_dev_go: {
      setting: "hall",
      caption: "Sunday morning · the doors of Great Haven",
      beats: [
        d("you", "Dev. Wait."),
        d("you", "I said “it’s fine” yesterday and it wasn’t true. I was angry, and I punished you with silence. I’m sorry. Can we talk about it properly?", "sad", { when: { all: ["resent"] } }),
        d("you", "I wasn’t there for you this week, and I should have been. I’m sorry. No excuse. How’s the new place?", "sad", { when: { none: ["resent"] } }),
        d("dev", "You know what, I’ve been sat in there for an hour trying to work out how to say something to you.", "thoughtful"),
        d("dev", "Come and see the room. It’s terrible. Bring biscuits.", "warm", { react: { you: "warm" } }),
      ],
      next: "service_end",
    },
    service_end: {
      setting: "hall",
      caption: "Sunday morning · Great Haven Assembly",
      onStage: [],
      beats: [n("Outside, the morning has turned bright. You feel rested in a way sleep hadn’t managed.", { react: { you: "warm" } })],
      next: "map",
    },
    supper: {
      setting: "kitchen",
      caption: "Sunday evening · Ruth’s kitchen",
      beats: [
        n("Sunday supper is whoever turns up. Tonight it is seven people, one casserole, and a pudding that has collapsed in the middle and is all the better for it.", { react: { ruth: "warm" } }),
        d("ruth", "Now. Round the table. One thing from this week you’re glad of, and one you’d do differently. You start.", "warm"),
        n("You tell them. All of it, more or less. Nobody gasps and nobody applauds. Samuel passes you the custard."),
        t("It still hurts. It hurts less in a room like this.", { when: { all: ["told_truth"] }, react: { you: "warm" } }),
        t("This is what you would want anyone to see of your faith, you think. Not an argument. A table.", { when: { none: ["told_truth"] }, react: { you: "warm" } }),
      ],
      next: "map",
    },

    // ——— Great Haven: the pastors ———
    pastors_office: {
      setting: "hall",
      caption: "The church office · Great Haven Assembly",
      onStage: ["tolu", "daniel"],
      beats: [
        n("The church office is a converted vestry with a kettle, two mismatched armchairs, and a whiteboard nobody has wiped since Easter. Pastor Tolu waves you in before you have finished knocking.", { react: { tolu: "warm", daniel: "warm" } }),
        d("tolu", "Sit. Daniel, biscuits. Now. The real answer, not the Sunday one: how are you?", "warm"),
        t("They have known you for three years. They would know if you dressed it up."),
      ],
      prompt: "What do you bring them?",
      choices: [
        { id: "money", label: "The money. Rent is due, and you are stretched thin.", grow: { wisdom: 1 }, flags: ["pastor_money"], bond: { daniel: 1 }, next: "pastors_money" },
        { id: "love", label: "{partner}, and the question you can’t stop turning over.", grow: { wisdom: 1 }, flags: ["pastor_love"], bond: { tolu: 1 }, next: "pastors_love" },
        { id: "fine", label: "“I’m fine. Just busy.”", next: "pastors_fine" },
      ],
    },
    pastors_money: {
      setting: "hall",
      caption: "The church office · Great Haven Assembly",
      onStage: ["tolu", "daniel"],
      beats: [
        d("daniel", "Can I tell you what I got wrong for years? I thought needing help meant I had failed at trusting God. So I hid it, and it grew in the dark.", "thoughtful"),
        d("daniel", "If Saturday comes and you’re short, ring your landlord before he rings you. Most people are kinder to the truth than to silence. Then ring us. This church keeps a fund for exactly that, and nobody keeps a list.", "warm"),
        d("tolu", "And work your shifts, but don’t work yourself hollow. You are not what stands between this neighbourhood and collapse. That job is taken.", "warm", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    pastors_love: {
      setting: "hall",
      caption: "The church office · Great Haven Assembly",
      onStage: ["tolu", "daniel"],
      beats: [
        d("tolu", "Ruth will tell you more than I could, and better. So I’ll only say what I wish someone had said to me at your age.", "thoughtful"),
        d("tolu", "Whatever you decide, don’t decide it in hiding. The decisions that hurt people most are usually the ones made alone at midnight and delivered by surprise.", "warm"),
        d("daniel", "And {partner} is welcome here, whatever happens between you. Not as a project. As a neighbour. We’d want {him} to know that.", "warm"),
        t("You hadn’t realised how much you needed to hear that last part.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    pastors_fine: {
      setting: "hall",
      caption: "The church office · Great Haven Assembly",
      onStage: ["tolu", "daniel"],
      beats: [
        d("you", "I’m fine. Just busy."),
        d("tolu", "All right. You’re allowed to be fine."),
        d("daniel", "You’re also allowed not to be. The kettle is on most mornings.", "warm"),
        n("They talk about the roof fund and the youth weekend, and let you leave with your answer intact. On the steps you wonder why you guarded it so carefully.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },

    // ——— Money: rent ———
    rent_day: {
      setting: "room",
      caption: "Saturday morning · your apartment",
      beats: [n("Saturday. The rent reminder is on your phone before you are properly awake: $380, due today.", { react: { you: "worried" } })],
      next: [{ when: { minMoney: 380 }, to: "rent_paid" }, { to: "rent_short" }],
    },
    rent_paid: {
      setting: "room",
      caption: "Saturday morning · your apartment",
      effects: { money: -380, flags: ["rent_paid"] },
      beats: [
        n("You send it, and watch the number in your account drop to almost nothing. It is a very particular kind of relief, being paid up and nearly broke."),
        t("{money} to last until payday. But the roof is yours for another month.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    rent_short: {
      setting: "room",
      caption: "Saturday morning · your apartment",
      beats: [
        n("You have {money}. You do the sum three different ways, and it comes out short each time."),
        t("A hundred of it is with Dev. You don’t regret that. You do have to deal with this.", { when: { all: ["lent"] } }),
        t("Ring your landlord before he rings you, Pastor Daniel said. Most people are kinder to the truth than to silence.", { when: { all: ["pastor_money"] } }),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "grace", label: "Ring the landlord, tell him the truth, and ask for a week.", grow: { integrity: 1, courage: 1 }, flags: ["rent_grace"], next: "rent_grace" },
        { id: "help", when: { any: ["did:table", "did:soup"] }, label: "Message Ruth, and let the Thursday table help.", grow: { trust: 1 }, flags: ["rent_helped"], next: "rent_helped" },
        { id: "avoid", tempt: "ease", label: "Silence the reminder. Deal with it on Monday.", flags: ["rent_avoided"], next: "rent_avoided" },
      ],
    },
    rent_grace: {
      setting: "room",
      caption: "Saturday morning · your apartment",
      beats: [
        n("Mr. Abara picks up on the second ring. You don’t dress it up: you’re short, you’ll have it by next Saturday, you’re sorry."),
        n("A long pause. “You’re the first tenant this year who has rung me before I had to ring them. Next Saturday. No fee.”"),
        t("Telling the truth early was cheaper than you expected. It usually is.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    rent_helped: {
      setting: "room",
      caption: "Saturday morning · your apartment",
      effects: { payUpTo: 380 },
      beats: [
        m("you", "Ruth, I’m embarrassed to ask. I’m short on rent this month."),
        m("ruth", "Then don’t be embarrassed. There’s an envelope in the biscuit tin for exactly this. Half of us have needed it. Samuel will drop it round within the hour."),
        s(BURDENS),
        n("You pay what you have, and the tin covers the rest. It is harder to receive than it would have been to give. You say thank you, and decide to let that be enough.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    rent_avoided: {
      setting: "room",
      caption: "Saturday morning · your apartment",
      beats: [
        n("You swipe the reminder away. And the next one. By lunchtime there is a voicemail you don’t play."),
        t("The rent hasn’t gone anywhere. It is just somewhere you aren’t looking."),
      ],
      next: "map",
    },
  },

  // How the week with {partner} turned out. The first one that fits is used.
  endings: [
    {
      id: "repair",
      when: { all: ["repaired"] },
      title: "The Long Way Back",
      kind: "A changed course",
      setting: "garden",
      beats: [
        n("You took a wrong turn with {partner} this week, and then you turned around. You went back to the person you hurt, named what you did without excuses, and told the truth you should have begun with."),
        n("You didn’t do it alone. Ruth helped you see straight, then let you walk the last stretch yourself.", { when: { all: ["counsel_again"] } }),
        n("{partner} did not forgive you on the spot, and you didn’t ask {him} to. A month later {he} sent a short message: Thank you for coming back to say it properly. It mattered."),
        n("The relationship ended. The harm did not get the last word. You are not the person who never gets it wrong. You are learning to be the person who goes back."),
      ],
      scripture: {
        reference: "Luke 15:20",
        translation: WEB,
        text: "He arose, and came to his father. But while he was still far off, his father saw him, and was moved with compassion, and ran, and fell on his neck, and kissed him.",
        contextTitle: "In context",
        context: [
          "Jesus tells this story about a son who walks home rehearsing a bargain. The father doesn’t wait for the speech. Turning back is not how you earn God’s welcome. It is how you discover the welcome was already running toward you.",
        ],
      },
      questions: ["Is there someone you owe an apology with no “but” in it?", "What makes going back feel harder than it really is?"],
    },
    {
      id: "truth",
      when: { all: ["told_truth"] },
      title: "Truth, Spoken in Love",
      kind: "An honest ending",
      setting: "river",
      beats: [
        n("You told {partner} the truth to {his} face, and you did not make {him} smaller in order to do it. It cost you both something real."),
        n("Weeks later you pass {him} at the garden. It is awkward, and then it is all right. {He} hands you a packet of seeds {he} saved for you, and you both get back to work, a few rows apart."),
        n("You still think about the answer you gave in the garden at the start of the week. It is a quiet teacher now, not a wound. Next time, you will say the true thing sooner.", { when: { any: ["easy_yes", "downplayed"] } }),
      ],
      scripture: {
        reference: "Ephesians 4:15",
        translation: WEB,
        text: "…but speaking truth in love, we may grow up in all things into him, who is the head, Christ.",
        contextTitle: "In context",
        context: [
          "Paul pairs truth and love because each needs the other. Truth without love wounds; love without truth abandons. Growing up into Christ looks like holding both at once.",
        ],
      },
      questions: [
        "Where in your own life is there a true sentence you have been leaving unfinished?",
        "What would it look like to be honest and tender in the same conversation this week?",
      ],
    },
    {
      id: "divided",
      when: { any: ["path_compromise", "path_pause"] },
      title: "Two Directions",
      kind: "An unresolved road",
      setting: "room",
      beats: [
        n("You stayed with {partner}, and you kept the door to that room closed. Nobody shouted. Nothing collapsed. {He} is still kind, and Saturdays are still good.", { when: { all: ["path_compromise"] } }),
        n("The pause never quite ended, and never quite became anything else. {partner} stopped asking. You told yourself that was peace.", { when: { all: ["path_pause"] } }),
        n("In the months that follow you notice the cost in small places. You pray less, because prayer keeps raising the subject. You miss more Thursdays. And {partner} carries it too: {he} is still waiting to be let all the way in."),
        n("Two good people, pulling gently in different directions, both a little more tired than they were."),
        n("This is not the end of your story. The door you closed isn’t locked from the outside. Whenever you turn around, you will find you are already welcome."),
      ],
      scripture: {
        reference: "Matthew 11:28",
        translation: WEB,
        text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.",
        contextTitle: "In context",
        context: ["Jesus says this to tired people, not to people who have everything sorted. The invitation doesn’t expire because you have been avoiding it."],
      },
      questions: [
        "Is there a part of your life you have stopped bringing to God because it keeps raising a subject?",
        "Who is sending you a “no agenda” invitation right now?",
      ],
    },
    {
      id: "unrepaired",
      when: { any: ["path_pressure", "path_text"] },
      title: "The Unsent Apology",
      kind: "An unfinished ending",
      setting: "cafe",
      beats: [
        n("It is over with {partner}. You may even have been right that it needed to end. But {he} is left holding a paragraph and a verse, and the story {he} now tells about Christians has your message in it.", { when: { all: ["path_text"] } }),
        n("{partner} stopped calling. You told people it just didn’t work out. {He} tells it differently: that {he} was welcome for as long as {he} was changing.", { when: { all: ["path_pressure"] } }),
        n("You have noticed that you cross the street when you pass the garden. Priya says, not unkindly, “You know {he} still asks how you are.”"),
        n("Being right about a decision is not the same as being loving in it. But an apology has no expiry date, and neither does grace. The next step is still there, whenever you are ready to take it."),
      ],
      scripture: {
        reference: "Matthew 5:23–24",
        translation: WEB,
        text: "If therefore you are offering your gift at the altar, and there remember that your brother has anything against you, leave your gift there before the altar, and go your way. First be reconciled to your brother, and then come and offer your gift.",
        contextTitle: "In context",
        context: [
          "Jesus treats mending a relationship as urgent enough to interrupt worship. He isn’t shaming the worshipper. He is saying that the person you hurt matters to God that much, and so does your freedom.",
        ],
      },
      questions: ["Have you ever been right in a way that left someone wounded?", "What would the first sentence of your apology be?"],
    },
    {
      id: "open",
      title: "The Question Still Open",
      kind: "A week that ran out",
      setting: "garden",
      beats: [
        n("{partner} asked you a question at the start of the week, and the week ended without an answer. There was always something else that needed you first.", { when: { all: ["did:question"] } }),
        n("All week {partner} wanted to ask you something, and all week you were somewhere else. {He} hasn’t given up. {He} has started to wonder.", { when: { none: ["did:question"] } }),
        n("Nothing has broken. But an unanswered question does not stay the same size. It is still waiting for you, and so is {he}."),
        n("Next week has mornings and evenings in it too. You get to choose again."),
      ],
      scripture: {
        reference: "James 1:5",
        translation: WEB,
        text: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.",
        contextTitle: "In context",
        context: [
          "James is writing to people under pressure who don’t know what to do next. He doesn’t tell them to work it out alone or to wait until they feel ready. He tells them to ask, and promises that God gives without scolding them for needing to.",
        ],
      },
      questions: ["What conversation have you been too busy to have?", "What would it take to make room for it this week?"],
    },
  ],

  // Things to keep. Each is earned by how a week went, and collected across weeks.
  keepsakes: [
    { id: "seeds", icon: "🌱", name: "A packet of saved seeds", when: { all: ["told_truth"] }, text: "{partner} saved these for you. You parted honestly, and {he} still thought of you." },
    { id: "note", icon: "💬", name: "A message from {partner}", when: { all: ["repaired"] }, text: "“Thank you for coming back to say it properly. It mattered.”" },
    { id: "recipe", icon: "🍲", name: "Ruth’s soup recipe", when: { any: ["did:table", "did:soup"] }, text: "On the back of an envelope, in her handwriting. “Serves eight. Make extra.”" },
    { id: "fern", icon: "🪴", name: "A cutting from Dev’s fern", when: { all: ["did:dev_move"] }, text: "Six years old and still going. He says you have earned a piece of it." },
    { id: "iou", icon: "🤝", name: "A torn-up IOU", when: { all: ["forgave_debt"] }, text: "A hundred dollars you turned into a gift." },
    { id: "knock", icon: "🚪", name: "Dev’s spare key", when: { all: ["dev_repaired"] }, text: "You let him down, then went and said so. He gave you a key anyway." },
    { id: "envelope", icon: "✉️", name: "The dated envelope", when: { all: ["reported"] }, text: "Priya kept it: forty dollars, and the date you handed it back." },
    { id: "returned", icon: "💵", name: "Forty dollars, returned", when: { all: ["confessed"] }, text: "The hardest flight of stairs you have ever climbed." },
    { id: "mug", icon: "☕", name: "A Kindling staff mug", when: { all: ["shared_faith"] }, text: "“For someone who answered my question properly.”" },
    { id: "receipt", icon: "🧾", name: "A receipt for a third flat white", when: { all: ["kind_customer"] }, text: "He came back on Friday to say thank you." },
    { id: "stone", icon: "🪨", name: "A river stone", when: { all: ["prayed"] }, text: "Smooth, from under the footbridge. It sits on your windowsill now." },
    { id: "reading", icon: "📖", name: "Sunday’s reading", when: { any: ["did:service", "did:service_guest"] }, text: "Colossians 3, folded into your coat pocket." },
    { id: "card", icon: "🫖", name: "A card from Pastor Tolu", when: { all: ["did:pastors"] }, text: "“The kettle is on most mornings.”" },
    { id: "tin", icon: "🥫", name: "The biscuit-tin envelope", when: { all: ["rent_helped"] }, text: "Half the table has needed it. One day you will be the one refilling it." },
  ],

  // The other strands of the week. Each beat that fits is shown.
  threads: [
    {
      title: "Dev",
      beats: [
        n("You turned a loan into a gift on a staircase. Dev buys the chips every time now, and pretends it is a coincidence.", { when: { all: ["forgave_debt"] } }),
        n("You told Dev how it felt to be avoided, and he took it. The first twenty arrives on the Friday he is paid, with a photo of the fern.", { when: { all: ["dev_talk"] } }),
        n("You let Dev down this week, and then you went and said so. He made you tea in the only mug he had unpacked.", { when: { all: ["dev_repaired"] } }),
        n("You carried Dev’s life up three flights of stairs. He won’t forget who turned up.", { when: { all: ["dev_good"], none: ["forgave_debt", "dev_talk", "dev_repaired"] } }),
        n("Things with Dev are polite and slightly cold. The hundred dollars sits between you like furniture. The honest conversation is still there to be had.", { when: { all: ["resent"], none: ["dev_good"] } }),
        n("Dev moved this week with less help than he needed. He hasn’t said anything. He wouldn’t. It isn’t too late to knock.", { when: { none: ["dev_good", "resent"] } }),
      ],
    },
    {
      title: "Kindling",
      beats: [
        n("You handed back forty dollars that nobody would have missed. Priya has started leaving you to cash up alone.", { when: { all: ["reported"] } }),
        n("You took the forty, and then you carried it back. Priya is a little careful with you still. Trust comes back more slowly than it leaves, but it is coming back.", { when: { all: ["confessed"] } }),
        n("The forty dollars is still yours. Priya paid a stranger out of her own pocket and doesn’t know why her count was off. You do.", { when: { all: ["pocketed"], none: ["confessed"] } }),
        n("A man in a grey coat was cruel to you, and you made him a third coffee. His wife is in the General. You would never have known.", { when: { all: ["kind_customer"] } }),
        n("You gave a rude man exactly what he gave you. Priya hasn’t mentioned it again. You still think about his face.", { when: { all: ["snapped"] } }),
        n("Priya asked what you believe, and you told her without a pitch. She isn’t persuaded. She is, she says, less suspicious.", { when: { all: ["shared_faith"] } }),
        n("You left the forty in the drawer and said nothing. Priya found it on Tuesday and spent an hour checking her sums. It was never yours to take. It was yours to mention.", { when: { all: ["left_till"] } }),
        n("A man in a grey coat was cruel to you on Thursday. You said nothing, and carried him home with you. He is still there.", { when: { all: ["did:shift_thu"], none: ["kind_customer", "snapped"] } }),
        n("Priya asked you a real question on Sunday, and you kept it light. She’ll ask again. She’s like that.", { when: { all: ["did:priya_coffee"], none: ["shared_faith", "confessed"] } }),
        n("You were hardly at Kindling this week. Priya managed. She always does.", { when: { none: ["did:shift_mon", "did:shift_thu", "did:cover", "did:priya_coffee"] } }),
      ],
    },
    {
      title: "Rent",
      beats: [
        n("You paid the rent in full, on the day. Being paid up and nearly broke is its own kind of freedom.", { when: { all: ["rent_paid"] } }),
        n("You were short, and you rang the landlord before he had to ring you. He gave you a week. The truth, told early, was cheaper than you expected.", { when: { all: ["rent_grace"] } }),
        n("You were short, and you let the Thursday table carry you. One day there will be an envelope in that biscuit tin with your handwriting on it, for someone else.", { when: { all: ["rent_helped"] } }),
        n("The rent is still unpaid, and there are three voicemails you haven’t played. It will not be smaller on Monday. It will only be later.", { when: { all: ["rent_avoided"] } }),
      ],
    },
    {
      title: "Great Haven",
      beats: [
        n("Pastor Daniel told you that needing help isn’t failing, and to ring before you were rung. You have repeated it to yourself more than once since.", { when: { all: ["pastor_money"] } }),
        n("Pastor Tolu told you not to decide in hiding. Pastor Daniel told you {partner} would be welcome whatever happened. Both turned out to matter.", { when: { all: ["pastor_love"] } }),
        n("On Sunday you sat near the back and heard Pastor Daniel say that you have been forgiven more than you will ever be asked to forgive.", { when: { all: ["did:service"] } }),
        n("You didn’t make it through the doors of Great Haven this week. They were open. They will be next week.", { when: { none: ["did:service", "did:service_guest", "did:pastors"] } }),
      ],
    },
    {
      title: "Rest",
      beats: [
        n("You stopped. By the river, at a table, in a pew, or simply at home with the phone in a drawer. The week did not fall apart while you weren’t holding it.", { when: { any: ["prayed", "rested", "did:table", "did:service", "did:supper"] } }),
        n("You never stopped once this week. Everything you did, you did tired. Rest was on the map the whole time; it is allowed.", { when: { none: ["prayed", "rested", "did:table", "did:service", "did:supper"] } }),
      ],
    },
  ],
};
