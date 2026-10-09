import type { Look, Scripture, Story } from "../types";
import { d, leadsWith, m, n, s, SHE, t, WEB } from "./kit";

// A Week at Halden Pryce.
//
// An analyst at a consulting firm, in the week of a pitch the team needs to
// win. The honest number is eleven percent. The director wants the slide to
// say eighteen. See kit.ts for the rules every world follows.

const LEILA: Look = { manner: "calm", build: { height: 1, shoulders: 92, hips: 86, limbs: 18 }, stance: "book", legs: "#2A2F3A", wideLegs: true, shoes: "#1A1614", slim: true, skin: "#C99672", shade: "#B07E5A", hair: "#1B1412", hairStyle: "wavy", top: "#3F5A7A", topStyle: "collar", accent: "#E8DCC8", lip: "#7A2E2C", glasses: true };
const VIC: Look = { manner: "brisk", build: { height: 1.02, shoulders: 96, hips: 88, limbs: 18 }, stance: "akimbo", skirt: "#2E2E33", shoes: "#1A1614", slim: true, skin: "#E8C4A6", shade: "#D0A888", hair: "#8A5A32", hairStyle: "bun", top: "#7A2E3A", topStyle: "collar", accent: "#F4EBDD", lip: "#8A3A32", earrings: true };
const FEMI: Look = { manner: "steady", build: { height: 1.01, shoulders: 116, hips: 98, limbs: 24 }, stance: "clasped", legs: "#2E2E33", shoes: "#1A1614", skin: "#6F4631", shade: "#5B3827", hair: "#BDB7B0", hairStyle: "short", top: "#1F3A5A", topStyle: "collar", accent: "#E8DCC8", lip: "#4A1F1C", beard: true, glasses: true };
const OWEN: Look = { manner: "confident", build: { height: 1.05, shoulders: 110, hips: 88, limbs: 21 }, stance: "pockets", legs: "#3A3F4A", shoes: "#3A2A20", skin: "#F1CBB0", shade: "#DDB093", hair: "#C9A46A", hairStyle: "side", top: "#C9D4E0", topStyle: "collar", accent: "#7A2E3A" };
const ABI: Look = { manner: "warm", build: { height: 0.98, shoulders: 96, hips: 92, limbs: 20 }, stance: "hip", legs: "#2F6F73", shoes: "#E8DCC8", slim: true, skin: "#8A5638", shade: "#72452C", hair: "#17110F", hairStyle: "puff", top: "#2F6F73", topStyle: "plain", accent: "#F4EBDD", lip: "#5C2421", earrings: true };

const LITTLE: Scripture = {
  reference: "Luke 16:10",
  translation: WEB,
  text: "He who is faithful in a very little is faithful also in much. He who is dishonest in a very little is also dishonest in much.",
  contextTitle: "In context",
  context: [
    "Jesus has just told a story about a manager and his employer’s accounts. His point is that character isn’t kept in a separate drawer for important occasions. The small entries are the practice for the large ones.",
    "He is not saying sixty dollars will ruin you. He is saying that sixty dollars is where you find out who you are becoming.",
  ],
};

const GO_FIRST: Scripture = {
  reference: "Matthew 18:15",
  translation: WEB,
  text: "If your brother sins against you, go, show him his fault between you and him alone. If he listens to you, you have gained back your brother.",
  contextTitle: "In context",
  context: [
    "Jesus is describing what to do when someone wrongs you. The first step is private and face to face, and its aim is to win the person back, not to win.",
    "There are further steps if that fails, and some wrongs do have to go higher. But he begins with the one that takes the most courage and does the least damage.",
  ],
};

const REST_GIFT: Scripture = {
  reference: "Psalm 127:2",
  translation: WEB,
  text: "It is vain for you to rise up early, to stay up late, eating the bread of toil; for he gives sleep to his loved ones.",
  contextTitle: "In context",
  context: [
    "This psalm is about building a house and guarding a city: ordinary, necessary work. It doesn’t say the work is pointless. It says that anxious over-work adds nothing to it.",
    "Sleep, here, is a gift, given to people who are loved before they have finished anything.",
  ],
};

const OVERCOME: Scripture = {
  reference: "Romans 12:21",
  translation: WEB,
  text: "Don’t be overcome by evil, but overcome evil with good.",
  contextTitle: "In context",
  context: [
    "Paul is finishing a passage about how to treat people who have treated you badly. He doesn’t pretend they haven’t. He says there is a way of answering that doesn’t let their behaviour set the terms of yours.",
    "It isn’t niceness. It is refusing to let someone else decide who you will be.",
  ],
};

const WORK_HEARTILY: Scripture = {
  reference: "Colossians 3:23–24",
  translation: WEB,
  text: "And whatever you do, work heartily, as for the Lord, and not for men, knowing that from the Lord you will receive the reward of the inheritance; for you serve the Lord Christ.",
  contextTitle: "In context",
  context: [
    "Paul is writing to people with very little say over their working lives. He tells them their work is seen by someone above every earthly manager.",
    "That changes what counts as success. It also means the work is never only a way of being noticed.",
  ],
};

const WALK_HUMBLY: Scripture = {
  reference: "Micah 6:8",
  translation: WEB,
  text: "He has shown you, O man, what is good. What does Yahweh require of you, but to act justly, to love mercy, and to walk humbly with your God?",
  contextTitle: "In context",
  context: [
    "The people have asked the prophet what God wants from them, and offered grander and grander sacrifices. The answer is disarmingly small and daily.",
    "It was not written about offices. It fits them remarkably well.",
  ],
};

const ALL = ["mon-day", "mon-eve", "wed-day", "wed-eve", "fri-day", "fri-eve", "sun-day", "sun-eve"];
const EVENINGS = ["mon-eve", "wed-eve", "fri-eve", "sun-eve"];
const RESTED = ["prayed", "rested", "did:midweek", "did:service", "did:park", "did:abi_friday", "did:abi_dinner"];

export const haldenPryceWeek: Story = {
  id: "halden-pryce-week",
  title: "A Week at Halden Pryce",
  subtitle: "One slide, one number, and whose name goes underneath.",
  minutes: 15,

  world: {
    name: "The Offices of Halden Pryce",
    tagline: "Deadlines, bonuses and whose name goes on the slide, fourteen floors above the harbour.",
    themes: ["Work", "Integrity", "Ambition", "Rest"],
  },
  map: { ground: "paved", backdrop: "towers" },
  dog: "Memo",
  banter: [
    "Let’s circle back. I say that to my children now.",
    "I’ve been in back-to-back meetings since 2019.",
    "Is it Friday? It’s Tuesday? It’s Tuesday.",
    "That’s not a salad. That’s a cry for help in a box.",
    "My out-of-office is the truest thing I’ve written all year.",
    "Somebody replied to all. Pray for us.",
    "The lift on the left is haunted. Take the right.",
    "I love my job. I’m saying it out loud so that I can hear it.",
    "Memo is the only one round here who finishes on time.",
    "Twelve dollars for a sandwich. I ate it angrily.",
    "You’re on mute. Sorry. Habit.",
    "I’m walking for my step count and my sanity.",
    "Quick question. It’s never a quick question.",
  ],

  intro: {
    place: "Halden Pryce",
    paragraphs: [
      "Halden Pryce is a consulting firm on the fourteenth floor of a glass tower on Quay Street. The coffee is excellent, the hours are long, and everyone is one good quarter from a promotion or one bad one from the door.",
      "Nobody here is a villain. Most of them are tired. A few know you go to church, and are waiting, without much interest, to see whether it makes any difference.",
    ],
    playerTraits: [
      "That’s you: analyst, eighteen months in",
      "Up for promotion in the spring",
      "Shares a desk island with {partner}",
      "At Quayside Church most Sundays, when work allows",
      "Shares a flat with Abi, who works nights",
    ],
    partnerTraits: [
      "Senior analyst; built the model your team runs on",
      "Not religious; scrupulously fair",
      "Says “interesting” when she means “wrong”",
      "The first person here who was kind to you",
    ],
    howToPlay:
      "You have one week: four days, each with a morning and an evening. Every time, you choose one place to be. Work takes energy that working harder won’t give back, the pitch is on Friday whether you are ready or not, and some people will only ask once.",
  },

  leads: leadsWith({ name: "Leila", pronouns: SHE, look: LEILA, voice: { kind: "female", variant: 1, pitch: 1.02 } }),

  cast: [
    { id: "vic", name: "Victoria Hale", look: VIC, voice: { kind: "female", variant: 4, pitch: 1.06, rate: 1.04 }, traits: ["Your director. Everyone calls her Vic", "Brilliant, fast, and one bad quarter from the door", "Remembers birthdays; forgets to go home"] },
    { id: "femi", name: "Femi", look: FEMI, voice: { kind: "male", variant: 3, pitch: 0.9, rate: 0.94 }, traits: ["Runs the front desk, and so the building", "A deacon at Quayside Church", "Has watched thirty years of careers walk through that lobby"] },
    { id: "owen", name: "Owen", look: OWEN, voice: { kind: "male", variant: 2, pitch: 1.08, rate: 1.04 }, traits: ["Analyst, same year as you", "Up for the same promotion", "Friendly in meetings, busy in corridors"] },
    { id: "abi", name: "Abi", look: ABI, voice: { kind: "female", variant: 5 }, traits: ["Your flatmate; a nurse on nights", "Leaves notes on the fridge", "Notices when you haven’t eaten"] },
  ],

  narrator: { kind: "female", variant: 2, pitch: 0.95, rate: 0.95 },

  qualityNotes: {
    wisdom: "You asked someone who had seen it all before, and took the slower road he pointed to.",
    integrity: "You let the slide and the truth say the same thing.",
    compassion: "You treated rivals and bosses as people, even when it cost you an advantage.",
    courage: "You said it to their face, in the room, when an email would have been easier.",
    trust: "You worked as someone already loved, not as someone trying to be noticed.",
  },

  start: { money: 300, energy: 3, bond: 2, place: "home" },

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
    church: { name: "Quayside Church", x: 19, y: 22, icon: "chapel", at: "west" },
    home: { name: "Your Flat", x: 55, y: 20, icon: "home", at: "north" },
    office: { name: "Halden Pryce", x: 86, y: 25, icon: "tower", at: "east" },
    lock: { name: "The Lock", x: 29, y: 49, icon: "cup", at: "mid" },
    brightwater: { name: "Brightwater Foods", x: 64, y: 51, icon: "door", at: "lane" },
    park: { name: "Quay Park", x: 17, y: 77, icon: "green", at: "green" },
    quay: { name: "The Quayside", x: 66, y: 86, icon: "water", at: "bank" },
  },

  // The streets around Quay Street. People walk from junction to junction.
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
    { id: "ask", key: true, place: "office", slots: ["mon-eve", "wed-eve"], with: ["vic"], title: "Vic wants a word", blurb: "“Got five minutes? Bring the Brightwater numbers.”", energy: -1, scene: "ask" },
    { id: "deck", key: true, place: "office", slots: ["wed-eve"], with: ["vic"], when: { all: ["stalling"], none: ["held_line", "inflated", "path_expose"] }, title: "The deck locks tonight", blurb: "Slide fourteen still says eleven. Vic is waiting.", energy: -1, scene: "deck" },
    { id: "email_mp", tempt: "ease", place: "home", slots: ["wed-eve"], when: { all: ["did:ask"], none: ["inflated", "path_expose"] }, title: "Email the managing partner about Vic", blurb: "It would be easier than saying it to her face.", flags: ["path_expose"], scene: "email_mp" },
    { id: "review", key: true, place: "office", slots: ["wed-day"], with: ["vic", "partner"], title: "The partner review", blurb: "Twenty minutes in front of the people who decide promotions.", energy: -1, scene: "review" },
    { id: "confess_client", key: true, place: "home", slots: ["sun-eve"], when: { all: ["lied_room"], none: ["owned_up"] }, title: "Write to Ms. Aldana and correct the figure", blurb: "Eleven, not eighteen. In writing, with your name on it.", grow: { integrity: 1, courage: 1 }, scene: "confess_client" },
    { id: "peace_vic", key: true, place: "home", slots: ["sun-eve"], with: ["vic"], when: { all: ["path_expose"], none: ["made_peace"] }, title: "Ring Vic", blurb: "You were right about the number. You went round her to say it.", grow: { compassion: 1, courage: 1 }, scene: "peace_vic" },
    { id: "counsel_femi", key: true, place: "church", slots: ["sun-eve"], with: ["femi"], when: { any: ["lied_room", "path_expose"], none: ["owned_up", "made_peace"] }, title: "Find Femi after the evening service", blurb: "Then go and do what needs doing.", grow: { wisdom: 1 }, scene: "counsel_femi" },

    // Work
    { id: "inbox_mon", game: "inbox", place: "office", slots: ["mon-day"], with: ["partner", "owen"], title: "Clear the decks", blurb: "Forty-three unread, and last month’s expenses.", energy: -1, scene: "expenses" },
    { id: "kitchen_mon", place: "office", slots: ["mon-day"], with: ["owen"], title: "Coffee in the kitchen with Owen", blurb: "He has news. He always has news.", scene: "gossip" },
    { id: "late_mon", place: "office", slots: ["mon-eve"], with: ["partner"], title: "Stay late with {partner} on the model", blurb: "She says it will take an hour. It never takes an hour.", energy: -1, bond: { partner: 1 }, flags: ["built_together"], scene: "late_model" },
    { id: "owen_mess", place: "office", slots: ["wed-day"], with: ["owen"], title: "Owen is panicking at the printer", blurb: "He is very pale, and he is asking for you.", scene: "owen_mess" },
    { id: "lunch_leila", place: "lock", slots: ["wed-day"], with: ["partner"], when: { all: ["did:ask"] }, title: "Lunch with {partner} at the Lock", blurb: "“You’ve been quiet since Monday. Spill.”", bond: { partner: 1 }, scene: "lunch_leila" },
    { id: "late_wed", place: "office", slots: ["wed-eve"], title: "Stay till midnight on the slides", blurb: "Nobody asked you to. Everybody will notice.", energy: -2, flags: ["overworked"], scene: "late_wed" },
    { id: "leila_after", place: "lock", slots: ["fri-day"], with: ["partner"], when: { none: ["path_expose"] }, title: "Coffee with {partner} after the pitch", blurb: "She has her laptop open, and a question.", scene: "leila_after" },
    { id: "fix_expenses", place: "office", slots: ["fri-day"], when: { all: ["padded"], none: ["unpadded"], minMoney: 60 }, title: "Take the taxi off your expenses", blurb: "Sixty dollars. It has bothered you all week.", grow: { integrity: 1 }, scene: "fix_expenses" },
    { id: "sunday_work", place: "office", slots: ["sun-day"], title: "Go in on Sunday and get ahead", blurb: "The floor will be empty. Think how much you’d get done.", energy: -2, flags: ["sunday_worked"], scene: "sunday_work" },
    { id: "owen_coffee", place: "lock", slots: ["sun-day"], with: ["owen"], when: { all: ["helped_owen"] }, title: "Owen wants to buy you a coffee", blurb: "He says it’s important. He says it twice.", scene: "owen_coffee" },

    // Femi and Quayside
    { id: "femi_desk", place: "office", slots: ["mon-day", "wed-day"], with: ["femi"], title: "Stop at the front desk", blurb: "Femi has a flask, a spare cup, and all the time in the world.", flags: ["femi_talk"], scene: "femi_desk" },
    { id: "midweek", place: "church", slots: ["wed-eve"], with: ["femi"], title: "Wednesday prayers at Quayside", blurb: "Twenty minutes in the side chapel. Then everyone goes home.", energy: 1, grow: { trust: 1 }, scene: "midweek" },
    { id: "service", place: "church", slots: ["sun-day"], with: ["femi"], title: "Sunday at Quayside Church", blurb: "A mission hall between a car park and a vape shop.", energy: 1, scene: "service" },

    // Home
    { id: "abi_dinner", place: "home", slots: ["mon-eve"], with: ["abi"], title: "Dinner with Abi before her shift", blurb: "She has made too much. She always makes too much.", energy: 1, bond: { abi: 1 }, scene: "abi_dinner" },
    { id: "abi_car", place: "home", slots: ["wed-eve"], with: ["abi"], title: "Abi needs to ask you something", blurb: "She is holding a garage bill, and not looking at you.", scene: "abi_car" },
    { id: "drinks", place: "lock", slots: ["fri-eve"], with: ["vic", "owen"], when: { none: ["path_expose"] }, title: "Team drinks at the Lock", blurb: "Vic’s card is behind the bar.", scene: "drinks" },
    { id: "abi_friday", place: "home", slots: ["fri-eve"], with: ["abi"], title: "Friday night in with Abi", blurb: "Her one night off. She has rented something terrible.", energy: 1, bond: { abi: 1 }, scene: "abi_friday" },
    { id: "supper", place: "home", slots: ["sun-eve"], with: ["abi", "partner"], when: { none: ["lied_room", "path_expose"] }, title: "Sunday supper at the flat", blurb: "Abi is cooking. {partner} is bringing wine.", energy: 1, scene: "supper" },

    // Always there
    { id: "pray_first", place: "quay", slots: EVENINGS, when: { none: ["prayed"] }, title: "Walk the quayside and pray", blurb: "No agenda. Just tell God the truth.", energy: 1, grow: { trust: 1 }, flags: ["prayed"], scene: "quay_first" },
    { id: "pray_again", repeatable: true, place: "quay", slots: EVENINGS, when: { all: ["prayed"] }, title: "Walk the quayside and pray", blurb: "Bring the day with you and set it down.", energy: 1, scene: "quay_again" },
    { id: "park", repeatable: true, place: "park", slots: ["wed-day", "fri-day", "sun-day"], title: "Eat lunch in Quay Park", blurb: "A bench, a sandwich, and your phone in your pocket.", energy: 1, scene: "park" },
    { id: "rest", repeatable: true, place: "home", slots: ALL, title: "Rest at home", blurb: "Laptop in the wardrobe. Window open.", energy: 2, flags: ["rested"], scene: "rest_home" },

    // These happen by themselves
    { id: "pitch", auto: true, place: "brightwater", slots: ["fri-day"], title: "The Brightwater pitch", blurb: "", scene: "pitch" },
    { id: "reckoning", auto: true, place: "home", slots: ["sun-eve"], when: { any: ["lied_room", "path_expose"], none: ["owned_up", "made_peace"] }, title: "A message from {partner}", blurb: "", scene: "reckoning" },
  ],

  nodes: {
    // ——— Monday on the fourteenth floor ———
    expenses: {
      setting: "office",
      caption: "Monday morning · Halden Pryce, fourteenth floor",
      onStage: ["partner"],
      beats: [
        n("Monday on the fourteenth floor: the hum of the air conditioning, forty-three unread, and the expenses form for last month’s client dinner, due at noon."),
        d("partner", "Morning. You look like a person who checked their email in bed. Don’t do that. I do that.", "warm"),
        n("The form has a line for “Taxi home”. You took the bus. Owen leans across from the next island."),
        d("owen", "Put sixty in. Everybody adds a taxi. It’s basically part of the salary; they just can’t call it that.", "warm"),
        t("Sixty dollars. Nobody checks. Nobody has ever checked."),
      ],
      prompt: "What do you put on the form?",
      choices: [
        { id: "clean", label: "Claim what you spent. Leave the taxi line empty.", grow: { integrity: 1 }, flags: ["clean_expenses"], next: "expenses_clean" },
        { id: "pad", tempt: "money", label: "Add the taxi. Sixty dollars.", money: 60, flags: ["padded"], next: "expenses_pad" },
      ],
    },
    expenses_clean: {
      setting: "office",
      caption: "Monday morning · Halden Pryce, fourteenth floor",
      beats: [
        d("owen", "Suit yourself. More for the rest of us.", "neutral"),
        d("partner", "He’s not wrong that everybody does it. I never have. I couldn’t tell you why. It just feels like the start of something.", "thoughtful"),
        s(LITTLE),
      ],
      next: "map",
    },
    expenses_pad: {
      setting: "office",
      caption: "Monday morning · Halden Pryce, fourteenth floor",
      beats: [
        n("You type 60.00 and press submit. It is approved by lunchtime, by a system that approves everything."),
        t("It was easy. That is the part that stays with you: how easy it was.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    gossip: {
      setting: "kitchen",
      caption: "Monday morning · Halden Pryce, the kitchen",
      onStage: ["owen"],
      beats: [
        n("The fourteenth-floor kitchen has a coffee machine that cost more than your car, and a view of the harbour that nobody looks at."),
        d("owen", "Between us. Leila’s on a performance plan. I had it from someone in HR. Brilliant, apparently, but “difficult”. If she goes, there’s a senior slot open by spring.", "warm"),
        d("owen", "You sit next to her. What’s she actually like? Go on. I told you mine.", "warm"),
        t("He is offering a trade. That is how the kitchen works: you pay for information with information."),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "refuse", label: "“I’d rather not talk about her when she isn’t here.”", grow: { integrity: 1, courage: 1 }, flags: ["no_gossip"], bond: { owen: -1 }, next: "gossip_refuse" },
        { id: "trade", tempt: "ease", label: "Give him something. Just a small thing she said about Vic.", flags: ["gossiped"], bond: { owen: 1 }, next: "gossip_trade" },
        { id: "dodge", label: "Laugh, and ask about his weekend.", next: "gossip_dodge" },
      ],
    },
    gossip_refuse: {
      setting: "kitchen",
      caption: "Monday morning · Halden Pryce, the kitchen",
      beats: [
        d("owen", "All right, Saint Analyst. It was only conversation.", "hurt"),
        n("He takes his coffee and goes. You have just made the kitchen a slightly lonelier place for yourself, and you know it."),
        t("Leila was the first person here who was kind to you. That seemed worth one awkward silence."),
      ],
      next: "map",
    },
    gossip_trade: {
      setting: "kitchen",
      caption: "Monday morning · Halden Pryce, the kitchen",
      beats: [
        n("You tell him something Leila said about Vic three weeks ago, late, when she was tired. It was true, and it was said to you."),
        d("owen", "Ha. Interesting. That’s very interesting.", "warm"),
        t("You watch it leave the room with him. You can’t get it back now.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    gossip_dodge: {
      setting: "kitchen",
      caption: "Monday morning · Halden Pryce, the kitchen",
      beats: [
        d("owen", "Rugby, mostly. You’re no fun.", "neutral"),
        t("You didn’t add to it. You didn’t stop it, either. He’ll have the same conversation with someone else by ten."),
      ],
      next: "map",
    },
    femi_desk: {
      setting: "office",
      caption: "The lobby, Halden Pryce",
      onStage: ["femi"],
      beats: [
        n("Femi has run the front desk for thirty years. He knows every name in the building, and which of them say good morning."),
        d("femi", "Sit, sit. You people run past this desk as if the lift might leave without you. It always comes back.", "warm"),
        n("He pours tea from a flask into its lid, and gives you the lid."),
        d("femi", "Now. How are you? And I do not mean the work.", "thoughtful"),
      ],
      prompt: "What do you tell him?",
      choices: [
        { id: "vic", when: { all: ["did:ask"] }, label: "Tell him what Vic asked you to do.", grow: { wisdom: 1 }, flags: ["femi_counsel"], next: "femi_vic" },
        { id: "owen", when: { all: ["did:kitchen_mon"] }, label: "Tell him about Owen and the kitchen.", grow: { wisdom: 1 }, next: "femi_owen" },
        { id: "tired", label: "Tell him you’re tired in a way that sleep doesn’t fix.", grow: { trust: 1 }, next: "femi_tired" },
        { id: "fine", label: "“Busy! Good busy.”", next: "femi_fine" },
      ],
    },
    femi_vic: {
      setting: "office",
      caption: "The lobby, Halden Pryce",
      beats: [
        d("you", "She wants a number changed before Friday. It isn’t a true number."),
        d("femi", "Hm. And you want to know whether to go to her boss.", "thoughtful"),
        d("femi", "Thirty years I have watched people in this building go over each other’s heads. It is quick, and it leaves blood on the carpet. Go to her. Her, first, and alone. Say it plainly. If she will not hear you, then you have somewhere else to go, and a clean way to go there.", "warm"),
        s(GO_FIRST),
      ],
      next: "map",
    },
    femi_owen: {
      setting: "office",
      caption: "The lobby, Halden Pryce",
      beats: [
        d("femi", "Ah, the kitchen. More careers have ended in that kitchen than in the boardroom.", "thoughtful"),
        d("femi", "Here is an old man’s rule. If you would not say it with her standing there, it is not yours to say. And if somebody brings you a story, ask them why they are carrying it.", "warm"),
      ],
      next: "map",
    },
    femi_tired: {
      setting: "office",
      caption: "The lobby, Halden Pryce",
      beats: [
        d("you", "I’m good at this job. I think it might be eating me."),
        d("femi", "I have seen that look come through those doors at seven and leave at eleven. The ones who last are not the ones who work the longest. They are the ones who know what the work is for.", "thoughtful"),
        s(REST_GIFT),
        d("femi", "Go home on time once this week. The building will still be here. I will make sure of it.", "warm"),
      ],
      next: "map",
    },
    femi_fine: {
      setting: "office",
      caption: "The lobby, Halden Pryce",
      beats: [d("femi", "Good busy. Yes. I hear that one a great deal.", "thoughtful"), n("He lets it go, and tops up the lid.")],
      next: "map",
    },
    late_model: {
      setting: "office",
      caption: "Monday evening · Halden Pryce, fourteenth floor",
      beats: [
        n("By eight the floor is empty except for the two of you and the cleaner’s radio. Leila’s model fills both her screens: two years of Brightwater’s costs, every line of it built by hand."),
        d("partner", "There. Eleven percent. That’s what we can save them if they do everything we say, which they won’t.", "thoughtful"),
        d("partner", "People think the skill is making the number big. The skill is making it true, and then standing next to it.", "warm"),
        t("She has never once put her own name on a slide. You have noticed. You’re not sure anyone else has."),
      ],
      next: "map",
    },

    // ——— The number ———
    ask: {
      setting: "office",
      caption: "Evening · Vic’s office",
      onStage: ["vic"],
      beats: [
        n("Vic’s office has a glass wall and a dying orchid. She shuts the door, which she never does."),
        d("vic", "Brightwater on Friday. If we win it, the team is safe for a year. If we lose it, I have a conversation with the partners that I would rather not have.", "thoughtful"),
        d("vic", "Slide fourteen says eleven percent. Every other firm pitching will say twenty. I need it to say eighteen.", "neutral"),
        d("vic", "It’s a projection. Projections are opinions. And there’s a bonus pool on this: fifteen hundred each, if it closes. I’m asking you because you’re good, and because I’m out of time.", "warm"),
        t("Fifteen hundred dollars. The promotion. And Vic, who remembered your birthday, looking more tired than you have ever seen her.", { react: { you: "worried" } }),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "hold", label: "“I can’t put my name to eighteen. Let me show you what eleven honestly buys them.”", grow: { integrity: 1, courage: 1 }, flags: ["held_line"], next: "ask_hold" },
        { id: "change", tempt: "money", label: "“Leave it with me. It’ll say eighteen by morning.”", flags: ["inflated"], next: "ask_change" },
        { id: "stall", label: "“Let me look at the model again.”", flags: ["stalling"], next: "ask_stall" },
      ],
    },
    ask_hold: {
      setting: "office",
      caption: "Evening · Vic’s office",
      beats: [
        d("vic", "You can’t. Interesting. I wasn’t aware I had asked what you could do.", "hurt"),
        d("you", "If their finance director pulls on that number, it comes apart in the room, with both our names on it. I’d rather lose it honestly than win it and wait."),
        n("She looks at the orchid for a long time.", { react: { vic: "thoughtful" } }),
        d("vic", "Build me the honest version. Make it the best eleven anyone has ever seen. And don’t be late.", "thoughtful"),
        t("She didn’t say thank you. She didn’t say no."),
      ],
      next: "map",
    },
    ask_change: {
      setting: "office",
      caption: "Evening · Halden Pryce, fourteenth floor",
      beats: [
        n("It takes four minutes. You change two assumptions in Leila’s model, and the number climbs like a lift."),
        d("vic", "Good. Thank you. I won’t forget this.", "warm"),
        t("Leila’s name is on that model. She doesn’t know what it says now.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    ask_stall: {
      setting: "office",
      caption: "Evening · Vic’s office",
      beats: [d("vic", "Look quickly. The deck locks on Wednesday night.", "neutral"), t("You haven’t said yes. You are aware that you also haven’t said no.")],
      next: "map",
    },
    deck: {
      setting: "office",
      caption: "Wednesday evening · Vic’s office",
      onStage: ["vic"],
      beats: [d("vic", "Well? You’ve had two days with it.", "neutral"), n("The deck is open on her screen at slide fourteen. The cursor is blinking beside the eleven.")],
      prompt: "What do you say?",
      choices: [
        { id: "hold", label: "“I can’t put my name to eighteen. Let me show you what eleven honestly buys them.”", grow: { integrity: 1, courage: 1 }, flags: ["held_line"], next: "ask_hold" },
        { id: "change", tempt: "money", label: "“Give me four minutes. It’ll say eighteen.”", flags: ["inflated"], next: "ask_change" },
        { id: "around", tempt: "ease", label: "Say you need a minute, and email the managing partner from the corridor.", flags: ["path_expose"], next: "email_mp" },
        { id: "more", label: "“I still need more time.”", next: "deck_stall" },
      ],
    },
    deck_stall: {
      setting: "office",
      caption: "Wednesday evening · Vic’s office",
      beats: [
        d("vic", "There isn’t any. Go home. I’ll deal with it myself.", "hurt"),
        t("She turns back to her screen. You have not said yes. You have made sure that somebody else will."),
      ],
      next: "map",
    },
    email_mp: {
      setting: "room",
      caption: "Wednesday evening",
      beats: [
        n("You write it in the voice you use for things that might be read aloud later. Subject line: Concern regarding Brightwater figures."),
        n("It is accurate. It is thorough. It names Vic four times. You send it to the managing partner, and you do not copy her."),
        t("You didn’t have to watch her face. That was the point of doing it this way. You are less comfortable with that than you expected.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    review: {
      setting: "office",
      caption: "Wednesday morning · the boardroom",
      onStage: ["vic", "partner"],
      beats: [
        n("The boardroom, twenty minutes, three partners. This is the meeting where promotions are quietly decided, months before anyone is told."),
        d("vic", "The Brightwater model is the best piece of analysis this team has produced. And I want to credit the person who built it.", "warm"),
        n("She turns, and gestures to you. Across the table, Leila looks at her notebook.", { react: { partner: "sad" } }),
        t("Leila built it. Every line. You ran the scenarios. The partners are nodding at you."),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "credit", label: "“Thank you, but Leila built the model. I ran scenarios on it.”", grow: { integrity: 1, courage: 1 }, flags: ["gave_credit"], bond: { partner: 1 }, next: "review_credit" },
        { id: "take", tempt: "ease", label: "Smile, and say thank you.", flags: ["took_credit"], bond: { partner: -1 }, next: "review_take" },
        { id: "later", label: "Say nothing now. Tell Vic afterwards, in private.", flags: ["credit_later"], next: "review_later" },
      ],
    },
    review_credit: {
      setting: "office",
      caption: "Wednesday morning · the boardroom",
      beats: [
        n("A small pause. One of the partners writes something down."),
        d("vic", "Quite right. My mistake. Leila, walk us through it.", "thoughtful"),
        n("Leila does, for nine minutes, without notes. It is the first time the partners have heard her speak for more than one.", { react: { partner: "warm" } }),
        d("partner", "You didn’t have to do that. You know what that meeting is for.", "thoughtful"),
        d("you", "That’s why."),
      ],
      next: "map",
    },
    review_take: {
      setting: "office",
      caption: "Wednesday morning · the boardroom",
      beats: [
        n("You say thank you. The partners move on to the next item. It took four seconds."),
        n("Leila doesn’t say anything afterwards. She closes her notebook, and holds the door for you on the way out.", { react: { partner: "sad" } }),
        t("She has never put her name on a slide. Now you have put yours on her work.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    review_later: {
      setting: "office",
      caption: "Wednesday morning · by the lifts",
      beats: [
        n("Afterwards you catch Vic by the lifts and tell her. She winces."),
        d("vic", "Oh, no. I’ll mention it to them. At some point.", "thoughtful"),
        t("The partners heard one thing, in the room. A correction in a corridor is not the same size.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    owen_mess: {
      setting: "office",
      caption: "Wednesday morning · the print room",
      onStage: ["owen"],
      beats: [
        n("Owen is standing by the printer holding nothing, which is not like him."),
        d("owen", "I sent the Brightwater draft to Calder Foods. Their rival. The whole deck. I picked the wrong name from the list at eleven last night.", "worried"),
        d("owen", "Nobody knows yet. If Vic finds out before Friday, I’m gone. I know what I’m like. I didn’t know who else to tell.", "sad"),
        t("He has wanted your promotion since the day you both started, and he has not been subtle about it. He is shaking."),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "help", label: "“Come on. We ring Calder together, and then we tell Vic. Both of us.”", grow: { compassion: 1, courage: 1 }, flags: ["helped_owen"], bond: { owen: 2 }, next: "owen_help" },
        { id: "leave", tempt: "ease", label: "“I’m sorry. I can’t be anywhere near this.”", flags: ["left_owen"], next: "owen_leave" },
        { id: "sink", label: "Go and tell Vic yourself, before he can.", flags: ["sank_owen"], bond: { owen: -2 }, next: "owen_sink" },
      ],
    },
    owen_help: {
      setting: "office",
      caption: "Wednesday morning · Vic’s office",
      beats: [
        n("Calder’s analyst, it turns out, hasn’t opened it. She deletes it while you are on the line, and sends a screenshot to prove it. Then you walk Owen to Vic’s door, and stand beside him while he says it."),
        d("vic", "You sent it where? And you came and told me. Both of you. Fine. It’s contained. Get out.", "thoughtful"),
        s(OVERCOME),
        d("owen", "I’d have let you sink. You know that, don’t you? I’d have watched.", "sad"),
      ],
      next: "map",
    },
    owen_leave: {
      setting: "office",
      caption: "Wednesday morning · Halden Pryce, fourteenth floor",
      onStage: [],
      beats: [
        n("You say you’re sorry, and you mean it, and you go back to your desk. Through the glass you watch him stand there for another ten minutes."),
        t("You didn’t push him. You only declined to hold out a hand. You keep telling yourself there is a difference.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    owen_sink: {
      setting: "office",
      caption: "Wednesday · Halden Pryce, fourteenth floor",
      onStage: [],
      beats: [
        n("You tell Vic the facts, and only the facts. She thanks you for your vigilance. By two o’clock Owen’s chair is empty and his lanyard is on the desk."),
        t("Everything you said was true. You are almost sure that is why you said it.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    lunch_leila: {
      setting: "cafe",
      caption: "Wednesday lunchtime · The Lock",
      beats: [
        n("The Lock is a pub that became a café and can’t quite commit. Leila orders for both of you without asking, and gets it right."),
        d("partner", "Vic asked you about slide fourteen. Don’t look surprised. She asked me first, in March, about a different client. I said no. I’ve been “difficult” ever since.", "thoughtful"),
        d("partner", "You said no too. Of course you did.", "warm", { when: { all: ["held_line"] } }),
        d("partner", "You’re still thinking about it. All right. I won’t push.", "thoughtful", { when: { all: ["stalling"], none: ["held_line", "inflated"] } }),
        t("She built that model. She is eating a sandwich across from you, and she doesn’t know what it says now.", { when: { all: ["inflated"] }, react: { you: "worried" } }),
      ],
      next: [{ when: { all: ["held_line"] }, to: "lunch_why" }, { to: "map" }],
    },
    lunch_why: {
      setting: "cafe",
      caption: "Wednesday lunchtime · The Lock",
      beats: [d("partner", "Why, though? It’s fifteen hundred dollars and a promotion. I said no because I’m stubborn. You’re not stubborn. Is it the church thing?", "thoughtful")],
      prompt: "What do you tell her?",
      choices: [
        { id: "share", label: "Tell her the truth, plainly, without a sermon.", grow: { courage: 1 }, flags: ["shared_faith"], bond: { partner: 1 }, next: "lunch_share" },
        { id: "shrug", label: "“I just didn’t fancy getting caught.”", next: "lunch_shrug" },
      ],
    },
    lunch_share: {
      setting: "cafe",
      caption: "Wednesday lunchtime · The Lock",
      beats: [
        d("you", "It is. I think the work matters to God. Not the winning; the work. So I’d rather hand in a true eleven than a clever eighteen. I’m not brave. I just know who I’m doing it for."),
        d("partner", "Hm. Interesting.", "thoughtful"),
        d("partner", "I mean actually interesting. Not the way I usually mean it.", "warm"),
        s(WORK_HEARTILY),
        n("She pays for lunch, which she has never done before."),
      ],
      next: "map",
    },
    lunch_shrug: {
      setting: "cafe",
      caption: "Wednesday lunchtime · The Lock",
      beats: [
        d("partner", "Mm. That’s not it. People who are scared of getting caught say yes, and cover their tracks.", "thoughtful"),
        t("She asked a real question. She’ll ask again. She’s like that."),
      ],
      next: "map",
    },
    late_wed: {
      setting: "office",
      caption: "Wednesday night · Halden Pryce, fourteenth floor",
      beats: [
        n("Half past eleven. You have aligned every text box in the deck to the pixel. The cleaner has done your floor twice and asked, kindly, whether you have a home."),
        t("Nobody asked for this. You’re not sure who you are doing it for. You suspect it is so that nobody can ever say you didn’t."),
        n("You get the last bus. There is a message from Abi: there’s a plate in the oven. it was hot at 8."),
      ],
      next: "map",
    },

    // ——— Quayside ———
    midweek: {
      setting: "hall",
      caption: "Wednesday evening · Quayside Church",
      onStage: ["femi"],
      beats: [
        n("Wednesday prayers at Quayside are held in the side chapel, because heating the main hall costs too much. Nine people: a bus driver, two nurses, a barrister, Femi in his lobby blazer."),
        n("Nobody here knows what a deck is. Nobody asks what you do. Someone prays for a daughter’s exam, someone for a hip operation."),
        d("femi", "And for our young friend from the fourteenth floor, who is carrying something this week. Lord, you know what it is. We do not need to.", "warm"),
        t("You hadn’t told him anything. Thirty years on a front desk, and he can read a walk.", { when: { none: ["femi_counsel"] }, react: { you: "warm" } }),
        t("He doesn’t say what. He promised he wouldn’t.", { when: { all: ["femi_counsel"] }, react: { you: "warm" } }),
      ],
      next: "map",
    },
    service: {
      setting: "hall",
      caption: "Sunday morning · Quayside Church",
      onStage: ["femi"],
      beats: [
        n("Quayside Church is a Victorian mission hall between a car park and a vape shop. Femi is on the door, as he is on every door."),
        n("The preacher is a retired docker. He says that most of what God asks of you this week will happen at a desk, and that a spreadsheet can be an act of worship or an act of fear, and only you know which."),
        t("You think about slide fourteen for the whole of the last hymn.", { when: { any: ["lied_room", "silent_room"], none: ["owned_up"] }, react: { you: "sad" } }),
        t("You think about slide fourteen, and for once it doesn’t tighten your chest.", { when: { any: ["told_truth", "owned_up"] }, react: { you: "warm" } }),
        d("femi", "You came. Good. Monday will still be there. Sit a while.", "warm"),
      ],
      next: "map",
    },
    sunday_work: {
      setting: "office",
      caption: "Sunday morning · Halden Pryce, fourteenth floor",
      beats: [
        n("The fourteenth floor on a Sunday is silent and smells of carpet. Your pass still works. You get more done by noon than in the whole of Thursday."),
        n("Femi isn’t on the desk on Sundays. A man you don’t know nods you through without looking up."),
        t("Nobody knows you are here. You find you want somebody to know, and that is when you understand what you came in for.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },

    // ——— Home ———
    abi_dinner: {
      setting: "kitchen",
      caption: "Monday evening · your flat",
      beats: [
        n("Abi works nights on a surgical ward and cooks as though she were feeding the whole shift. There is a note on the fridge, in her handwriting, that just says EAT."),
        d("abi", "Sit. You’ve got your work face on. I’ve got twelve hours of other people’s insides ahead of me, so give me one normal conversation first.", "warm"),
        d("abi", "Is it the job, or the people in the job?", "thoughtful"),
        d("you", "The people. No. Me, when I’m around the people."),
        d("abi", "Well. That’s the first honest thing you’ve said since Thursday. Have some rice.", "warm"),
        t("She doesn’t believe what you believe. She has never once let you leave the flat hungry."),
      ],
      next: "map",
    },
    abi_car: {
      setting: "kitchen",
      caption: "Wednesday evening · your flat",
      onStage: ["abi"],
      beats: [
        d("abi", "The car failed its inspection. Two hundred and fifty to fix. Without it I can’t get to nights; there’s no bus at that hour.", "worried"),
        d("abi", "I get paid on the first. I hate asking. I’ve asked my sister, and she has less than I have.", "sad"),
        t("You have {money}. And, if Friday goes the way Vic wants, fifteen hundred more.", { when: { any: ["inflated", "stalling"] } }),
        t("You have {money}.", { when: { none: ["inflated", "stalling"] } }),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "lend", when: { minMoney: 250 }, label: "Lend her the two hundred and fifty. No conditions.", grow: { compassion: 1 }, money: -250, flags: ["lent_abi"], bond: { abi: 1 }, next: "abi_lend" },
        { id: "part", when: { minMoney: 100 }, label: "Give her a hundred, and help her ring the garage about the rest.", grow: { compassion: 1 }, money: -100, flags: ["part_abi"], next: "abi_part" },
        { id: "later", tempt: "ease", label: "“Things are tight. Ask me after Friday.”", flags: ["refused_abi"], next: "abi_later" },
      ],
    },
    abi_lend: {
      setting: "kitchen",
      caption: "Wednesday evening · your flat",
      beats: [
        d("abi", "All of it? You’re sure? I’ll write it down. I’m writing it down.", "warm"),
        d("you", "Write it down if it helps. I’m not going to chase it."),
        n("She writes it on the fridge anyway, under EAT: I O U 250. Then, underneath, smaller: thank you."),
      ],
      next: "map",
    },
    abi_part: {
      setting: "kitchen",
      caption: "Wednesday evening · your flat",
      beats: [
        n("You give her what you can, and sit beside her while she rings the garage. They agree to take the rest on the first. It takes one phone call that she had been too tired to make alone."),
        d("abi", "I could have done that myself.", "thoughtful"),
        d("you", "I know. You didn’t have to."),
      ],
      next: "map",
    },
    abi_later: {
      setting: "kitchen",
      caption: "Wednesday evening · your flat",
      beats: [
        d("abi", "After Friday. Sure. No, that’s fair.", "sad"),
        n("She folds the bill in half, and then in half again. She gets a lift to work from a colleague who lives the other way."),
        t("After Friday you will have plenty, if you do what Vic wants. You notice how neatly those two things have joined up.", { when: { any: ["inflated", "stalling"] }, react: { you: "worried" } }),
      ],
      next: "map",
    },
    abi_friday: {
      setting: "room",
      caption: "Friday evening · your flat",
      beats: [
        n("Abi’s one night off. She has rented a film about a shark in a tornado, and made enough rice for a ward."),
        d("abi", "The car passed, by the way. I drove to work like a queen.", "warm", { when: { any: ["lent_abi", "part_abi"] } }),
        d("abi", "You’ve got fifteen hundred dollars’ worth of something on your face, and it isn’t happiness. What did it cost?", "thoughtful", { when: { all: ["bonus"] } }),
        d("abi", "You look lighter. Poorer, I’m guessing. But lighter.", "warm", { when: { any: ["told_truth", "owned_up"] } }),
        n("You watch the shark. It is terrible. You laugh until your stomach hurts, and fall asleep on the sofa before the end."),
        t("Nobody here wants anything from you. You hadn’t noticed how rare that had become."),
      ],
      next: "map",
    },
    supper: {
      setting: "kitchen",
      caption: "Sunday evening · your flat",
      beats: [
        n("Abi has cooked. Leila has brought wine, and a spreadsheet of who owes whom for the wine, which she claims is a joke."),
        d("abi", "So you’re the one who built the thing. I’ve heard about nothing else for a month.", "warm"),
        d("partner", "And you’re the one who writes EAT on the fridge. I’ve seen the lunches. Thank you.", "warm"),
        t("Two people who don’t believe what you believe, at your table, liking each other. You say grace in your head, and mean it.", { react: { you: "warm" } }),
      ],
      next: "map",
    },

    // ——— The pitch ———
    pitch: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      onStage: [],
      beats: [n("Brightwater’s boardroom smells of new carpet and old money. Six people on their side of the table. At the head sits Ms. Aldana, the finance director, with a printed copy of your deck and a pencil.")],
      next: [{ when: { all: ["path_expose"] }, to: "pitch_cold" }, { when: { all: ["inflated"] }, to: "pitch_18" }, { when: { all: ["held_line"] }, to: "pitch_11" }, { to: "pitch_blind" }],
    },
    pitch_18: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      onStage: ["vic", "partner"],
      beats: [
        n("Vic presents. She is superb. At slide fourteen, the pencil stops moving."),
        n("“Eighteen percent,” says Ms. Aldana. “Your competitors said twenty, and I didn’t believe them. Who built this?” Vic gestures to you."),
        n("“Then I’ll ask you. Is eighteen a number you would put your own money on?”"),
        t("Leila is looking at the slide. She has just seen that number for the first time.", { react: { partner: "worried" } }),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "lie", tempt: "money", label: "“Yes. It’s solid.”", money: 1500, flags: ["lied_room", "bonus"], next: "pitch_won" },
        { id: "correct", label: "“No. The model says eleven. Eighteen was mine to stop, and I didn’t.”", grow: { courage: 1, integrity: 1 }, flags: ["owned_up", "corrected_room"], next: "pitch_corrected" },
      ],
    },
    pitch_won: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods",
      beats: [
        n("“Good,” says Ms. Aldana, and makes a small tick. Twenty minutes later there are handshakes. In the lift, Vic breathes out for what seems like the first time in a month."),
        d("vic", "Fifteen hundred each, in today’s pay. You’ve earned it.", "warm"),
        n("Leila takes the stairs.", { react: { partner: "sad" } }),
        t("It is in your account before you are back at your desk. You look at the balance: {money}. You don’t feel what you thought you would.", { react: { you: "worried" } }),
      ],
      next: "map",
    },
    pitch_corrected: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      beats: [
        n("The room goes very quiet. Vic doesn’t move at all.", { react: { vic: "hurt" } }),
        n("Ms. Aldana puts her pencil down. “Thank you. Do you know how many people have sat in that chair and said yes to me?” She turns back a page. “Show me eleven. Properly, this time.”"),
        n("Leila takes them through it, line by line. They sign for a pilot: a third of the contract, and no bonus pool."),
        d("vic", "You could have told me that on Monday. In my office. Not here.", "hurt"),
        d("you", "I know. I should have. I’m sorry it was here."),
        t("You have cost her something real, and it was your own yes on Monday that made it cost so much. Both of those are true. You can breathe.", { react: { you: "thoughtful" } }),
      ],
      next: "map",
    },
    pitch_11: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      onStage: ["vic", "partner"],
      effects: { flags: ["told_truth"] },
      beats: [
        n("Vic presents the honest deck, and she is superb. At slide fourteen, the pencil stops."),
        n("“Eleven,” says Ms. Aldana. “Everyone else this week has shown me a bigger number. You are the first to show me how you got it.” She turns the page. “Go on.”"),
        n("Leila takes them through it, line by line. They sign for a pilot: a third of the contract, and no bonus pool."),
        d("vic", "A third. I can keep the team on a third. Just.", "thoughtful"),
        d("vic", "I was angry with you on Monday. I’m still deciding whether I am now.", "warm"),
      ],
      next: "map",
    },
    pitch_cold: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      onStage: ["partner"],
      beats: [
        n("Vic isn’t in the room. The managing partner presents instead, from your slides, with the eleven on them. He is smooth, and brief, and does not mention her."),
        n("Brightwater sign for a pilot. In the lift down he tells you that he appreciated your candour, and that Victoria has been asked to step back from the account while things are looked at."),
        d("partner", "You were right about the number. I’d have backed you, in her office, to her face. You didn’t give either of us the chance.", "sad"),
        t("Vic’s door is shut when you get back. The orchid has gone from the windowsill.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    pitch_blind: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      onStage: ["vic", "partner"],
      beats: [
        n("You haven’t seen the final deck. Vic locked it herself on Wednesday night."),
        n("Slide fourteen comes up. It says eighteen percent, and under it, in small grey type: Analysis by, and then your name.", { react: { you: "worried" } }),
        n("“Eighteen,” says Ms. Aldana, and looks down the table, straight at you. “Is that right?”"),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "silent", tempt: "ease", label: "Say nothing. Let Vic answer.", flags: ["silent_room"], next: "pitch_silent" },
        { id: "speak", label: "“No. The model says eleven. I should have said so before today.”", grow: { courage: 1, integrity: 1 }, flags: ["told_truth", "corrected_room"], next: "pitch_spoke" },
      ],
    },
    pitch_silent: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods",
      beats: [
        n("Vic says yes for you, warmly, and moves to the next slide. They sign. Nobody mentions a bonus to you, and you don’t ask."),
        d("partner", "That had your name on it. Did you know what it said?", "thoughtful"),
        t("You didn’t change the number. You only spent a week making sure you never had to decide.", { react: { you: "sad" } }),
      ],
      next: "map",
    },
    pitch_spoke: {
      setting: "office",
      caption: "Friday morning · Brightwater Foods, the boardroom",
      beats: [
        n("Vic’s head turns very slowly.", { react: { vic: "hurt" } }),
        n("Ms. Aldana puts her pencil down. “Then show me eleven.” Leila does, line by line. They sign for a pilot: a third of the contract."),
        d("vic", "Two days. You had two days to say that to me.", "hurt"),
        d("you", "I did. I’m sorry I used them the way I did."),
        t("It came out late, and in the wrong room. It came out."),
      ],
      next: "map",
    },
    leila_after: {
      setting: "cafe",
      caption: "Friday, after the pitch · The Lock",
      beats: [
        d("partner", "Eleven. In that room. Do you know how long I’ve wanted somebody to stand next to that number?", "warm", { when: { all: ["told_truth"], none: ["corrected_room"] } }),
        d("partner", "You said it late, and you said it in front of the client. I don’t know whether to be furious or impressed. I’m having both, with chips.", "thoughtful", { when: { all: ["corrected_room"] } }),
        d("partner", "I reran it at my desk. It’s eleven. It was always eleven. Somebody changed two assumptions on my model, and the log has your name beside them.", "sad", { when: { all: ["lied_room"] } }),
        t("She isn’t shouting. You would much rather she shouted.", { when: { all: ["lied_room"] }, react: { you: "sad" } }),
        d("partner", "So that’s what her eighteen looks like, with your name under it. You let it go straight past you.", "thoughtful", { when: { all: ["silent_room"] } }),
      ],
      next: [{ when: { any: ["took_credit", "gossiped"], none: ["leila_repaired"] }, to: "leila_truth" }, { to: "map" }],
    },
    leila_truth: {
      setting: "cafe",
      caption: "Friday, after the pitch · The Lock",
      beats: [
        d("partner", "While we’re here. Wednesday, in the boardroom. I’m not angry. I’d just like to know whether you noticed.", "thoughtful", { when: { all: ["took_credit"] } }),
        d("partner", "While we’re here. Owen knows something I said about Vic in confidence. I only ever said it to one person.", "thoughtful", { when: { all: ["gossiped"] } }),
      ],
      prompt: "What do you say?",
      choices: [
        { id: "own", label: "Tell her the truth, and say sorry without a “but”.", grow: { integrity: 1, courage: 1 }, flags: ["leila_repaired"], bond: { partner: 1 }, next: "leila_own" },
        { id: "duck", tempt: "ease", label: "“I’m not sure what you mean.”", next: "leila_duck" },
      ],
    },
    leila_own: {
      setting: "cafe",
      caption: "Friday, after the pitch · The Lock",
      beats: [
        d("you", "I knew what I was doing when I did it. I’m sorry. I’ll put it right on Monday, with the people who heard it, whether or not that helps."),
        d("partner", "Hm.", "thoughtful"),
        d("partner", "Most people here would have said “misunderstanding”. Thank you for not saying “misunderstanding”.", "warm"),
      ],
      next: "map",
    },
    leila_duck: {
      setting: "cafe",
      caption: "Friday, after the pitch · The Lock",
      beats: [d("partner", "Okay. Interesting.", "sad"), t("She means wrong. You both know she means wrong.")],
      next: "map",
    },
    fix_expenses: {
      setting: "office",
      caption: "Friday · Halden Pryce, fourteenth floor",
      effects: { money: -60, flags: ["unpadded"] },
      beats: [
        n("There is no button for giving money back. You have to email Finance, who have to ask their manager, who has never been asked before."),
        n("“You want to un-claim a taxi?” says the reply. “Is this a test?”"),
        t("Sixty dollars. It took four emails. You feel absurdly, disproportionately clean.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    drinks: {
      setting: "cafe",
      caption: "Friday evening · The Lock",
      onStage: ["vic", "owen"],
      beats: [
        n("The Lock on a Friday: the whole fourteenth floor, three deep at the bar, and Vic’s card behind it."),
        d("vic", "To Brightwater. And to never doing that again, until next quarter.", "warm", { when: { any: ["lied_room", "silent_room"] } }),
        d("vic", "To a third of Brightwater. I’ve drunk to worse.", "thoughtful", { when: { all: ["told_truth"], none: ["corrected_room"] } }),
        n("Vic is at the far end of the bar. She hasn’t spoken to you since the lift. She hasn’t left, either.", { when: { all: ["corrected_room"] } }),
        t("Everyone is celebrating a number you know isn’t true.", { when: { all: ["lied_room"] }, react: { you: "worried" } }),
      ],
      prompt: "How long do you stay?",
      choices: [
        { id: "one", label: "One drink, a proper goodbye to everyone, and the ten o’clock bus.", flags: ["one_drink"], next: "drinks_one" },
        { id: "late", tempt: "ease", label: "Stay till they close. You’ve earned it.", energy: -2, flags: ["stayed_out"], next: "drinks_late" },
      ],
    },
    drinks_one: {
      setting: "cafe",
      caption: "Friday evening · The Lock",
      beats: [
        n("You ask the new graduate what she actually wants to do, and listen to the answer. You tell Owen his tie is terrible. At ten you put your coat on."),
        d("owen", "Leaving? It’s only just started.", "warm"),
        t("It turns out you can be fully in a room and still leave it."),
      ],
      next: "map",
    },
    drinks_late: {
      setting: "room",
      caption: "Saturday, around noon · your flat",
      onStage: [],
      beats: [
        n("At midnight you are explaining the Brightwater model to a man from Legal who did not ask. At one, Vic’s card is declined, and everybody finds that very funny."),
        n("You wake on Saturday at noon with the particular loneliness of a hangover in an empty flat. Abi has left water and two tablets by the bed, and a note: EAT."),
      ],
      next: "map",
    },
    owen_coffee: {
      setting: "cafe",
      caption: "Sunday morning · The Lock",
      beats: [
        d("owen", "I’ve been trying to work out what you wanted. For Wednesday. People don’t do that for nothing.", "thoughtful"),
        d("you", "I didn’t want anything."),
        d("owen", "That’s what I can’t get past. I’d have let you sink. I told you that. And you still walked me to her door.", "sad"),
        d("owen", "I told HR the thing about Leila wasn’t true, by the way. I don’t actually know if it is. I just liked knowing things.", "thoughtful"),
        n("He pays for both coffees, and leaves a tip so large that the barista checks it isn’t a mistake."),
      ],
      next: "map",
    },

    // ——— Sunday evening ———
    reckoning: {
      setting: "room",
      caption: "Sunday evening · your flat",
      beats: [
        m("partner", "I reran Brightwater. It’s eleven. It was always eleven. Tell me you didn’t know what was on that slide.", { when: { all: ["lied_room"] } }),
        t("She built that model. It took her about ten minutes to find what you did to it.", { when: { all: ["lied_room"] }, react: { you: "worried" } }),
        m("partner", "Vic’s cleared her office. She left the orchid on my desk. I thought you should know.", { when: { all: ["path_expose"] } }),
        t("You were right about the number. You keep coming back to that, and it keeps not being enough.", { when: { all: ["path_expose"] }, react: { you: "sad" } }),
      ],
      next: "map",
    },
    confess_client: {
      setting: "room",
      caption: "Sunday evening · your flat",
      effects: { flags: ["owned_up"], payUpTo: 1500 },
      beats: [
        n("You write it four times. The first three have the word “but” in them."),
        m("you", "Ms. Aldana, on Friday you asked whether I would stand behind eighteen percent, and I said yes. The model supports eleven. The change was mine. I am writing before you rely on it, and I will tell my director tonight."),
        n("Then you ring Vic, which is harder, and tell her what you have sent. There is a long silence, and then a short, tired laugh."),
        n("Ms. Aldana replies at seven the next morning. “Thank you. Most people don’t. Bring me the eleven on Wednesday.”"),
        t("The bonus goes back. There will be a meeting about you. You sleep through the night for the first time in a week.", { react: { you: "warm" } }),
      ],
      next: "map",
    },
    counsel_femi: {
      setting: "hall",
      caption: "Sunday evening · Quayside Church",
      effects: { flags: ["told_femi"] },
      beats: [
        n("Femi is locking the side door after the evening service. He sees your face, and unlocks it again."),
        d("you", "I said yes to a number that isn’t true, in front of the client. And I took the money.", undefined, { when: { all: ["lied_room"] } }),
        d("you", "I went over her head. I didn’t even tell her I was going to.", undefined, { when: { all: ["path_expose"] } }),
        d("femi", "I will not tell you it is nothing. You would not respect me. I will tell you it is not the end of you, which is a different thing.", "warm"),
        d("femi", "Zacchaeus did not say sorry and go home. He stood up and said what he would give back. The putting right is part of the being forgiven. Not the price of it. The fruit of it.", "thoughtful", { when: { all: ["lied_room"] } }),
        d("femi", "You were right about the number. You were wrong about the woman. Go to her. Not to explain. To say sorry for the manner of it.", "thoughtful", { when: { all: ["path_expose"] } }),
        d("femi", "Shall I sit here while you do it? I have nowhere to be. I am never anywhere to be.", "warm"),
      ],
      prompt: "What do you do?",
      choices: [
        { id: "now", label: "Do it now, with Femi sitting beside you.", grow: { integrity: 1, courage: 1 }, next: [{ when: { all: ["lied_room"] }, to: "confess_client" }, { to: "peace_vic" }] },
        { id: "later", tempt: "ease", label: "“Not tonight.”", next: "counsel_later" },
      ],
    },
    counsel_later: {
      setting: "hall",
      caption: "Sunday evening · Quayside Church",
      beats: [
        d("femi", "Then tomorrow. It will keep. It will not get lighter, but it will keep.", "warm"),
        t("He doesn’t push. It is harder to carry, now that someone else knows what it weighs."),
      ],
      next: "map",
    },
    peace_vic: {
      setting: "room",
      caption: "Sunday evening · on the phone to Vic",
      effects: { flags: ["made_peace"], bond: { vic: 1 } },
      beats: [
        n("She picks up on the sixth ring. You can hear a television, and then a door closing on it."),
        d("you", "I’m not ringing to take back what I said about the number. I’m ringing because of how I said it. You asked me to my face, and I answered behind your back."),
        n("A long breath on the line.", { react: { vic: "thoughtful" } }),
        d("vic", "I’d have fought you, in my office. I might have lost. I’d have known where I stood.", "hurt"),
        d("you", "I know. I was afraid of your face. That’s all it was. I’m sorry."),
        d("vic", "I’m still angry. I’m also the one who asked you for eighteen, and I’ve had three days to think about that. Thank you for ringing. Most people would have sent an email.", "thoughtful"),
      ],
      next: "map",
    },

    // ——— Always there ———
    quay_first: {
      setting: "river",
      caption: "Evening · the Quayside",
      beats: [
        n("The quay at night: container cranes lit up like cathedrals, and the water slapping the wall. You walk until the towers are behind you."),
        t("I’m good at this job, and I’m afraid of what it’s making me good at. I don’t know what to do about Friday. I’m tired in a way that isn’t about sleep."),
        s(WALK_HUMBLY),
        n("Nothing is solved. The cranes go on working. You walk back slower than you came."),
      ],
      next: "map",
    },
    quay_again: {
      setting: "river",
      caption: "Evening · the Quayside",
      beats: [n("You walk the same stretch of wall and say the day out loud, the parts you’re proud of and the parts you aren’t. It takes as long as it takes."), t("It still helps to be heard.")],
      next: "map",
    },
    park: {
      setting: "garden",
      caption: "Quay Park",
      beats: [
        n("You eat a sandwich on a bench in Quay Park, among the pigeons and the people on conference calls. Your phone stays in your pocket for a whole half hour."),
        t("Nothing went wrong while you weren’t looking. It hardly ever does."),
      ],
      next: "map",
    },
    rest_home: {
      setting: "room",
      caption: "Your flat",
      beats: [n("You put the laptop in the wardrobe, where you can’t see it, and sleep in the afternoon with the window open."), t("The work will be exactly where you left it. For once, that is a comfort.")],
      next: "map",
    },
  },

  // How the week of the pitch turned out. The first one that fits is used.
  endings: [
    {
      id: "repair",
      when: { any: ["owned_up", "made_peace"] },
      title: "The Corrected Figure",
      kind: "A changed course",
      setting: "office",
      beats: [
        n("You changed the number. Then, with the client’s pencil pointing at you and a bonus on the table, you changed it back in front of everyone.", { when: { all: ["inflated", "corrected_room"] } }),
        n("You said yes to eighteen in that boardroom, and took the money. Then you wrote four drafts of an email, and sent the one without a “but” in it.", { when: { all: ["lied_room", "owned_up"] } }),
        n("You were right about the number, and you went round Vic to say so. Then you rang her, apologised for the manner of it, and kept what you had said.", { when: { all: ["made_peace"] } }),
        n("You didn’t do it alone. Femi sat beside you in an empty church while you did it, and said nothing at all.", { when: { all: ["told_femi"] } }),
        n("There was a meeting about you. It was not comfortable. Leila came to it uninvited, and sat down.", { when: { all: ["owned_up"] } }),
        n("Vic came back to the account after three weeks. She is not your friend. She has started asking for your numbers first, and reading them twice.", { when: { all: ["made_peace"] } }),
        n("You are not the analyst who never got it wrong. You are learning to be the one who goes back and corrects the figure."),
      ],
      scripture: {
        reference: "Luke 19:8",
        translation: WEB,
        text: "Zacchaeus stood and said to the Lord, “Behold, Lord, half of my goods I give to the poor. If I have wrongfully exacted anything of anyone, I restore four times as much.”",
        contextTitle: "In context",
        context: [
          "Zacchaeus was a tax collector who had grown rich by rounding in his own favour. Jesus had already invited himself to dinner before any of this was said. The welcome came first.",
          "Giving it back is not how Zacchaeus earns his place at the table. It is what a person does once they are no longer afraid of losing it.",
        ],
      },
      questions: ["Is there a figure, a claim or a story of yours that needs correcting?", "What would putting it right actually involve, beyond feeling sorry?"],
    },
    {
      id: "expose",
      when: { all: ["path_expose"] },
      title: "Right, in Writing",
      kind: "An unfinished ending",
      setting: "office",
      beats: [
        n("The number was wrong, and you were right to refuse it. You said so to the managing partner, in an email, without telling Vic."),
        n("She has been moved off the account. People are careful around you now. They copy you into things. They stop talking when you come into the kitchen."),
        n("Leila still sits beside you. She says “interesting” a great deal."),
        n("Being right about a thing is not the same as being loving in it. Some wrongs do have to go higher. This one could have gone to her first. Her number is still in your phone."),
      ],
      scripture: GO_FIRST,
      questions: ["Is there someone you have dealt with in writing because their face was too hard?", "What would you say if you had to say it across a desk?"],
    },
    {
      id: "hidden",
      when: { all: ["lied_room"] },
      title: "Eighteen Percent",
      kind: "An unresolved road",
      setting: "room",
      beats: [
        n("Brightwater signed. The bonus cleared. There is talk of making you senior in the spring."),
        n("Abi’s car is fixed, and you helped pay for it. She thanked you, and then looked at you a little too long.", { when: { any: ["lent_abi", "part_abi"] } }),
        n("Leila knows. She has not reported it. She has stopped asking you to check her work, and started checking yours."),
        n("In March, Brightwater’s savings will come in at eleven, and someone will be asked why. You have started staying late, so that you will not have to walk past Femi’s desk while he is on it."),
        n("Nothing has collapsed. That is the heavy part. But Ms. Aldana’s address is in your sent folder, and a correction has no closing date."),
      ],
      scripture: {
        reference: "Mark 8:36",
        translation: WEB,
        text: "For what does it profit a man, to gain the whole world, and forfeit his life?",
        contextTitle: "In context",
        context: [
          "Jesus has just told his friends that following him will cost them, and asks what the alternative is really worth. The word translated “life” means the self: the person you are.",
          "He isn’t sneering at success. He is asking what will be left of you to enjoy it.",
        ],
      },
      questions: ["What have you won that you can’t enjoy, because of how you won it?", "Who are you avoiding, and what do they remind you of?"],
    },
    {
      id: "truth",
      when: { all: ["told_truth"] },
      title: "Eleven Percent",
      kind: "An honest ending",
      setting: "office",
      beats: [
        n("You told Vic no to her face, in her own office, and then built her the best honest slide you could.", { when: { all: ["held_line"] } }),
        n("You left it late. You let the week go by without answering, and then said it in the worst possible room. But you said it.", { when: { all: ["corrected_room"] } }),
        n("Brightwater signed for a third of what they might have. There was no bonus. The team kept their jobs, narrowly."),
        n("In March the savings came in at eleven point four. Ms. Aldana rang Vic herself, and asked for the same team on the next one, by name."),
        n("Vic has never said you were right. She has started sending you the numbers first."),
      ],
      scripture: {
        reference: "Ephesians 4:25",
        translation: WEB,
        text: "Therefore putting away falsehood, speak truth each one with his neighbor. For we are members of one another.",
        contextTitle: "In context",
        context: [
          "Paul is describing what changes when people belong to one another. Truth-telling comes first on his list, and the reason he gives is not a rule but a relationship: you don’t lie to part of your own body.",
          "At work, that means everyone’s name is on what you say, and not only your own.",
        ],
      },
      questions: ["Where at work is there a number, or a sentence, you would not want pulled on?", "Whose name is on your work besides yours?"],
    },
    {
      id: "silent",
      title: "Somebody Else’s Number",
      kind: "A week that ran out",
      setting: "office",
      beats: [
        n("Vic asked you a question, and you never answered it. On Wednesday night she changed the number herself.", { when: { all: ["did:ask"] } }),
        n("All week Vic wanted five minutes, and all week you were somewhere else. On Wednesday night she changed the number herself.", { when: { none: ["did:ask"] } }),
        n("On Friday it was on the screen with your name beneath it. A finance director asked you whether it was right, and you let someone else say yes."),
        n("You didn’t lie. You only arranged the week so that you would never have to choose. It is a skill, and this building rewards it."),
        n("In March the savings will come in at eleven. The slide still has your name on it. The next question will be put to you directly, and you can answer it out loud."),
      ],
      scripture: {
        reference: "James 1:5",
        translation: WEB,
        text: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.",
        contextTitle: "In context",
        context: [
          "James is writing to people under pressure who don’t know what to do next. He doesn’t tell them to work it out alone, or to wait until they feel ready. He tells them to ask, and promises that God gives without scolding them for needing to.",
        ],
      },
      questions: ["What decision are you making by not making it?", "Who could you ask for wisdom before the week runs out?"],
    },
  ],

  // Things to keep. Each is earned by how a week went, and collected across weeks.
  keepsakes: [
    { id: "h_slide", icon: "📊", name: "Slide fourteen, the honest version", when: { all: ["told_truth"] }, text: "Eleven percent, with every line of working underneath it." },
    { id: "h_reply", icon: "✉️", name: "A reply from Ms. Aldana", when: { all: ["owned_up"] }, text: "“Thank you. Most people don’t.”" },
    { id: "h_voicemail", icon: "📞", name: "A voicemail from Vic", when: { all: ["made_peace"] }, text: "“I’m still angry. Thank you for ringing.”" },
    { id: "h_mug", icon: "☕", name: "Leila’s second-best mug", when: { all: ["gave_credit"] }, text: "It says WORLD’S OKAYEST ANALYST. She says you have earned the loan of it." },
    { id: "h_lunch", icon: "🥪", name: "A lunch, paid for", when: { all: ["shared_faith"] }, text: "Leila has never bought anyone lunch before. “For an interesting answer.”" },
    { id: "h_sorry", icon: "🤝", name: "A coffee, accepted", when: { all: ["leila_repaired"] }, text: "You said sorry without a “but”. She let you buy the next one." },
    { id: "h_fridge", icon: "🍚", name: "A note from the fridge", when: { any: ["did:abi_dinner", "did:abi_friday"] }, text: "EAT, in Abi’s capitals. You have taken it to work." },
    { id: "h_iou", icon: "🚗", name: "An IOU on the fridge", when: { all: ["lent_abi"] }, text: "I O U 250. Underneath, smaller: thank you." },
    { id: "h_lid", icon: "🫖", name: "The lid of Femi’s flask", when: { all: ["femi_talk"] }, text: "He gave you the lid to drink from. “The lift always comes back.”" },
    { id: "h_taxi", icon: "🚕", name: "A taxi you didn’t claim", when: { any: ["clean_expenses", "unpadded"] }, text: "A blank line on a form. Nobody will ever know. You do." },
    { id: "h_card", icon: "🖨️", name: "A card from Owen", when: { all: ["helped_owen"] }, text: "“I’d have let you sink. Thank you for not being me.”" },
    { id: "h_pebble", icon: "🪨", name: "A stone from the quay", when: { all: ["prayed"] }, text: "Picked up under the cranes. It sits on your monitor stand now." },
    { id: "h_sheet", icon: "📖", name: "Sunday’s notice sheet", when: { all: ["did:service"] }, text: "In the margin, in your writing: an act of worship, or an act of fear." },
    { id: "h_ticket", icon: "🚌", name: "A bus ticket, 10:04 p.m.", when: { all: ["one_drink"] }, text: "You were fully in the room. Then you went home." },
  ],

  // The other strands of the week. Each beat that fits is shown.
  threads: [
    {
      title: "Leila",
      beats: [
        n("In front of three partners, you said whose model it was. Leila talked for nine minutes without notes. Two of them have since asked for her by name.", { when: { all: ["gave_credit"] } }),
        n("You wronged Leila this week, and then told her so, without the word “misunderstanding”. She is a little careful with you still. Trust comes back more slowly than it leaves, but it is coming back.", { when: { all: ["leila_repaired"] } }),
        n("The partners think you built Leila’s model. She knows you let them. She has not raised it. She holds doors for you, very politely.", { when: { all: ["took_credit"], none: ["leila_repaired"] } }),
        n("Something Leila told you in confidence is doing the rounds of the kitchen. She has worked out the route it took.", { when: { all: ["gossiped"], none: ["leila_repaired"] } }),
        n("You told Vic by the lifts whose model it was. She said she would mention it. The partners still think it was yours.", { when: { all: ["credit_later"] } }),
        n("Leila asked why, and you told her without a sermon. She isn’t persuaded. She has, she says, updated her priors.", { when: { all: ["shared_faith"] } }),
        n("You sat up late with Leila over her model, and watched what it looks like to make a number true and then stand next to it.", { when: { all: ["built_together"], none: ["gave_credit", "took_credit", "shared_faith"] } }),
      ],
    },
    {
      title: "Owen",
      beats: [
        n("You walked Owen to Vic’s door and stood beside him while he owned up. He would have let you sink, and says so. He has stopped trading stories in the kitchen.", { when: { all: ["helped_owen"] } }),
        n("You told Owen you couldn’t be anywhere near it. He was gone by Friday. You didn’t push him. You think about the ten minutes he stood by the printer.", { when: { all: ["left_owen"] } }),
        n("You reported Owen’s mistake before he could. Every word was true. The senior slot is yours to lose now, and you can’t quite enjoy that.", { when: { all: ["sank_owen"] } }),
        n("You wouldn’t trade stories with Owen in the kitchen. It cost you a little warmth, and the kitchen noticed.", { when: { all: ["no_gossip"] } }),
        n("Owen sent a client’s deck to their rival, and spent Wednesday morning by the printer waiting for someone to talk to. He was gone by Friday. You heard about it in the kitchen.", { when: { none: ["did:owen_mess"] } }),
      ],
    },
    {
      title: "Abi",
      beats: [
        n("You lent Abi the whole of it without conditions. She paid you back on the first, in an envelope marked EAT.", { when: { all: ["lent_abi"] } }),
        n("You gave Abi what you could, and sat with her while she made the call she was too tired to make alone. The car passed.", { when: { all: ["part_abi"] } }),
        n("You told Abi to ask again after Friday. She got lifts all week from a colleague who lives the other way. She hasn’t mentioned it. She wouldn’t.", { when: { all: ["refused_abi"] } }),
        n("You and Abi passed in the hallway all week. The note on the fridge still says EAT. On Thursday she added a question mark.", { when: { none: ["did:abi_dinner", "did:abi_car", "did:abi_friday", "did:supper"] } }),
      ],
    },
    {
      title: "Small things",
      beats: [
        n("You left the taxi line empty. Nobody noticed. You find that you did.", { when: { all: ["clean_expenses"] } }),
        n("You claimed sixty dollars for a taxi you didn’t take, and then spent four emails giving it back. Finance still think it was a test.", { when: { all: ["unpadded"] } }),
        n("Sixty dollars for a taxi you didn’t take is in your account. It was approved by a system that approves everything. Finance would take it back, if anyone asked them to.", { when: { all: ["padded"], none: ["unpadded"] } }),
        n("Femi told you to go to her first, and alone. You have thought about that sentence most days since.", { when: { all: ["femi_counsel"] } }),
        n("You drank tea from the lid of Femi’s flask. He says the lift always comes back.", { when: { all: ["femi_talk"], none: ["femi_counsel"] } }),
        n("You walked past the front desk ten times this week. Femi said good morning each time. He will on Monday.", { when: { none: ["femi_talk"] } }),
      ],
    },
    {
      title: "Rest",
      beats: [
        n("You stopped. On the quay, in a side chapel, on a park bench, or on a sofa in front of a very bad film. The work was exactly where you left it.", { when: { any: RESTED } }),
        n("You never stopped once this week. Everything you did, you did tired. Rest was on the map the whole time; it is allowed.", { when: { none: RESTED } }),
        n("You stayed till midnight on Wednesday aligning text boxes. Nobody mentioned it. That was not, you suspect, why you did it.", { when: { all: ["overworked"] } }),
        n("You went in on Sunday. You got a great deal done, and nobody knows.", { when: { all: ["sunday_worked"] } }),
      ],
    },
  ],
};
