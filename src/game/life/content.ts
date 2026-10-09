import type { Look, Scripture } from "../types";
import { WEB } from "../stories/kit";
import {
  ageOf,
  applyEffects,
  count,
  has,
  hasStillPlace,
  MAX_ENERGY,
  owns,
  since,
  TIME_PER_SEASON,
  yearOf,
  type Child,
  type LifeEffects,
  type LifeEvent,
  type LifeState,
  type Me,
  type Prayer,
} from "./model";

// Everything that can happen on Juniper Lane: the people, what there is to do
// in a season, the things life brings to the door, and the prayer list.
//
// Scripture is quoted from the World English Bible, with its context, and is
// never used as a punishment. Nobody here is a villain.

// ——— People ———

export interface Person {
  id: string;
  name: string;
  pronouns: { he: string; him: string; his: string };
  look: Look;
  about: string;
}

const HE = { he: "he", him: "him", his: "his" };
const SHE = { he: "she", him: "her", his: "her" };

/** The two people the player might come to love, depending on who the player is. */
export const CANDIDATES: Record<string, Person[]> = {
  naomi: [
    { id: "samuel", name: "Samuel", pronouns: HE, about: "A carpenter. Says little, means all of it, and can fix anything except his own timekeeping.", look: { skin: "#8E5B3C", shade: "#774A30", hair: "#17110F", hairStyle: "short", top: "#55704F", topStyle: "collar", accent: "#E8DCC8", beard: true, manner: "steady", stance: "pockets", build: { height: 1.05, shoulders: 114, hips: 90, limbs: 22 }, legs: "#2B3A55", shoes: "#3A2A20" } },
    { id: "isaac", name: "Isaac", pronouns: HE, about: "Teaches eight-year-olds. Funny, kind, and never once on time for anything.", look: { skin: "#DDB092", shade: "#C59676", hair: "#4A3122", hairStyle: "curly", top: "#3F5A7A", topStyle: "cardigan", accent: "#E8DCC8", glasses: true, manner: "lively", stance: "wave", build: { height: 1.03, shoulders: 104, hips: 86, limbs: 20 }, legs: "#6B5A45", shoes: "#3A2A20" } },
  ],
  caleb: [
    { id: "hannah", name: "Hannah", pronouns: SHE, about: "A nurse on the children’s ward. Practical, direct, and laughs at her own jokes first.", look: { skin: "#7E4E33", shade: "#683D26", hair: "#17110F", hairStyle: "bun", top: "#2F6F73", topStyle: "plain", accent: "#F4EBDD", lip: "#5A2420", earrings: true, slim: true, manner: "brisk", stance: "hip", build: { height: 0.98, shoulders: 92, hips: 88, limbs: 18 }, legs: "#2A2F3A", shoes: "#E8DCC8" } },
    { id: "miriam", name: "Miriam", pronouns: SHE, about: "Runs the bakery on Mill Street. Generous, stubborn, and sings while she works.", look: { skin: "#E0B596", shade: "#C89B7B", hair: "#6B4630", hairStyle: "wavy", top: "#A8553A", topStyle: "cardigan", accent: "#F4EBDD", lip: "#8A3A32", slim: true, manner: "warm", stance: "clasped", build: { height: 0.97, shoulders: 90, hips: 88, limbs: 18 }, skirt: "#3F3345", longSkirt: true, shoes: "#3A2420" } },
  ],
};

export const WALT: Look = { skin: "#E3BC98", shade: "#CBA17E", hair: "#BDB7B0", hairStyle: "short", top: "#6B5A45", topStyle: "cardigan", accent: "#C9D4E0", glasses: true, manner: "calm", stance: "pockets", build: { height: 0.99, shoulders: 104, hips: 96, limbs: 21 }, legs: "#3A3F4A", shoes: "#3A2A20" };

export function candidatesFor(me: Me): Person[] {
  return CANDIDATES[me.base] ?? CANDIDATES.naomi;
}

export function partnerOf(state: LifeState, me: Me): Person | null {
  return candidatesFor(me).find((person) => person.id === state.partner) ?? null;
}

/** Fills {you}, {partner}, {he}, {him}, {his}, {He}, {child}, {eldest} and {pet} in a line. */
export function say(text: string, state: LifeState, me: Me): string {
  const partner = partnerOf(state, me);
  const cap = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
  const words: Record<string, string> = {
    you: me.name.trim() || "you",
    partner: partner?.name ?? "someone",
    he: partner?.pronouns.he ?? "they",
    him: partner?.pronouns.him ?? "them",
    his: partner?.pronouns.his ?? "their",
    He: cap(partner?.pronouns.he ?? "they"),
    His: cap(partner?.pronouns.his ?? "their"),
    child: state.children[state.children.length - 1]?.name ?? "the little one",
    eldest: state.children[0]?.name ?? "the little one",
    pet: state.pet?.name ?? "the dog",
    money: `$${state.money}`,
  };
  return text.replace(/\{(\w+)\}/g, (match, key: string) => words[key] ?? match);
}

// ——— Scripture ———

const passage = (reference: string, text: string, ...context: string[]): Scripture => ({ reference, translation: WEB, text, contextTitle: "In context", context });

const BUILDS_THE_HOUSE = passage(
  "Psalm 127:1",
  "Unless Yahweh builds the house, they labor in vain who build it. Unless Yahweh watches over the city, the watchman guards it in vain.",
  "This is a song for people on their way to worship, and it is about ordinary work: building, guarding, raising a family. It does not say the work is pointless. It says the work was never meant to be done alone.",
  "The house in the psalm is more than walls. It is the household: the life lived inside them."
);
const CONTENT = passage(
  "Hebrews 13:5",
  "Be free from the love of money, content with such things as you have, for he has said, “I will in no way leave you, neither will I in any way forsake you.”",
  "The writer gives a reason for contentment, and it is not that things don’t matter. It is that you have already been promised the one thing you can’t buy: that you won’t be left.",
  "A sofa is not a sin. The verse is about what you are counting on to make you safe."
);
const ENOUGH = passage(
  "1 Timothy 6:6–8",
  "But godliness with contentment is great gain. For we brought nothing into the world, and we certainly can’t carry anything out. But having food and clothing, we will be content with that.",
  "Paul is warning a young pastor about people who treat faith as a way of getting rich. He turns the sum around: the gain is the contentment itself.",
  "He isn’t against earning. He is asking what “enough” would look like, and whether you would recognise it."
);
const PEACE_WITH_ALL = passage(
  "Romans 12:18",
  "If it is possible, as much as it is up to you, be at peace with all men.",
  "Paul is realistic. He says “if it is possible”, because sometimes it isn’t, and “as much as it is up to you”, because the other person gets a say.",
  "Your part is still yours. With a neighbour, it usually starts with a knock on a door."
);
const SUN_GO_DOWN = passage(
  "Ephesians 4:26",
  "“Be angry, and don’t sin.” Don’t let the sun go down on your wrath,",
  "Paul assumes people who love each other will be angry sometimes. He doesn’t forbid the anger. He puts a time limit on it.",
  "It is less a rule about bedtime than a warning about what a grievance turns into when it is kept overnight."
);
const WAIT = passage(
  "Psalm 27:14",
  "Wait for Yahweh. Be strong, and let your heart take courage. Yes, wait for Yahweh.",
  "David says “wait” twice, as though he needed to hear it himself. The psalm doesn’t promise how the waiting ends. It promises who is in it with you.",
  "Waiting, in the Bible, is not doing nothing. It is refusing to conclude that God has left."
);
const ANXIOUS = passage(
  "Philippians 4:6–7",
  "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
  "Paul writes this from prison. He doesn’t promise that the thing asked for will be given. He promises a peace that stands guard over the person asking.",
  "It is an invitation to say the whole worry out loud to someone who can bear it."
);
const LEARNED_CONTENT = passage(
  "Philippians 4:11–13",
  "Not that I speak because of lack, for I have learned in whatever state I am, to be content in it. I know how to be humbled, and I know also how to abound. In everything and in all things I have learned the secret both to be filled and to be hungry, both to abound and to be in need. I can do all things through Christ, who strengthens me.",
  "The famous last line is about contentment, not achievement. “All things” means having plenty and having little, and being the same person in both.",
  "Paul says he learned it. It did not come naturally to him, either."
);
const CHEERFUL = passage(
  "2 Corinthians 9:7",
  "Let each man give according as he has determined in his heart; not grudgingly, or under compulsion; for God loves a cheerful giver.",
  "Paul is collecting for hungry Christians in another city. He refuses to pressure anyone: a gift squeezed out of someone is not the kind he wants.",
  "Giving here is not a payment, and not an investment. It is what gratitude does when it has something in its hands."
);
const DONT_FORGET = passage(
  "Deuteronomy 8:10–11",
  "You shall eat and be full, and you shall bless Yahweh your God for the good land which he has given you. Beware lest you forget Yahweh your God, in not keeping his commandments, and his ordinances, and his statutes, which I command you today;",
  "Moses is speaking to people about to become comfortable for the first time in their lives. His worry is not that they will suffer. It is that they will be full, and forget.",
  "The answer to plenty, he says, is thanks."
);
const NOT_ABUNDANCE = passage(
  "Luke 12:15",
  "He said to them, “Beware! Keep yourselves from covetousness, for a man’s life doesn’t consist of the abundance of the things which he possesses.”",
  "Jesus says this to a man in the middle of a family argument about an inheritance. He declines to settle the argument, and speaks to what is underneath it.",
  "He is not saying things are bad. He is saying they are not what a life is made of."
);
const REST_AWHILE = passage(
  "Mark 6:31",
  "He said to them, “You come apart into a deserted place, and rest awhile.” For there were many coming and going, and they had no leisure so much as to eat.",
  "The disciples have just come back from their first mission, full of stories. There is real need all around them. Jesus looks at them and prescribes rest.",
  "Saying no to a good thing is sometimes obedience."
);
const FORGIVING = passage(
  "Ephesians 4:32",
  "And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.",
  "Paul gives the measure for forgiveness, and it is not what the other person deserves. It is what you have already been given.",
  "Releasing a debt is not saying it didn’t matter. It is deciding not to be its collector."
);
const HERITAGE = passage(
  "Psalm 127:3",
  "Behold, children are a heritage of Yahweh. The fruit of the womb is his reward.",
  "The same psalm that begins with building a house ends with children. “Heritage” and “reward” are words for a gift, not for wages: nothing here is earned.",
  "It is said about every child, however they come into a family."
);
const ON_THE_ROCK = passage(
  "Matthew 7:24–25",
  "Everyone therefore who hears these words of mine, and does them, I will liken him to a wise man, who built his house on a rock. The rain came down, the floods came, and the winds blew, and beat on that house; and it didn’t fall, for it was founded on the rock.",
  "This is how Jesus ends the Sermon on the Mount. Both houses in the story get the storm. The difference is underneath, where nobody looks.",
  "The foundation, he says, is not hearing his words. It is doing them."
);
const ROOMS_FILLED = passage(
  "Proverbs 24:3–4",
  "Through wisdom a house is built; by understanding it is established; by knowledge the rooms are filled with all rare and beautiful treasure.",
  "Proverbs likes a well-made home, and isn’t embarrassed by beautiful things. But it names what the house is really built from.",
  "The treasure that fills the rooms may be furniture. More often it is the people in them."
);
const NEW_EVERY_MORNING = passage(
  "Lamentations 3:22–23",
  "It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning. Great is your faithfulness.",
  "These lines sit in the middle of the saddest book in the Bible, written in the ruins of a city. They are not said by someone whose year went well.",
  "Faithfulness here is God’s, not the writer’s. That is why it can be counted on."
);
const SEEK_FIRST = passage(
  "Matthew 6:33–34",
  "But seek first God’s Kingdom, and his righteousness; and all these things will be given to you as well. Therefore don’t be anxious for tomorrow, for tomorrow will be anxious for itself. Each day’s own evil is sufficient.",
  "Jesus has been talking about food and clothes, the things people lie awake over. He doesn’t call them unimportant. He says your Father knows you need them.",
  "“First” is about order, not about bargaining. It is not a method for getting the other things."
);
const TWO_ARE_BETTER = passage(
  "Ecclesiastes 4:9–10",
  "Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow; but woe to him who is alone when he falls, and doesn’t have another to lift him up.",
  "The Teacher is talking about companionship of every kind: friends, fellow workers, a husband and wife. His reason is very practical. People fall over.",
  "It is as true of a good neighbour as of a marriage."
);
const AS_CALLED = passage(
  "1 Corinthians 7:17",
  "Only, as the Lord has distributed to each man, as God has called each, so let him walk. So I command in all the assemblies.",
  "Paul, who was single, is writing to a church anxious about whether married or unmarried people are doing it right. His answer is that neither is the waiting room for the other.",
  "A life is not on hold until someone arrives."
);
const HE_LISTENS = passage(
  "1 John 5:14",
  "This is the boldness which we have toward him, that, if we ask anything according to his will, he listens to us.",
  "John’s promise is about being heard. He calls it boldness: the confidence of a child who knows they may walk in and ask.",
  "It is not a formula. Prayer is talking with a Father, and fathers answer in more than one way: yes, not yet, and sometimes something you didn’t know to ask for."
);
const BEAR_BURDENS = passage(
  "Galatians 6:2",
  "Bear one another’s burdens, and so fulfill the law of Christ.",
  "Paul is describing what a church is for. The “law of Christ” is love, and one of its plainest forms is letting other people carry what is too heavy for you.",
  "Needing help is not a failure of faith. Refusing it can be a quiet kind of pride."
);
const STRANGERS = passage(
  "Hebrews 13:2",
  "Don’t forget to show hospitality to strangers, for in doing so, some have entertained angels without knowing it.",
  "The word translated “hospitality” means, literally, love of the stranger. It is one of the plain instructions at the end of a long letter.",
  "A table is the oldest way there is of telling someone they are welcome."
);
const READY_ANSWER = passage(
  "1 Peter 3:15",
  "But sanctify the Lord God in your hearts; and always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear…",
  "Peter is writing to Christians who are a small, misunderstood minority. He doesn’t tell them to win arguments. He assumes people will ask, because of how they live, and that the answer will be given gently."
);
const LENDS = passage(
  "Proverbs 19:17",
  "He who has pity on the poor lends to Yahweh; he will reward him.",
  "Proverbs puts kindness to someone in need in startling terms: God counts it as a loan to himself.",
  "The point is not that generosity pays. It is that the person in front of you matters that much to God."
);

// ——— What there is to do in a season ———

export interface Outcome {
  effects?: LifeEffects;
  then?: (state: LifeState) => LifeState;
  text: string[];
  scripture?: Scripture;
  /** An event to play straight away. */
  event?: string;
  /** Opens the prayer journal afterwards. */
  journal?: boolean;
}

export interface Activity {
  id: string;
  group: "Work and money" | "People" | "Faith" | "Rest";
  title: string;
  blurb: string;
  /** Time it takes. Zero means it can be done alongside everything else. */
  time: number;
  /** How many times it can be done in one season. */
  limit: number;
  /** Energy it needs, and uses. */
  tiring?: number;
  /** Money it needs, and uses. */
  costs?: number;
  /** Money it brings in, for showing on the card. */
  earns?: (state: LifeState) => number;
  tempt?: "money" | "ease";
  show: (state: LifeState, me: Me) => boolean;
  run: (state: LifeState, me: Me) => Outcome;
}

/** Picks the line for the nth time something is done; the last line repeats. */
const nth = (lines: string[], times: number) => lines[Math.min(times, lines.length - 1)];
const rotate = (lines: string[], times: number) => lines[times % lines.length];
const eldestAge = (state: LifeState) => (state.children[0] ? ageOf(state, state.children[0]) : 0);

export const ACTIVITIES: Activity[] = [
  {
    id: "work",
    group: "Work and money",
    title: "Go to work",
    blurb: "It pays the mortgage. Some days that is all it does, and that is enough.",
    time: 1,
    limit: 2,
    tiring: 1,
    earns: (state) => state.pay,
    show: () => true,
    run: (state) => {
      const times = count(state, "work");
      // Four raises, over the first few years; after that, promotions come as events.
      const raise = times % 6 === 5 && times < 24;
      return {
        effects: { money: state.pay, pay: raise ? 60 : 0, grow: times === 3 ? { integrity: 1 } : undefined },
        text: [
          rotate(
            [
              "An ordinary day. You do the work in front of you, and you do it properly. Nobody claps.",
              "A long one. On the way out, someone thanks you for something you had forgotten doing.",
              "You cover for a colleague whose little boy is ill. She will do the same for you one day. Probably.",
              "The kind of day that pays the mortgage and does nothing else. That is not nothing.",
              "You find a mistake that would have been easy to leave. You fix it, and tell the person whose mistake it was, quietly.",
            ],
            times
          ),
          ...(raise ? ["At the end of the week your manager calls you in. A small raise: sixty dollars more each time, “for being someone I don’t have to check up on.”"] : []),
        ],
      };
    },
  },
  {
    id: "overtime",
    group: "Work and money",
    title: "Take the extra shifts",
    blurb: "The money is real. So is what it costs.",
    time: 1,
    limit: 1,
    tiring: 2,
    tempt: "money",
    earns: (state) => Math.round(state.pay * 0.8),
    show: (state) => count(state, "work") >= 1,
    run: (state) => {
      const lonely = (state.stage === "married" || state.children.length > 0) && count(state, "overtime") % 2 === 1;
      return {
        effects: { money: Math.round(state.pay * 0.8), bond: lonely ? { partner: -1, kids: -1 } : undefined, flags: ["worked_late"] },
        text: [
          "Extra shifts, back to back. The payslip is very pleasing. You come home after dark three nights running.",
          ...(lonely ? ["There is a plate in the oven and a house already asleep. Nobody complains. That is not quite the same as nobody minding."] : []),
        ],
      };
    },
  },
  {
    id: "pay_extra",
    group: "Work and money",
    title: "Pay $200 extra off the mortgage",
    blurb: "A little less owed. It adds up.",
    time: 0,
    limit: 3,
    costs: 200,
    show: (state) => state.mortgage > 0,
    run: () => ({ effects: { mortgage: -200 }, text: ["You send two hundred dollars more than you had to, and watch the number go down. It is a very quiet kind of satisfaction."] }),
  },
  {
    id: "give",
    group: "Faith",
    title: "Give some money away",
    blurb: "To the church’s hardship fund, with no strings and no receipt.",
    time: 0,
    limit: 1,
    costs: 60,
    show: (state) => count(state, "church") >= 1,
    run: (state) => ({
      effects: { grow: count(state, "give") === 0 || count(state, "give") === 4 ? { compassion: 1 } : undefined },
      text: [
        nth(
          [
            "You put sixty dollars in the envelope marked “for whoever needs it”. You will never find out who that was. You find you like not knowing.",
            "Sixty dollars, in the same envelope. Nothing comes back for it. That was never what it was for.",
            "You give again. It has become ordinary, like paying a bill, except that this one makes you glad.",
          ],
          count(state, "give")
        ),
      ],
      scripture: count(state, "give") === 0 ? CHEERFUL : undefined,
    }),
  },
  {
    id: "church",
    group: "Faith",
    title: "Sunday at Juniper Lane Chapel",
    blurb: "A tin roof, sixty people, and tea strong enough to stand a spoon in.",
    time: 1,
    limit: 1,
    show: () => true,
    run: (state, me) => {
      const times = count(state, "church");
      const meet = state.stage === "single" && !has(state, "met") && times >= 1;
      const pair = candidatesFor(me);
      return {
        effects: { energy: 1, bond: { church: 1 }, grow: times === 2 || times === 7 ? { wisdom: 1 } : undefined, flags: meet ? ["met"] : [] },
        text: [
          rotate(
            [
              "You sit near the back. The singing is loud and not especially good. Something in you unclenches anyway.",
              "The sermon is about ordinary Tuesdays. You think about it on Tuesday.",
              "An old woman called Mrs. Abara takes your hand in both of hers and asks how you are, and then waits for the actual answer.",
              "Communion. Bread from the bakery on Mill Street, torn, not cut. You have nothing to bring to it. That appears to be the idea.",
            ],
            times
          ),
          ...(meet
            ? [
                `Afterwards, over the tea, you end up talking to two people you have somehow never spoken to. ${pair[0].name}: ${pair[0].about.charAt(0).toLowerCase()}${pair[0].about.slice(1)} And ${pair[1].name}: ${pair[1].about.charAt(0).toLowerCase()}${pair[1].about.slice(1)}`,
                "Nothing has to come of it. You notice that you are still thinking about the conversation when you get home.",
              ]
            : []),
        ],
      };
    },
  },
  {
    id: "pray",
    group: "Faith",
    title: "Pray",
    blurb: "No agenda. Tell God the truth, and stay a while.",
    time: 1,
    limit: 1,
    show: () => true,
    run: (state) => {
      const times = count(state, "pray");
      return {
        effects: { energy: hasStillPlace(state) ? 2 : 1, grow: times === 0 || times === 3 || times === 8 ? { trust: 1 } : undefined },
        text: [
          hasStillPlace(state) ? "You sit in the place you have made for it, and for a while you don’t say anything at all." : "You sit on the stairs, because that is where you happened to be, and for a while you don’t say anything at all.",
          rotate(
            [
              "Then you say the true things, including the ones that aren’t very spiritual. Nothing answers out loud. You get up lighter than you sat down.",
              "You run out of words quite quickly. You stay anyway. That seems to count.",
              "You pray for people by name, and find you can’t stay annoyed with someone while you are doing it.",
              "Mostly, today, you say thank you. It takes longer than you expected.",
            ],
            times
          ),
        ],
        scripture: times === 0 ? HE_LISTENS : undefined,
        journal: true,
      };
    },
  },
  {
    id: "serve",
    group: "Faith",
    title: "Help at the food bank",
    blurb: "Saturday morning, the chapel hall. Somebody has to carry the tins.",
    time: 1,
    limit: 1,
    tiring: 1,
    show: (state) => count(state, "church") >= 1,
    run: (state) => ({
      effects: { bond: { church: 1 }, grow: [0, 3, 7].includes(count(state, "serve")) ? { compassion: 1 } : undefined },
      text: [
        rotate(
          [
            "You carry tins, and then you stop carrying tins and listen to a man explain exactly how he came to need them. He isn’t asking for anything. He wants someone to know.",
            "A woman takes one bag and tries to give half of it back, “for someone who needs it more”. You have to argue her out of it.",
            "It is cold in the hall, and the urn is broken. Nobody goes home early.",
          ],
          count(state, "serve")
        ),
      ],
    }),
  },
  {
    id: "walt",
    group: "People",
    title: "Knock next door",
    blurb: "Walt, at number 12. Forty years on the Lane, and opinions about your bins.",
    time: 1,
    limit: 1,
    show: () => true,
    run: (state) => ({
      effects: { bond: { walt: 1 }, grow: count(state, "walt") === 2 ? { compassion: 1 } : undefined },
      text: [
        nth(
          [
            "Walt answers the door in his slippers and tells you your bins are out on the wrong day. By his standards it is a warm welcome.",
            "He shows you his tomatoes. All of them. Individually.",
            "He mentions Jean for the first time. Forty-one years. Then he changes the subject to guttering, and you let him.",
            "He asks, gruffly, what it is you actually do on a Sunday morning. He listens to the answer without interrupting, which is not like him.",
            "You don’t knock any more. He leaves the side gate open, and there is usually a second mug out.",
          ],
          state.bonds.walt
        ),
      ],
    }),
  },
  {
    id: "host",
    group: "People",
    title: "Have people round for dinner",
    blurb: "Whoever will come. Walt will say he’s busy, and then come.",
    time: 1,
    limit: 1,
    tiring: 1,
    costs: 40,
    show: (state) => owns(state, "table"),
    run: (state) => ({
      effects: { bond: { walt: 1, church: 1 }, grow: count(state, "host") === 0 || count(state, "host") === 3 ? { compassion: 1 } : undefined },
      text: [
        rotate(
          [
            "Six people at a table meant for four. Walt brings tomatoes and a complaint about the parking. Mrs. Abara asks him about Jean, and he talks for twenty minutes.",
            "You burn the rice. Nobody cares. Somebody’s teenager does the washing up without being asked, and the whole table pretends not to notice.",
            "A man from the food bank comes, and says very little, and stays until the end. At the door he says, “I haven’t sat at a table in a year.”",
          ],
          count(state, "host")
        ),
      ],
      scripture: count(state, "host") === 0 ? STRANGERS : undefined,
    }),
  },
  {
    id: "meet_a",
    group: "People",
    title: "Coffee with {first}",
    blurb: "You have thought about that conversation more than once.",
    time: 1,
    limit: 1,
    costs: 15,
    show: (state) => state.stage === "single" && has(state, "met"),
    run: (_state, me) => ({
      then: (next) => ({ ...next, stage: "courting", partner: candidatesFor(me)[0].id, bonds: { ...next.bonds, partner: 1 } }),
      text: [`Coffee with ${candidatesFor(me)[0].name} turns into a walk, and the walk turns into the long way home. Nobody says what it is. You both know roughly what it might be.`],
    }),
  },
  {
    id: "meet_b",
    group: "People",
    title: "Coffee with {second}",
    blurb: "You have thought about that conversation more than once.",
    time: 1,
    limit: 1,
    costs: 15,
    show: (state) => state.stage === "single" && has(state, "met"),
    run: (_state, me) => ({
      then: (next) => ({ ...next, stage: "courting", partner: candidatesFor(me)[1].id, bonds: { ...next.bonds, partner: 1 } }),
      text: [`Coffee with ${candidatesFor(me)[1].name} turns into a walk, and the walk turns into the long way home. Nobody says what it is. You both know roughly what it might be.`],
    }),
  },
  {
    id: "date",
    group: "People",
    title: "Spend an evening with {partner}",
    blurb: "Just the two of you, and no phones on the table.",
    time: 1,
    limit: 1,
    costs: 30,
    show: (state) => state.stage !== "single",
    run: (state) => ({
      effects: { bond: { partner: 1 } },
      text: [
        state.stage === "married"
          ? rotate(
              [
                "You go nowhere special. You talk about nothing that matters, and then, round about the second hour, about the thing that does.",
                "{He} makes you laugh until you have to put your fork down. You had forgotten that {he} could.",
                "You ask each other the question you ask every few months: what are you carrying that I don’t know about? This time there is an answer.",
              ],
              count(state, "date")
            )
          : rotate(
              [
                "{partner} tells you about {his} family, and then, more carefully, about what {he} is afraid of. You tell {him} yours.",
                "You pray together for the first time, awkwardly, at a bus stop. {He} says amen too early. You both laugh.",
                "You disagree about something that matters, and neither of you leaves. That turns out to be worth knowing.",
              ],
              count(state, "date")
            ),
      ],
    }),
  },
  {
    id: "children",
    group: "People",
    title: "Talk with {partner} about children",
    blurb: "It has been in the room for a while now.",
    time: 1,
    limit: 1,
    show: (state) => state.stage === "married" && state.children.length < 3 && !state.hoping && state.due === null && since(state, "married") >= 1,
    run: () => ({ text: [], event: "children_talk" }),
  },
  {
    id: "play",
    group: "People",
    title: "Give the afternoon to {child}",
    blurb: "No phone, no jobs, no hurry.",
    time: 1,
    limit: 1,
    show: (state) => state.children.length > 0,
    run: (state) => ({
      effects: { bond: { kids: 1 }, grow: count(state, "play") === 2 ? { compassion: 1 } : undefined },
      text: [
        eldestAge(state) < 4
          ? "You lie on the floor and are climbed on. Nothing is achieved. It is the most important thing you do all week."
          : eldestAge(state) < 12
            ? rotate(
                [
                  "You build something out of cushions that is definitely a ship. You are told, firmly, that you are the cargo.",
                  "A very long walk, at the speed of someone who has to look at every snail. At bedtime: “Can we pray for the snails?” You do.",
                ],
                count(state, "play")
              )
            : "You are beaten at cards, repeatedly, by someone who learned the game from you. On the stairs afterwards you are asked a question about God that you can’t answer, and you say so.",
        ...(owns(state, "swing") ? ["The swing gets the most use of anything you ever bought."] : []),
      ],
    }),
  },
  {
    id: "give_more",
    group: "Faith",
    title: "Give generously",
    blurb: "Two hundred and fifty dollars, to the same envelope. You have more than you need.",
    time: 0,
    limit: 1,
    costs: 250,
    show: (state) => count(state, "give") >= 2 && state.money >= 1500,
    run: (state) => ({
      effects: { grow: count(state, "give_more") === 0 ? { compassion: 1, trust: 1 } : undefined },
      text: [
        nth(
          [
            "Two hundred and fifty dollars. Your hand is slower putting it in than it was with sixty. You notice that, and put it in anyway.",
            "You have started to think of some of your money as passing through. It is a lighter way to hold it.",
          ],
          count(state, "give_more")
        ),
      ],
    }),
  },
  {
    id: "deposit",
    group: "Faith",
    title: "Put $500 towards someone else’s front door",
    blurb: "What used to go to the bank could become somebody’s deposit.",
    time: 0,
    limit: 1,
    costs: 500,
    show: (state) => state.mortgage === 0 && count(state, "deposit") < 4,
    run: (state) =>
      count(state, "deposit") === 3
        ? { text: [], event: "front_door" }
        : { text: [nth(["Five hundred dollars into an account marked “someone’s front door”. You don’t know yet whose door it is.", "Another five hundred. The chapel treasurer has started calling it “the Juniper fund”, which embarrasses you.", "Fifteen hundred in the fund now. Mrs. Abara says she knows of a young family in a damp flat on Mill Street."], count(state, "deposit"))] },
  },
  {
    id: "walk",
    group: "Rest",
    title: "Walk {pet}",
    blurb: "Round the Lane, down to the river, and back the long way.",
    time: 1,
    limit: 1,
    show: (state) => state.pet !== null,
    run: (state) => ({
      effects: { energy: 2, bond: count(state, "walk") % 2 === 0 ? { walt: 1 } : undefined },
      text: [
        rotate(
          [
            "{pet} has to greet every lamp post on Juniper Lane personally. Walt is at his gate, and has a biscuit in his cardigan pocket that he claims is a coincidence.",
            "Down to the river and back. You meet four neighbours you have never spoken to. It turns out a dog is a way of being introduced.",
            "It rains. {pet} does not care. By the second mile, neither do you.",
          ],
          count(state, "walk")
        ),
      ],
    }),
  },
  {
    id: "away",
    group: "Rest",
    title: "A few days away",
    blurb: "A borrowed caravan by the sea. No signal, on purpose.",
    time: 2,
    limit: 1,
    costs: 450,
    show: (state) => state.turn >= 4,
    run: (state) => ({
      effects: { energy: 4, bond: { partner: state.stage === "married" ? 1 : 0, kids: state.children.length ? 1 : 0 }, flags: ["rested"] },
      text: [
        state.children.length
          ? "Four days in a caravan that smells of gas and wet towels. Everyone is sandy, nobody sleeps properly, and on the last night {eldest} says it was the best holiday in the world."
          : state.stage === "married"
            ? "Four days by the sea with {partner}, and nothing to do. By the second day you have run out of things to say about work. By the third you are talking about everything else."
            : "Four days by the sea on your own. You take three books and read half of one. Mostly you walk, and find that you are better company than you had expected.",
        "The house is exactly where you left it. So is everything in it that you were worried about. It looks smaller.",
      ],
    }),
  },
  {
    id: "rest",
    group: "Rest",
    title: "A slow day at home",
    blurb: "Do nothing useful, on purpose.",
    time: 1,
    limit: 2,
    show: () => true,
    run: (state) => ({
      effects: { energy: hasStillPlace(state) || owns(state, "sofa") ? 3 : 2, flags: ["rested"] },
      text: [
        rotate(
          [
            "You don’t fix anything. You don’t answer anything. You watch the light move across the floor of a house that is, somehow, yours.",
            "You sleep in the afternoon, like a child, and wake up not knowing what day it is. Nothing went wrong while you were gone.",
            "You potter. It is an under-rated activity.",
          ],
          count(state, "rest")
        ),
      ],
    }),
  },
];

// ——— What life brings to the door ———

const married = (state: LifeState) => state.stage === "married";
const partnerLine = (state: LifeState, withPartner: string, alone: string) => (married(state) ? withPartner : alone);

export function addChild(state: LifeState, name: string, how: Child["how"]): LifeState {
  const child: Child = { name: name.trim() || (how === "born" ? "Baby" : "Little one"), arrived: state.turn, ageThen: how === "born" ? 0 : 12, how };
  return { ...state, children: [...state.children, child], hoping: null, due: null, bonds: { ...state.bonds, kids: Math.max(state.bonds.kids, 2) } };
}

export const EVENTS: LifeEvent[] = [
  {
    id: "welcome",
    title: "Moving day",
    setting: "room",
    with: ["you"],
    beats: [
      "Number 14, Juniper Lane. Two rooms downstairs, one up, a garden full of dandelions, and a mortgage of twelve thousand dollars with your name on it.",
      "The removal van has gone. You are standing in an empty front room with a mattress, a kettle and four boxes marked MISC.",
      "Through the wall you can hear a radio. Somebody next door is listening to the cricket, and disagreeing with it.",
      "It is yours. What you make of it is up to you: who sits in it, what it is for, what kind of person lives here.",
    ],
    choices: [
      { label: "Pray in the empty front room, before you unpack a thing.", effects: { grow: { trust: 1 }, memory: { icon: "🔑", text: "You got the keys to 14 Juniper Lane, and prayed in the empty front room." } }, result: ["You stand in the middle of the bare floor and say it out loud: this house is yours before it is mine. Help me build it well.", "Your voice sounds odd in an empty room. You mean it anyway."], scripture: BUILDS_THE_HOUSE },
      { label: "Find the kettle. First things first.", effects: { energy: 1, memory: { icon: "🔑", text: "You got the keys to 14 Juniper Lane, and found the kettle first." } }, result: ["You drink tea out of the lid of a flask, sitting on a box, in a house with nothing in it. It is one of the best cups of tea of your life."] },
      { label: "Knock next door and say hello.", effects: { bond: { walt: 1 }, memory: { icon: "🔑", text: "You got the keys to 14 Juniper Lane, and met Walt before you had unpacked." } }, result: ["A man in a cardigan opens the door of number 12 and looks you up and down. “Walt. You’ll be the new one. Bins are Thursday. Don’t park across my drive.”", "He shuts the door. Ten minutes later he is back, with a spare kettle, “in case yours is in a box.”"] },
    ],
  },
  {
    id: "proposal",
    title: "The long way home",
    setting: "river",
    with: ["you", "partner"],
    beats: [
      "{partner} walks you home the long way, which {he} only does when {he} has something to say.",
      "“I’m not good at speeches. I’d like to build a life with you. A real one: the boring parts too. I think we want the same things, and I think we’d be better at them together.”",
      "It is not a film. There is a bus going past. It is, you realise, exactly how you would have wanted to be asked.",
    ],
    choices: [
      { label: "“Yes. The boring parts too.”", effects: { bond: { partner: 1 }, grow: { courage: 1 }, memory: { icon: "💍", text: "You and {partner} decided to build a life together." } }, then: (state) => ({ ...state, stage: "engaged" }), result: ["{He} breathes out as if {he} had been holding it since the corner. You stand at your own front gate for another hour, planning nothing and grinning like idiots.", "Walt’s curtain twitches. In the morning there is a bag of tomatoes on the step."] },
      { label: "“I’m not ready to answer. I won’t pretend I am. Ask me again.”", effects: { grow: { integrity: 1 }, flags: ["asked_time"] }, then: (state) => ({ ...state, marks: { ...state.marks, asked_time: state.turn } }), result: ["{He} nods, slowly. “That’s a real answer. I’d rather have that than a quick one.”", "It is not comfortable. It is honest, and {he} is still there at the end of it."] },
    ],
  },
  {
    id: "wedding_plan",
    title: "The wedding",
    setting: "kitchen",
    with: ["you", "partner"],
    beats: [
      "A list on the back of an envelope. Everyone you know has an opinion, and several of them have a cousin who does marquees.",
      "{partner} would be content with the chapel and a sandwich. {His} aunt has sent a brochure for a hotel with chandeliers. You have {money}.",
    ],
    choices: [
      { label: "The chapel, forty people, and a lunch everyone brings a dish to. ($300)", effects: { money: -300, grow: { wisdom: 1 }, flags: ["wedding_planned", "wedding_simple"] }, result: ["You book the chapel and write “bring a dish” on forty invitations. Mrs. Abara takes charge of the puddings without being asked.", "It will not look like the brochure. It will look like the people who love you."] },
      { label: "The chapel hall, a hundred people, a band. ($900)", when: (state) => state.money >= 900, effects: { money: -900, flags: ["wedding_planned"] }, result: ["A hundred people, a ceilidh band, and a cake from the bakery on Mill Street. It takes most of what you have saved, and you are glad to spend it."] },
      { label: "The hotel with the chandeliers, on a credit card. ($3,000)", tempt: "money", effects: { money: -3000, flags: ["wedding_planned", "wedding_grand", "in_debt"] }, result: ["It is going to be magnificent. The photographs will be extraordinary.", "{partner} signs the form beside you, and says, lightly, “We’ll be paying for the chandeliers until the second anniversary.” Neither of you laughs for quite long enough."] },
    ],
  },
  {
    id: "wedding_day",
    title: "The wedding day",
    setting: "hall",
    with: ["you", "partner"],
    beats: (state) => [
      has(state, "wedding_grand") ? "The chandeliers are everything the brochure promised. So is the bill. But when the doors open, you forget both." : "It rains, briefly, and nobody minds. The chapel smells of wet coats and lilies.",
      "Walt is in a tie you suspect was last worn in 1987. Mrs. Abara cries before anything has happened.",
      "You make promises that are far too large for two ordinary people, in front of everyone who will have to help you keep them.",
    ],
    scripture: TWO_ARE_BETTER,
    choices: [
      { label: "“I will.”", effects: { bond: { partner: 2, church: 1 }, memory: { icon: "💒", text: "You married {partner} at Juniper Lane Chapel." }, flags: ["married"] }, then: (state) => ({ ...state, stage: "married", marks: { ...state.marks, married: state.turn } }), result: ["{partner} moves into number 14 with nine boxes, a spice rack and very firm views about where things go in a kitchen.", "There are now two incomes, two toothbrushes, and two people who think they know how to load a dishwasher."] },
    ],
  },
  {
    id: "children_talk",
    title: "The conversation",
    setting: "kitchen",
    with: ["you", "partner"],
    beats: ["You have both been circling it for months. Tonight {partner} puts {his} mug down and simply says it.", "“Do we want children? I think I do. I’m also frightened. I’d like to be frightened about it with you.”"],
    choices: [
      { label: "“Yes. Let’s hope for a child.”", effects: { bond: { partner: 1 }, grow: { trust: 1 } }, then: (state) => ({ ...state, hoping: "birth", hopingSince: state.turn }), result: ["You say yes, and the kitchen feels different afterwards, as if someone had opened a door at the far end of the house.", "It may not happen quickly. It may not happen the way you picture it. You have decided to hope anyway."] },
      { label: "“There are children who need a home. Let’s look into adopting.”", effects: { bond: { partner: 1 }, grow: { compassion: 1 } }, then: (state) => ({ ...state, hoping: "adopt", hopingSince: state.turn }), result: ["{partner} is quiet for a moment, and then says, “I’d been hoping you would say that.”", "There will be forms, and visits, and a great deal of waiting for a phone to ring. You start on the forms that night."] },
      { label: "“Not yet. But let’s keep talking about it.”", effects: { grow: { integrity: 1 } }, result: ["“Not yet” is an answer too, and {he} takes it as one. You agree to come back to it, and you both mean it."] },
    ],
  },
  {
    id: "waiting",
    title: "Not this month",
    setting: "room",
    with: ["you", "partner"],
    beats: ["Another month, and nothing. You hadn’t expected it to matter so much, so soon.", "{partner} finds you sitting on the edge of the bath. {He} doesn’t ask what’s wrong. {He} sits down on the floor."],
    scripture: WAIT,
    choices: [
      { label: "Tell {partner} exactly how you feel.", effects: { bond: { partner: 1 }, grow: { courage: 1 } }, result: ["You say all of it, including the parts that sound ungrateful. {He} doesn’t fix it. {He} says, “Me too,” which is better."] },
      { label: "Pray it, angrily and honestly.", effects: { grow: { trust: 1 } }, result: ["It is not a polite prayer. It has the word “why” in it several times. You are fairly sure it is the most honest thing you have said to God all year.", "Nothing changes. You are not alone in it. Those are both true."] },
      { label: "“I’m fine. Really.”", tempt: "ease", effects: { bond: { partner: -1 } }, result: ["{He} looks at you a moment longer, and lets you have the lie. You have spared {him} nothing. You have only made sure you are each sad in a different room."] },
    ],
  },
  {
    id: "expecting",
    title: "Two lines",
    setting: "room",
    with: ["you", "partner"],
    beats: ["You look at it for a long time before you believe it. Then you look at each other.", "A baby, two seasons from now. There is so much to do, and for one evening you do none of it."],
    choices: [
      { label: "Tell Walt first. He’ll pretend not to care.", effects: { bond: { walt: 1 }, memory: { icon: "🍼", text: "You found out a baby was on the way." } }, then: (state) => ({ ...state, due: state.turn + 2 }), result: ["“A baby,” says Walt. “Well. They’re noisy.” The next morning there is a hand-painted wooden duck on your doorstep. He claims not to know anything about it."] },
      { label: "Keep it between the two of you, for now.", effects: { bond: { partner: 1 }, memory: { icon: "🍼", text: "You found out a baby was on the way." } }, then: (state) => ({ ...state, due: state.turn + 2 }), result: ["It is a good secret to share. You catch each other’s eye in church and have to look at the floor."] },
    ],
  },
  {
    id: "birth",
    title: "A new person",
    setting: "room",
    with: ["you", "partner"],
    naming: "born",
    beats: (state) => [
      "Four in the morning, and then, suddenly, a third person in the room who was not there before.",
      "Small, furious, and entirely unimpressed with all of you.",
      owns(state, "cot") ? "The cot has been ready for weeks. It looks enormous." : "You never did get a cot. On the second day Mrs. Abara arrives with one in the back of her nephew’s van, “from the chapel”, and will not discuss it.",
    ],
    scripture: HERITAGE,
    choices: [{ label: "Bring {child} home.", effects: { bond: { partner: 1, church: 1 }, energy: -1, memory: { icon: "👶", text: "{child} was born." } }, result: ["You carry {child} over the step of number 14 as though the floor might give way. Walt is at his gate, pretending to check the post.", "“Got your nose,” he says. “Poor thing.” He holds one finger out, and it is gripped."] }],
  },
  {
    id: "adoption_day",
    title: "The phone rings",
    setting: "kitchen",
    with: ["you", "partner"],
    naming: "adopted",
    beats: ["After the forms and the visits and the long silence, the phone rings on an ordinary Tuesday.", "A child, three years old, who needs a family and has been told there might be one. You have a week to get the room ready."],
    scripture: HERITAGE,
    choices: [{ label: "Open the door.", effects: { bond: { partner: 1, church: 1 }, memory: { icon: "🏡", text: "{child} came home, and became yours." } }, result: ["{child} stands on the step holding a rucksack and a toy rabbit by one ear, looking at the house and not at you.", "It will take time. Nobody is in a hurry. That night, very quietly, you are asked whether the rabbit can stay too. He can."] }],
  },
  {
    id: "broken_nights",
    title: "Three in the morning",
    setting: "room",
    with: ["you", "partner"],
    beats: ["{child} has not slept for more than two hours together in eleven days. Neither have you.", "At three o’clock you and {partner} have a whispered argument about whose turn it is that is really about everything."],
    choices: [
      { label: "Tell the chapel you’re struggling, and let them help.", effects: { energy: 1, bond: { church: 1 }, grow: { trust: 1 } }, result: ["Within a day there is a rota. Lasagne appears. A woman you barely know takes {child} for two hours on a Thursday so that you can both sleep.", "It is harder to receive than it would have been to give. You say thank you, and let that be enough."], scripture: BEAR_BURDENS },
      { label: "Apologise to {partner} for the three a.m. things, and split the nights.", effects: { bond: { partner: 1 }, grow: { compassion: 1 } }, result: ["You say sorry for what you said at three, and {he} says sorry for what {he} said at four. You draw up a rota on the fridge. It works about half the time, which is a great improvement."] },
      { label: "Push through. Other people manage.", tempt: "ease", effects: { energy: -2, bond: { partner: -1 } }, result: ["Other people do manage, usually by asking for help. You find that out later. For now you are simply very tired, and very short with the one person who is as tired as you are."] },
    ],
  },
  {
    id: "rate_rise",
    title: "A letter from the bank",
    setting: "kitchen",
    with: ["you"],
    beats: (state) => ["The envelope has a window in it, which is never a good sign. Interest rates have gone up. Your payment rises by forty dollars a season, starting now.", partnerLine(state, "{partner} is out. The letter sits on the table between the salt and the pepper.", "You read it standing up, and then again sitting down.")],
    choices: [
      { label: "Go through the budget, line by line, and find the forty dollars.", effects: { payment: 40, grow: { wisdom: 1 } }, result: (state) => [partnerLine(state, "It takes an evening, a pot of tea and {partner}’s spreadsheet. The forty dollars turns out to have been hiding in subscriptions nobody was using.", "It takes an evening and a pot of tea. The forty dollars turns out to have been hiding in subscriptions nobody was using."), "It is not exciting. It is the kind of thing that keeps a roof on."], scripture: ANXIOUS },
      { label: "Don’t think about it. Just take more overtime.", effects: { payment: 40, money: 150, energy: -1 }, result: ["You pick up extra hours without really deciding to. The payment is covered. You are a little more tired than you were, and you haven’t told anyone why."] },
      { label: "Put the letter in the drawer.", tempt: "ease", effects: { payment: 40, flags: ["letter_hidden"] }, result: ["The drawer shuts very easily. The payment goes up anyway; the bank does not need you to have read the letter.", "It is in there with the takeaway menus. You know exactly where."] },
    ],
  },
  {
    id: "drawer",
    title: "The drawer",
    setting: "kitchen",
    with: ["you", "partner"],
    beats: (state) => [partnerLine(state, "{partner} is looking for a takeaway menu, and comes out of the drawer holding the letter from the bank instead.", "You are looking for a takeaway menu, and there it is: the letter from the bank, exactly where you left it."), partnerLine(state, "“This is from months ago. Were you going to tell me?”", "You have been short every season since, and half pretending not to know why.")],
    choices: [
      { label: "Own it. “I hid it. I was frightened, and I’m sorry.”", effects: { grow: { integrity: 1, courage: 1 }, bond: { partner: 1 }, unflag: ["letter_hidden"] }, result: (state) => [partnerLine(state, "{partner} sits down. “Frightened of the letter, or of me?” “Of you being disappointed.” “I am disappointed. About the drawer. Not about forty dollars.”", "You say it plainly, to God and then to the bank’s helpline, in that order."), "The sum on the letter was never the problem. The drawer was. It is easier to breathe with it open."] },
      { label: "“It’s nothing. I’d forgotten all about it.”", tempt: "ease", effects: { bond: { partner: -1 }, unflag: ["letter_hidden"] }, result: ["It is not nothing, and you hadn’t forgotten. The letter goes on the fridge. The lie stays in the room a good deal longer."] },
    ],
  },
  {
    id: "catalogue",
    title: "The catalogue",
    setting: "room",
    with: ["you"],
    beats: ["The Hartwell & Finch catalogue comes through the door unasked. You read it the way some people read novels.", "Page 41: a velvet sofa the colour of a good plum. Fourteen hundred dollars. Nothing to pay for a year. You have {money}.", "You look at your front room. You look at page 41."],
    choices: [
      { label: "Order it. One beautiful thing. You’ve earned it.", tempt: "money", effects: { money: -1400, flags: ["velvet", "in_debt"] }, then: (state) => ({ ...state, rooms: { ...state.rooms, living: { ...state.rooms.living, items: [...new Set([...state.rooms.living.items, "sofa"])], tints: { ...state.rooms.living.tints, sofa: "#6B2F5A" } } } }), result: ["It arrives on a Tuesday, and it is glorious. For a fortnight you sit on it very carefully.", "By the end of the month it is just where you sit. The statement, when it comes, has not got used to anything."] },
      { label: "Close it. Save for the one you can pay for.", effects: { grow: { wisdom: 1 } }, result: ["You put the catalogue in the recycling, face down. There is a perfectly good sofa for a hundred and eighty dollars, and it will be yours all the way through."], scripture: CONTENT },
      { label: "Cut out page 41 and stick it on the fridge. A plan, not a purchase.", effects: { grow: { wisdom: 1 }, flags: ["fridge_plan"] }, result: ["It goes on the fridge with a magnet shaped like a pineapple. Wanting something is not a sin. You would just like to be the one deciding when."] },
    ],
  },
  {
    id: "walt_fence",
    title: "Smoke",
    setting: "garden",
    with: ["you", "walt"],
    beats: ["Walt has a bonfire on the one dry day of the week, and your washing is on the line. Everything you own now smells of burnt hedge.", "It is the third time. He knows it is your washing day. You are fairly sure he knows."],
    choices: [
      { label: "Go round, tell him plainly, and stay for a cup of tea.", effects: { bond: { walt: 1 }, grow: { courage: 1, compassion: 1 } }, result: ["“Walt. My sheets smell like a barbecue. Could you light it on a Thursday?”", "He looks astonished. Nobody has asked him anything directly since Jean died. “Thursday. Right. Should’ve said.” Then he puts the kettle on, which is as close as he gets to sorry."], scripture: PEACE_WITH_ALL },
      { label: "Write a firm note, and post it through his door.", effects: { bond: { walt: -1 } }, result: ["It is a very reasonable note. He reads it standing in his hall, alone, and the next bonfire is on a Tuesday, further up the garden, and somehow larger."] },
      { label: "Say nothing. Stop waving.", tempt: "ease", effects: { bond: { walt: -1 }, flags: ["cold_walt"] }, result: ["You take the washing in, and you stop saying good morning. It is astonishing how quickly a fence gets taller without anyone touching it."] },
    ],
  },
  {
    id: "walt_gate",
    title: "The side gate",
    setting: "garden",
    with: ["you", "walt"],
    beats: ["It has been months since you and Walt exchanged more than a nod. His side gate, which used to stand open, is shut.", "You notice that his curtains have been drawn until noon all week. The tomatoes need watering."],
    choices: [
      { label: "Take round a plate of something, and an apology.", effects: { bond: { walt: 2 }, grow: { compassion: 1, courage: 1 }, unflag: ["cold_walt"] }, result: ["“I’ve been a poor neighbour, Walt. I let a bit of smoke turn into all this. I’m sorry.”", "He stares at the plate. “It was Jean’s birthday, that week. I light a fire. She liked a fire.” He opens the gate. You water the tomatoes together and say very little."], scripture: FORGIVING },
      { label: "Leave it. He started it.", tempt: "ease", effects: { unflag: ["cold_walt"] }, result: ["He did start it. That is true, and it changes nothing. The gate stays shut. It is still there to be opened, whenever you would rather have a neighbour than a verdict."] },
    ],
  },
  {
    id: "windfall",
    title: "An unexpected cheque",
    setting: "kitchen",
    with: ["you"],
    beats: ["A tax refund you had forgotten you were owed: six hundred dollars, in the post, with an apology from the government.", "It feels like free money. It isn’t, exactly. But it is yours to decide about."],
    choices: [
      { label: "Put all of it against the mortgage.", effects: { mortgage: -600, grow: { wisdom: 1 } }, result: ["Six hundred dollars off what you owe, in one afternoon. It is the least glamorous thing you could have done with it, and you feel wonderful."] },
      { label: "Give half away, and keep half.", effects: { money: 300, grow: { compassion: 1 } }, result: ["Three hundred goes into the hardship fund at the chapel. Three hundred goes into your account. Nobody asked you to. That was what made it a pleasure."], scripture: CHEERFUL },
      { label: "Keep it for a rainy day. There is always one.", effects: { money: 600 }, result: ["It goes into the account and stays there, doing nothing, which is exactly what you want it to do. You sleep slightly better."] },
    ],
  },
  {
    id: "roof",
    title: "A drip",
    setting: "room",
    with: ["you"],
    beats: ["It starts as a stain on the ceiling, the shape of a small country. Then, in the night, a drip.", "A man with a ladder says five hundred dollars, sucking his teeth. You have {money}."],
    choices: [
      { label: "Pay for it properly, and sleep.", when: (state) => state.money >= 500, effects: { money: -500, grow: { wisdom: 1 } }, result: ["Five hundred dollars for something you will never see or think about again. That, you are learning, is what most of owning a house is."] },
      { label: "Ask at the chapel. Somebody will know a roofer.", effects: { money: -150, bond: { church: 1 }, grow: { trust: 1 } }, result: ["Somebody’s brother-in-law is a roofer. He does it on a Saturday for the cost of the slates, and stays for lunch.", "You had wanted to manage it on your own. You are glad you didn’t."], scripture: BEAR_BURDENS },
      { label: "Put a bucket under it. It’s only a drip.", tempt: "ease", effects: { flags: ["bucket"] }, result: ["The bucket works very well. You empty it every morning. You have stopped looking up."] },
    ],
  },
  {
    id: "ceiling",
    title: "The ceiling",
    setting: "room",
    with: ["you"],
    beats: ["At two in the morning, during a storm, a piece of the bedroom ceiling the size of a door lands on the floor.", "Nobody is hurt. The bucket is underneath it, crushed flat."],
    choices: [{ label: "Ring the roofer. And say thank you that it wasn’t worse.", effects: { money: -900, grow: { wisdom: 1 }, unflag: ["bucket"] }, result: ["Nine hundred dollars now, for what would have been five hundred then. The roofer is too polite to say so.", "You make a note for the next small thing: deal with it while it is still small."] }],
  },
  {
    id: "promotion",
    title: "A step up",
    setting: "office",
    with: ["you"],
    beats: ["Your manager shuts the door. A senior post: two hundred and fifty dollars more every time you work.", "“It’s six days a week, mind, and you’d be on call Sundays. But think what you could do with the money.”", "You do think about it. That is the trouble."],
    choices: [
      { label: "“Yes, with one condition. Sundays and two evenings are not for sale.”", effects: { pay: 150, grow: { courage: 1, wisdom: 1 } }, result: ["She raises an eyebrow. “Nobody’s ever said that to me.” A pause. “A hundred and fifty more, then, and you keep your Sundays. I can live with that.”", "You had expected to be shown the door. It turns out you can ask."] },
      { label: "Take all of it.", tempt: "money", effects: { pay: 250, flags: ["on_call"] }, result: ["The money is transformative. So is the phone, which now rings on Sunday mornings, and which you answer.", "You tell yourself it is only for a couple of years."] },
      { label: "“Thank you. No. I have enough.”", effects: { grow: { trust: 1, wisdom: 1 } }, result: ["She looks at you as though you had spoken in another language. Perhaps you had.", "You walk home at five o’clock, in daylight, and it feels like getting away with something."], scripture: ENOUGH },
    ],
  },
  {
    id: "friend_loan",
    title: "Jo",
    setting: "cafe",
    with: ["you"],
    beats: ["Jo, whom you have known since school and who thinks your faith is “sweet”, asks to meet. She doesn’t touch her coffee.", "“I’m three hundred short on the rent. I wouldn’t ask. I’ve asked everyone else.”"],
    scripture: LENDS,
    choices: [
      { label: "Give her the three hundred. Call it a loan if it helps her take it.", effects: { money: -300, grow: { compassion: 1 }, flags: ["lent_jo"] }, result: ["You hand it over in an envelope so that she doesn’t have to look at it. “Pay me when you can. Or don’t. I mean that.”", "She cries, briefly and angrily, in the way of someone who hates being helped."] },
      { label: "Give her a hundred, and an evening going through her bills with her.", effects: { money: -100, grow: { compassion: 1, wisdom: 1 } }, result: ["A hundred dollars, and three hours at her kitchen table with a calculator. You find forty a month she didn’t know she was paying.", "“You’re annoyingly good at this,” she says. It is the nicest thing she has ever said to you."] },
      { label: "“I can’t, Jo. I’m sorry.” And mean the sorry.", result: ["You can’t do everything, and this month you can’t do this. You don’t dress it up. You do ask what else would help, and she lets you drive her to the housing office on Thursday."] },
    ],
  },
  {
    id: "jo_repay",
    title: "Jo, again",
    setting: "cafe",
    with: ["you"],
    beats: ["Jo rings. She has not got the three hundred. She has seventy, and a long explanation, and she has plainly been dreading the call for weeks.", "“I know what I said. I’ll get it to you. I just need a bit longer.”"],
    choices: [
      { label: "“Keep the seventy. It was a gift. We’re square.”", effects: { grow: { compassion: 1 }, unflag: ["lent_jo"], memory: { icon: "🤝", text: "You turned a loan to Jo into a gift." } }, result: ["There is a long silence on the line. “You can’t just do that.” “I can. I’ve been let off more than three hundred dollars, Jo.”", "She doesn’t ask what you mean. A week later, she does."], scripture: FORGIVING },
      { label: "“Seventy now is fine. Let’s work out the rest together, with no rush.”", effects: { money: 70, grow: { integrity: 1 }, unflag: ["lent_jo"] }, result: ["You agree ten dollars a month, which is nothing, and which lets her keep her dignity. She never misses one."] },
      { label: "Say it’s fine, and resent it quietly.", tempt: "ease", effects: { unflag: ["lent_jo"] }, result: ["You say “no problem” in a voice that means the opposite. She hears it. The three hundred dollars is now a piece of furniture in every conversation the two of you have."] },
    ],
  },
  {
    id: "quarrel",
    title: "The dishwasher",
    setting: "kitchen",
    with: ["you", "partner"],
    beats: ["It begins with how to load a dishwasher. It moves on, by way of money, to your mother. By ten o’clock you are both saying things with the word “always” in them.", "{partner} goes upstairs. You stand in the kitchen, entirely right, and entirely miserable."],
    choices: [
      { label: "Go up before bed and say sorry for your part. Only your part.", effects: { bond: { partner: 1 }, grow: { courage: 1, compassion: 1 }, flags: ["made_up"] }, result: ["“I’m sorry for ‘always’. And for bringing your mother into it. I’m not sorry about the dishwasher.”", "{He} laughs, which {he} had not meant to do. “I’m sorry for ‘never’.” It isn’t solved. It is, though, no longer growing in the dark."], scripture: SUN_GO_DOWN },
      { label: "Wait. It’s {his} turn to say sorry first.", tempt: "ease", effects: { bond: { partner: -1 }, flags: ["cold_night"] }, result: ["You wait. So does {he}. You lie eighteen inches apart, each rehearsing a closing speech.", "By morning it has set. You are very polite to each other over breakfast."] },
      { label: "Follow {him} upstairs and win.", effects: { bond: { partner: -1 } }, result: ["You are brilliant. You have dates, examples, and a quotation. By midnight {he} has stopped arguing.", "You have won, and you are lying beside someone who has just lost to you. It turns out those are the same event."] },
    ],
  },
  {
    id: "thaw",
    title: "Polite",
    setting: "kitchen",
    with: ["you", "partner"],
    beats: ["You and {partner} have been polite to each other for weeks. Please. Thank you. Have you seen my keys.", "Nobody is shouting. You miss the shouting. At least that was two people in the same room."],
    choices: [
      { label: "Break it. “I miss you. I’ve been keeping score, and I’m tired of winning.”", effects: { bond: { partner: 2 }, grow: { courage: 1 }, unflag: ["cold_night"] }, result: ["{He} puts down the tea towel. “I didn’t know how to start.” “Neither did I. That was a terrible start. I meant it, though.”", "You talk until one. Some of it is not pleasant. All of it is real."], scripture: FORGIVING },
      { label: "Carry on. It’s calmer this way.", tempt: "ease", effects: { unflag: ["cold_night"] }, result: ["It is calmer. A house with nobody in it is calm. The door is not locked, though, and {he} is still on the other side of it."] },
    ],
  },
  {
    id: "envy",
    title: "Their kitchen",
    setting: "kitchen",
    with: ["you"],
    beats: ["Dinner with friends from your old job, in their new house. It has a kitchen island the size of your front room, and a tap that makes boiling water on demand.", "You are happy for them. You say so several times. You drive home very quietly."],
    choices: [
      { label: "Say it out loud. “I’m jealous. I don’t like it. Help me.”", effects: { grow: { trust: 1, integrity: 1 } }, result: ["You say it to God in the car, and then, because it is still there, to someone at the chapel on Sunday. She laughs, kindly. “Oh, the tap. I know about the tap.”", "It loses a good deal of its power once it has been said to a person."], scripture: NOT_ABUNDANCE },
      { label: "Walk round your own house and say thank you for each room.", effects: { grow: { trust: 1 } }, result: ["The front room: thank you. The kitchen, with its humming fridge: thank you. The stairs. The bucket-shaped mark on the ceiling.", "By the time you reach the garden you mean it. The dandelions have never looked so well."], scripture: LEARNED_CONTENT },
      { label: "Sit up until midnight pricing kitchen islands.", tempt: "money", effects: { energy: -1, flags: ["restless"] }, result: ["There is a company that will do it in six weeks, on finance. You have three browser tabs open and a strange hollow feeling.", "The kitchen you already have is exactly as it was this morning, when you liked it."] },
    ],
  },
  {
    id: "why_pray",
    title: "Walt asks",
    setting: "garden",
    with: ["you", "walt"],
    beats: ["Walt is leaning on the fence with a mug. He has clearly been working up to something.", "“You pray. I’ve seen you through the window, sat there. I prayed for Jean every day for two years, and she died anyway. So what’s it for?”"],
    choices: [
      { label: "Tell him the truth, plainly, without tidying it up.", effects: { bond: { walt: 1 }, grow: { courage: 1 } }, result: ["“I don’t know why she died, Walt. I’m not going to pretend to. I don’t think prayer is how you get what you want. I think it’s how you’re not alone in what you get.”", "He looks at his tomatoes for a long time. “That’s the first answer I’ve had that wasn’t rubbish.” He doesn’t say any more. He comes to dinner on Friday."], scripture: READY_ANSWER },
      { label: "“It’s hard to explain.” Change the subject.", tempt: "ease", result: ["He nods, as if that was what he had expected, and tells you about greenfly. It took him two years to ask. You hope he will ask again."] },
      { label: "Explain to him, at length, why he’s wrong.", effects: { bond: { walt: -1 } }, result: ["You have good arguments. You use all of them. He finishes his tea, says, “Well, you’d know,” and goes inside.", "You were answering a question. He was telling you about his wife."] },
    ],
  },
  {
    id: "tired_yes",
    title: "One more thing",
    setting: "hall",
    with: ["you"],
    beats: ["After the service, the woman who runs everything takes you by the elbow. The toddler group needs a leader. Thursday mornings. “You’d be marvellous.”", "You are already at the food bank. You are tired in a way you have stopped mentioning. Everybody is looking at you."],
    choices: [
      { label: "“No. Thank you for asking. I can’t do it well, so I won’t do it.”", effects: { grow: { wisdom: 1, courage: 1 }, energy: 1 }, result: ["You say it once, warmly, and you do not apologise three times afterwards. She blinks. “Well. Good for you.” She finds someone else by Wednesday.", "The chapel does not fall down."], scripture: REST_AWHILE },
      { label: "“Not this term. Ask me again in the spring.”", effects: { grow: { wisdom: 1 } }, result: ["It is a real answer and not a way of escaping, and she can tell the difference. She writes it in her diary. She will ask in the spring."] },
      { label: "“Of course.” You always say of course.", tempt: "ease", effects: { energy: -2, bond: { church: 1 } }, result: ["You are marvellous at it. You are also now doing it on five hours’ sleep, and finding it harder each week to remember why you came."] },
    ],
  },
  {
    id: "single_table",
    title: "Sunday lunch",
    setting: "hall",
    with: ["you"],
    beats: ["Everyone at the chapel seems to go home on Sundays to a table with other people at it. You go home to number 14, and a tin of soup.", "Somebody says, kindly and wrongly, “Your turn will come.” As if the life you have now were a waiting room."],
    scripture: AS_CALLED,
    choices: [
      { label: "Fill your own table. Ask everyone else who’d be eating alone.", effects: { bond: { church: 1, walt: 1 }, grow: { compassion: 1, courage: 1 }, memory: { icon: "🍲", text: "You started Sunday lunch at number 14, for whoever would otherwise eat alone." } }, result: ["Walt. A student. A widow. A man from the food bank. You haven’t enough chairs, so somebody sits on the stairs.", "It becomes a fixture. People start calling it “the Lane lunch”. Your house is full on Sundays, and you did not have to wait for anyone’s permission."] },
      { label: "Tell someone you trust that it stings.", effects: { grow: { trust: 1 }, bond: { church: 1 } }, result: ["Mrs. Abara listens to the whole of it. “I was forty-four when I married,” she says. “And the years before weren’t a corridor. They were rooms. I lived in them.”"] },
      { label: "Smile, and go home.", tempt: "ease", result: ["The soup is fine. The house is quiet. Nothing is wrong, exactly, and you would not call it right."] },
    ],
  },
  {
    id: "bedtime",
    title: "A question at bedtime",
    setting: "room",
    with: ["you"],
    beats: ["The light is off. You are almost out of the door.", "“Where does God live? Is it far? Does he know which house is ours?”", "{eldest} has clearly been saving it up."],
    choices: [
      { label: "Sit back down. “I don’t know all of it. Here’s what I do know.”", effects: { bond: { kids: 1 }, grow: { wisdom: 1, integrity: 1 } }, result: ["“He isn’t far. He knows which house. He knew before we did.” A pause. “And I don’t understand all of it either. We can not-understand it together.”", "That seems to be acceptable. You are asked, next, whether God knows the rabbit’s name."] },
      { label: "“That’s one for the pastor, I think.”", result: ["It is one for the pastor. It was also one for you. {eldest} asked the person whose answer mattered most to them."] },
      { label: "“It’s late. Go to sleep.”", tempt: "ease", effects: { bond: { kids: -1 } }, result: ["It is late. The question goes back wherever such questions are kept. They do come round again, though not for ever."] },
    ],
  },
  {
    id: "arrears",
    title: "A missed payment",
    setting: "kitchen",
    with: ["you"],
    beats: ["The mortgage payment bounced. There wasn’t enough in the account, and the bank has written to say so, in bold.", "Your stomach does the thing it does. This is how people lose houses, says a voice. Usually it isn’t; usually it is how people learn to ring the bank."],
    choices: [
      { label: "Ring the bank before they ring you. Tell them the truth.", effects: { grow: { integrity: 1, courage: 1 }, payment: 15 }, then: (state) => ({ ...state, arrears: 0 }), result: ["You are on hold for forty minutes. Then a woman called Denise, who has plainly had this conversation a thousand times, spreads what you missed over the next two years: fifteen dollars a season.", "“You rang us,” she says. “You’d be amazed how few people do.”"] },
      { label: "Tell the chapel you’re in trouble.", effects: { grow: { trust: 1 }, bond: { church: 1 } }, then: (state) => ({ ...state, arrears: 0 }), result: ["There is a hardship fund. You have put money in it yourself, never imagining which side of it you would end up on.", "It covers what you missed. Nobody makes a speech. Mrs. Abara says, “That’s what it’s for,” and asks about the garden."], scripture: BEAR_BURDENS },
      { label: "Don’t open the next one.", tempt: "ease", effects: { money: -60, flags: ["avoiding_bank"] }, result: ["There is a sixty-dollar charge for the missed payment, and another letter after that. It has not gone away. It has only become somewhere you don’t look."] },
    ],
  },
  {
    id: "shelter",
    title: "The dog at the shelter",
    setting: "garden",
    with: ["you"],
    naming: "pet",
    beats: [
      "The shelter has a stall at the chapel fête. In a pen at the back there is a dog of no known make: brown, one ear up, and looking at you as if you were late.",
      "“Nobody wants him,” says the volunteer. “He’s four, and he’s not pretty, and he eats shoes.” The dog puts a paw on your foot.",
    ],
    choices: [
      { label: "Take him home. ($80)", when: (state) => state.money >= 80, effects: { money: -80, energy: 1, memory: { icon: "🐕", text: "{pet} came home from the shelter." } }, then: (state, name) => ({ ...state, pet: { name: name.trim() || "Scout" } }), result: ["He sits in the footwell the whole way home with his chin on your shoe. By evening he has chosen the warmest spot in the house and is asleep in it.", "A dog is for years. You have just promised him yours. It feels, oddly, like being trusted with something."] },
      { label: "Not now. A dog is for years, and you’d want to do it properly.", effects: { grow: { wisdom: 1 } }, result: ["You scratch his ears and say sorry, and mean it. Saying no to a good thing you can’t do well is not unkindness.", "A fortnight later Mrs. Abara mentions that he has gone to a farm. An actual farm, she says, seeing your face."] },
    ],
  },
  {
    id: "front_door",
    title: "Someone’s front door",
    setting: "hall",
    with: ["you"],
    beats: ["The last five hundred makes two thousand. Mrs. Abara has been waiting for exactly that number.", "A young couple with a baby, in a damp flat on Mill Street, a deposit two thousand dollars short. They do not know your name, and you have asked that they never do."],
    scripture: CHEERFUL,
    choices: [{ label: "Hand it over.", effects: { grow: { compassion: 1, trust: 1 }, bond: { church: 1 }, memory: { icon: "🚪", text: "Your fund became somebody else’s front door." } }, result: ["A month later, walking down Mill Street, you pass a house with a pram in the hall and somebody up a ladder painting a window frame the wrong colour.", "It isn’t yours. That is the best part. Nothing has come back to you for it, and you find you would do it again tomorrow."] }],
  },
  {
    id: "mortgage_paid",
    title: "The last payment",
    setting: "kitchen",
    with: ["you"],
    beats: ["You make the last payment on an ordinary weekday, on your phone, standing in the kitchen. The number goes to zero, and nothing happens. No music.", "Number 14, Juniper Lane is yours. All of it, down to the dandelions."],
    scripture: DONT_FORGET,
    choices: [
      { label: "Throw a party for the whole Lane.", effects: { bond: { walt: 1, church: 1 }, energy: 1, memory: { icon: "🎉", text: "You paid off the house, and threw a party for the whole of Juniper Lane." } }, result: ["Trestle tables down the middle of the road. Walt makes a speech nobody asked for, about bins, which ends, unexpectedly, “and they’re good neighbours.”"] },
      { label: "Start a fund to help somebody else with a deposit.", effects: { grow: { compassion: 1 }, memory: { icon: "🏠", text: "You paid off the house, and started saving for somebody else’s." } }, result: ["What used to go to the bank now goes into an account marked “someone’s front door”. You don’t know yet whose. You find that exciting."] },
      { label: "Sit in the garden, and say thank you.", effects: { grow: { trust: 1 }, energy: 1, memory: { icon: "🌼", text: "You paid off the house, and sat in the garden and gave thanks." } }, result: ["You sit out until it is dark, going back over it: the drips, the letters, the shifts, the table. You find you can’t take much of the credit, and don’t want to."] },
    ],
  },
];

// ——— The prayer list ———

export interface Topic {
  id: string;
  text: string;
  show: (state: LifeState) => boolean;
  /** How this one has been answered so far, if it has. */
  answer: (state: LifeState, prayer: Prayer) => { answer: NonNullable<Prayer["answer"]>; note: string } | null;
}

const waited = (state: LifeState, prayer: Prayer) => state.turn - prayer.since;

export const TOPICS: Topic[] = [
  {
    id: "home",
    text: "That this house would be a place of welcome",
    show: () => true,
    answer: (state) => (count(state, "host") >= 2 ? { answer: "yes", note: "Six people round a table meant for four. You asked for a place of welcome, and were handed the work of making one." } : null),
  },
  {
    id: "enough",
    text: "For enough to pay what I owe",
    show: (state) => state.mortgage > 0,
    answer: (state, prayer) =>
      state.mortgage === 0
        ? { answer: "yes", note: "Paid, to the last dollar. It came as work, and help, and a great many ordinary seasons." }
        : waited(state, prayer) >= 4
          ? { answer: "wait", note: "No windfall. Enough, each season, so far. You are beginning to think that is the answer." }
          : null,
  },
  {
    id: "someone",
    text: "For someone to share my life with",
    show: (state) => state.stage === "single" || state.stage === "courting",
    answer: (state, prayer) =>
      state.stage === "married"
        ? { answer: "yes", note: "{partner}. Not what you pictured; better, and more work." }
        : state.stage === "single" && waited(state, prayer) >= 6
          ? { answer: "other", note: "Not a husband or a wife. But the house is rarely empty, and you are less alone than you asked to be." }
          : null,
  },
  {
    id: "child",
    text: "For a child",
    show: (state) => state.stage === "married" && state.children.length === 0,
    answer: (state, prayer) =>
      state.children.length > 0
        ? { answer: "yes", note: "{eldest}. You would not have known how to ask for this particular person." }
        : waited(state, prayer) >= 3
          ? { answer: "wait", note: "Not yet. You don’t know why. You have decided to keep asking, and to keep telling the truth about how it feels." }
          : null,
  },
  {
    id: "walt",
    text: "For Walt next door",
    show: (state) => state.bonds.walt >= 1,
    answer: (state, prayer) =>
      state.bonds.walt >= 4
        ? { answer: "other", note: "He hasn’t come to the chapel. He has started saying grace at your table, to be polite. You are not sure it is only politeness." }
        : waited(state, prayer) >= 4
          ? { answer: "wait", note: "He still says it is all nonsense. He also asked you, last week, to pray for his knee." }
          : null,
  },
  {
    id: "marriage",
    text: "For our marriage",
    show: (state) => state.stage === "married",
    answer: (state, prayer) => (has(state, "made_up") && waited(state, prayer) >= 1 ? { answer: "yes", note: "You went up the stairs and said sorry first. It turns out you were the answer to this one." } : waited(state, prayer) >= 5 ? { answer: "wait", note: "Still married. Still learning how. You suspect this prayer never comes off the list." } : null),
  },
  {
    id: "kids",
    text: "For my children",
    show: (state) => state.children.length > 0,
    answer: (state, prayer) => (waited(state, prayer) >= 4 ? { answer: "wait", note: "You will be praying this one for the rest of your life. That is not a delay. That is what it is." } : null),
  },
  {
    id: "peace",
    text: "For a quieter heart",
    show: () => true,
    answer: (state, prayer) => (count(state, "rest") + count(state, "pray") >= 6 && waited(state, prayer) >= 2 ? { answer: "yes", note: "It didn’t arrive. It grew, in the hours you stopped. You only noticed when someone said you seemed different." } : null),
  },
  {
    id: "work",
    text: "To do my work well, and honestly",
    show: () => true,
    answer: (state, prayer) => (count(state, "work") >= 8 && waited(state, prayer) >= 3 ? { answer: "yes", note: "“Someone I don’t have to check up on,” your manager said. You hadn’t known anybody was looking." } : null),
  },
];

/** Looks again at every open prayer. Returns the life, and the prayers answered just now. */
export function answerPrayers(state: LifeState): { state: LifeState; answered: Prayer[] } {
  const answered: Prayer[] = [];
  const prayers = state.prayers.map((prayer) => {
    if (prayer.answer === "yes" || prayer.answer === "other") return prayer;
    const topic = TOPICS.find((candidate) => candidate.id === prayer.id);
    const found = topic ? topic.answer(state, prayer) : state.turn - prayer.since >= 4 ? { answer: "wait" as const, note: "Still on the list. Still heard. You don’t know yet what the answer is." } : null;
    if (!found || (found.answer === prayer.answer && found.note === prayer.note)) return prayer;
    const next = { ...prayer, ...found, answeredAt: state.turn };
    answered.push(next);
    return next;
  });
  return { state: { ...state, prayers }, answered };
}

// ——— The turning of the seasons ———

export interface Ledger {
  lines: { label: string; amount: number }[];
  notes: string[];
  answered: Prayer[];
}

/** As far into the red as a life can go. */
const OVERDRAFT = -1500;

const POOL: { id: string; when: (state: LifeState) => boolean }[] = [
  { id: "catalogue", when: (state) => state.turn >= 1 },
  { id: "shelter", when: (state) => state.turn >= 3 && state.pet === null },
  { id: "rate_rise", when: (state) => state.turn >= 2 && state.mortgage > 0 },
  { id: "walt_fence", when: (state) => state.turn >= 3 && state.bonds.walt >= 1 },
  { id: "roof", when: (state) => state.turn >= 3 },
  { id: "windfall", when: (state) => state.turn >= 4 },
  { id: "promotion", when: (state) => count(state, "work") >= 5 },
  { id: "single_table", when: (state) => state.stage === "single" && state.turn >= 5 },
  { id: "friend_loan", when: (state) => state.turn >= 5 && state.money >= 300 },
  { id: "quarrel", when: (state) => married(state) && since(state, "married") >= 2 },
  { id: "envy", when: (state) => state.turn >= 6 },
  { id: "why_pray", when: (state) => count(state, "pray") >= 2 && state.bonds.walt >= 2 },
  { id: "tired_yes", when: (state) => count(state, "serve") >= 2 },
  { id: "bedtime", when: (state) => state.children.some((child) => ageOf(state, child) >= 10) },
];

/** What happens next, if anything. The things a life is waiting on come before the things that just turn up. */
function nextEvent(state: LifeState): string | null {
  const unseen = (id: string) => !state.seen.includes(id);
  if (has(state, "missed_payment")) return "arrears";
  if (state.stage === "engaged") return has(state, "wedding_planned") ? "wedding_day" : "wedding_plan";
  if (state.stage === "courting" && state.bonds.partner >= 3 && !(since(state, "asked_time") >= 0 && since(state, "asked_time") < 2)) return "proposal";
  if (state.due !== null && state.turn >= state.due) return "birth";
  if (state.hoping === "adopt" && state.turn - state.hopingSince >= 3) return "adoption_day";
  if (state.hoping === "birth" && state.due === null) {
    const wait = state.children.length === 0 ? 2 : 1;
    if (state.turn - state.hopingSince >= wait) return "expecting";
    if (unseen("waiting")) return "waiting";
  }
  if (has(state, "letter_hidden") && since(state, "letter_hidden") >= 2) return "drawer";
  if (has(state, "cold_walt") && since(state, "cold_walt") >= 2) return "walt_gate";
  if (has(state, "cold_night") && since(state, "cold_night") >= 1) return "thaw";
  if (has(state, "bucket") && since(state, "bucket") >= 2) return "ceiling";
  if (has(state, "lent_jo") && since(state, "lent_jo") >= 3) return "jo_repay";
  if (state.mortgage === 0 && unseen("mortgage_paid")) return "mortgage_paid";
  if (state.children.some((child) => child.how === "born" && ageOf(state, child) <= 1) && unseen("broken_nights")) return "broken_nights";

  const open = POOL.filter((entry) => unseen(entry.id) && entry.when(state));
  if (!open.length || (state.turn > 6 && Math.random() < 0.25)) return null;
  // Earlier entries are the gentler ones; lean towards them while the house is new.
  return open[Math.floor(Math.random() * Math.min(open.length, 3))].id;
}

/** Closes a season: the bills, the mortgage, and whatever comes next. */
export function endSeason(state: LifeState, me: Me): { state: LifeState; ledger: Ledger } {
  const lines: Ledger["lines"] = [];
  const notes: string[] = [];
  let next = { ...state };
  const partner = partnerOf(state, me);

  if (married(state) && partner) lines.push({ label: `${partner.name}’s pay`, amount: 420 });
  lines.push({ label: "Food, heat and the rest", amount: -(220 + state.children.length * 90) });
  if (owns(state, "veg")) lines.push({ label: "From the vegetable patch", amount: 30 });
  if (state.money < 0) lines.push({ label: "Interest on what you owe", amount: -Math.min(60, Math.max(15, Math.round(-state.money * 0.04))) });
  let money = state.money + lines.reduce((sum, line) => sum + line.amount, 0);
  // Nobody on Juniper Lane goes hungry. Past a certain point, other people carry it.
  if (money < OVERDRAFT) {
    lines.push({ label: "Covered by the chapel food bank", amount: OVERDRAFT - money });
    notes.push("You couldn’t cover everything this season. The food bank at the chapel filled the gap. It is strange, and humbling, to be on the other side of that table.");
    money = OVERDRAFT;
  }

  let flags = state.flags.filter((flag) => flag !== "missed_payment");
  if (state.mortgage > 0) {
    const due = Math.min(state.payment, state.mortgage);
    if (money >= due) {
      money -= due;
      lines.push({ label: "Mortgage", amount: -due });
      next.mortgage = state.mortgage - due;
    } else {
      next.arrears = state.arrears + 1;
      flags = [...flags, "missed_payment"];
      notes.push("There wasn’t enough for the mortgage this season.");
    }
  }

  const baby = state.children.some((child) => child.how === "born" && ageOf(state, child) < 3);
  let energy = state.energy + 2 - (baby ? 1 : 0) - (has(state, "on_call") ? 1 : 0);
  if (baby) notes.push("Broken nights. You are running on less than you’d like.");
  if (has(state, "on_call")) notes.push("The work phone rang on Sunday again.");
  energy = Math.max(0, Math.min(MAX_ENERGY, energy));

  next = { ...next, money, energy, flags, turn: state.turn + 1, time: TIME_PER_SEASON, season: [] };
  if (money >= 0) next.flags = next.flags.filter((flag) => flag !== "in_debt");

  const prayed = answerPrayers(next);
  next = prayed.state;
  next.pending = next.turn % 4 === 0 ? "review" : nextEvent(next);
  return { state: next, ledger: { lines, notes, answered: prayed.answered } };
}

/** After the year's review, life carries on with whatever was waiting. */
export function afterReview(state: LifeState): LifeState {
  const next = { ...state, yearStart: { mortgage: state.mortgage, hosted: count(state, "host"), prayed: count(state, "pray") } };
  return { ...next, pending: nextEvent(next) };
}

export interface Review {
  title: string;
  lines: string[];
  scripture: Scripture;
  question: string;
}

const REVIEWS: { scripture: Scripture; question: string }[] = [
  { scripture: ON_THE_ROCK, question: "What is this house actually standing on?" },
  { scripture: ROOMS_FILLED, question: "What is the real treasure in your rooms?" },
  { scripture: NEW_EVERY_MORNING, question: "Where did you see faithfulness this year that wasn’t your own?" },
  { scripture: SEEK_FIRST, question: "What did you put first this year, when you look at where the time went?" },
];

export function reviewOf(state: LifeState, me: Me): Review {
  const year = yearOf(state.turn) - 1;
  const paid = state.yearStart.mortgage - state.mortgage;
  const hosted = count(state, "host") - state.yearStart.hosted;
  const prayed = count(state, "pray") - state.yearStart.prayed;
  const partner = partnerOf(state, me);
  const lines = [
    paid > 0 ? `You paid $${paid.toLocaleString()} off the house this year. $${state.mortgage.toLocaleString()} to go.` : state.mortgage === 0 ? "The house is paid for. Nobody can take it from you." : "The mortgage didn’t move this year. It was a hard one.",
    hosted > 0 ? `People sat at your table ${hosted === 1 ? "once" : `${hosted} times`}.` : "Nobody came to dinner this year. The door opens from the inside.",
    prayed > 0 ? `You stopped to pray in ${prayed === 1 ? "one season" : `${prayed} seasons`} out of four.` : "You didn’t stop to pray this year. God was not counting. He was, perhaps, waiting.",
    state.stage === "married" && partner ? `You and ${partner.name} are ${state.bonds.partner >= 4 ? "closer than you were" : state.bonds.partner >= 2 ? "steady" : "further apart than either of you would say out loud"}.` : state.stage === "single" ? "You live alone, and the house is as full as you have chosen to make it." : `You and ${partner?.name ?? "someone"} are finding out what this is.`,
    ...(state.children.length ? [`${state.children.map((child) => child.name).join(" and ")} ${state.children.length === 1 ? "is" : "are"} a year older, which seems impossible.`] : []),
    state.bonds.walt >= 4 ? "Walt leaves the side gate open." : state.bonds.walt >= 2 ? "Walt has stopped mentioning the bins." : "You still don’t really know the man next door.",
  ];
  return { title: `Year ${year} on Juniper Lane`, lines, ...REVIEWS[(year - 1) % REVIEWS.length] };
}

// ——— Doing things ———

/** Why something can't be done right now, if it can't. */
export function blockedReason(state: LifeState, activity: Activity): string | null {
  if (state.season.filter((id) => id === activity.id).length >= activity.limit) return "Done for this season.";
  if (activity.time > state.time) return "No time left this season.";
  if (activity.tiring && activity.tiring > state.energy) return "You’re too tired. Rest first.";
  if (activity.costs && activity.costs > state.money) return "You can’t afford it just now.";
  return null;
}

export function doActivity(state: LifeState, activity: Activity, me: Me): { state: LifeState; outcome: Outcome } {
  const outcome = activity.run(state, me);
  let next = applyEffects(
    { ...state, counts: { ...state.counts, [activity.id]: count(state, activity.id) + 1 }, season: [...state.season, activity.id] },
    { time: -activity.time, energy: -(activity.tiring ?? 0), money: -(activity.costs ?? 0) }
  );
  next = applyEffects(next, outcome.effects);
  if (outcome.then) next = outcome.then(next);
  return { state: next, outcome };
}

/** What a choice leads to, before the names are filled in. */
export function resultLines(choice: LifeEvent["choices"][number], state: LifeState): string[] {
  return (typeof choice.result === "function" ? choice.result(state) : choice.result).filter(Boolean);
}

/** Lives through a choice: what it changes, what is remembered, and what it leads to. */
export function resolveChoice(state: LifeState, event: LifeEvent, choiceIndex: number, me: Me, childName: string): { state: LifeState; text: string[]; scripture?: Scripture } {
  const choice = event.choices[choiceIndex];
  let next = event.naming === "born" || event.naming === "adopted" ? addChild(state, childName, event.naming) : state;
  // Something lived through a second time still costs what it costs, but it isn't a lesson twice.
  const again = state.seen.includes(event.id);
  next = applyEffects(next, { ...choice.effects, memory: undefined, grow: again ? undefined : choice.effects?.grow });
  if (choice.then) next = choice.then(next, childName);
  // Remembered last, so that the memory can name whoever has just arrived.
  if (choice.effects?.memory) next = applyEffects(next, { memory: { ...choice.effects.memory, text: say(choice.effects.memory.text, next, me) } });
  next = { ...next, seen: next.seen.includes(event.id) ? next.seen : [...next.seen, event.id], pending: null };
  return { state: next, text: resultLines(choice, next).map((line) => say(line, next, me)), scripture: choice.scripture };
}
