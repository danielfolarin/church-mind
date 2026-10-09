import { ACTIVITIES, blockedReason, partnerOf, type Activity } from "./content";
import { owns, type LifeState, type Me } from "./model";

// The house is how this world is played. Things to do live where you would
// do them: work is out through the front gate, prayer is in the quiet chair,
// Walt is at the fence. This file says what is where, and what is on the
// player's mind this season.

export interface Spot {
  id: string;
  label: string;
  icon: string;
  /** Where its marker sits on the picture of the house. */
  x: number;
  y: number;
  /** Where the player walks to on the ground floor before doing something here. */
  stand: number;
  /** The activities found here. */
  acts: string[];
  /** Said when there is nothing to do here yet. */
  hint?: string;
}

export function spotsFor(state: LifeState, me: Me): Spot[] {
  const partner = partnerOf(state, me);
  const quiet = owns(state, "armchair") ? { x: 766, y: 418, stand: 740 } : owns(state, "bench") ? { x: 846, y: 426, stand: 790 } : { x: 372, y: 420, stand: 372 };
  const rest = owns(state, "sofa") ? { x: 245, y: 424, stand: 245 } : { x: 232, y: 284, stand: 200 };
  const spots: Spot[] = [
    { id: "gate", label: "The front gate", icon: "💼", x: 450, y: 566, stand: 190, acts: ["work", "overtime", "meet_a", "meet_b", "away"] },
    { id: "rest", label: owns(state, "sofa") ? "The sofa" : "Your bed", icon: "🛋️", ...rest, acts: ["rest"] },
    { id: "quiet", label: owns(state, "armchair") ? "The armchair by the window" : owns(state, "bench") ? "The garden bench" : "The bottom stair", icon: "🙏", ...quiet, acts: ["pray"] },
    { id: "table", label: "The kitchen table", icon: "🍲", x: 484, y: 424, stand: 470, acts: ["host"], hint: "There is nowhere for anyone to sit. A kitchen table and chairs would let you have people round: see Build and decorate." },
    { id: "walt", label: "Walt, at number 12", icon: "👋", x: 44, y: 392, stand: 190, acts: ["walt"] },
    { id: "chapel", label: "Juniper Lane Chapel", icon: "⛪", x: 862, y: 296, stand: 790, acts: ["church", "serve", "give", "give_more", "deposit"] },
  ];
  if (state.mortgage > 0) spots.push({ id: "post", label: "The post", icon: "✉️", x: 612, y: 404, stand: 590, acts: ["pay_extra"] });
  if (state.stage !== "single" && partner) spots.push({ id: "partner", label: partner.name, icon: "💛", x: 342, y: 236, stand: 372, acts: ["date", "children"] });
  if (state.children.length) spots.push({ id: "kids", label: state.children.map((child) => child.name).join(" and "), icon: "🧸", x: state.rooms.second.built ? 560 : 300, y: state.rooms.second.built ? 232 : 190, stand: 372, acts: ["play"] });
  if (state.pet) spots.push({ id: "dog", label: state.pet.name, icon: "🐕", x: -100, y: -100, stand: 300, acts: ["walk"] });
  return spots;
}

/** The activities at a spot that are on offer at this point in the life. */
export function actsAt(spot: Spot, state: LifeState, me: Me): Activity[] {
  return spot.acts.map((id) => ACTIVITIES.find((activity) => activity.id === id)).filter((activity): activity is Activity => Boolean(activity && activity.show(state, me)));
}

/** Whether anything can be done at a spot right now. */
export function spotOpen(spot: Spot, state: LifeState, me: Me): boolean {
  return actsAt(spot, state, me).some((activity) => !blockedReason(state, activity));
}

export interface Goal {
  id: string;
  text: string;
  done: boolean;
}

/**
 * What is on the player's mind this season. These are prompts, not a score:
 * the money that has to be found, and the people and habits worth making
 * room for.
 */
export function goalsFor(state: LifeState, me: Me): Goal[] {
  const did = (...ids: string[]) => ids.some((id) => state.season.includes(id));
  const partner = partnerOf(state, me);
  const due = Math.min(state.payment, state.mortgage) + 220 + state.children.length * 90 - (state.stage === "married" ? 420 : 0);
  const first: Goal[] = [{ id: "bills", text: state.mortgage > 0 ? `Have $${due} ready for the mortgage and the bills` : `Keep $${Math.max(due, 0)} by for the bills`, done: state.money >= due }];
  if (state.energy <= 1 || (did("rest", "away", "walk") && state.energy <= 3)) first.push({ id: "rest", text: "Rest. You are running on very little.", done: did("rest", "away", "walk") });

  const rest: Goal[] = [];
  if (state.stage === "single" && state.flags.includes("met")) rest.push({ id: "coffee", text: "Have that coffee", done: false });
  if (state.stage !== "single" && partner) rest.push({ id: "partner", text: `An evening with ${partner.name}`, done: did("date") });
  if (state.children.length) rest.push({ id: "kids", text: `Give ${state.children[state.children.length - 1].name} an afternoon`, done: did("play") });
  if (state.bonds.walt < 5) rest.push({ id: "walt", text: state.bonds.walt === 0 ? "Meet the man next door" : "Look in on Walt", done: did("walt") });
  rest.push(owns(state, "table") ? { id: "host", text: "Have people round your table", done: did("host") } : { id: "table", text: "Save for a kitchen table, so people can come round ($150)", done: false });
  rest.push(state.prayers.length === 0 ? { id: "list", text: "Bring something to God, and put it on your prayer list", done: false } : { id: "pray", text: "Stop and pray", done: did("pray", "church") });
  if (state.flags.includes("met") === false && state.stage === "single") rest.push({ id: "church", text: "Go along to the chapel on Sunday", done: did("church") });

  // Three of the rest, taking turns from season to season, so no one thing nags.
  const start = state.turn % rest.length;
  const turn = [...rest.slice(start), ...rest.slice(0, start)].slice(0, 4 - first.length);
  return [...first, ...turn];
}
