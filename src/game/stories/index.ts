import { alderRowWeek } from "./alderRowWeek";
import { haldenPryceWeek } from "./haldenPryceWeek";
import { wrenfieldWeek } from "./wrenfieldWeek";
import type { Story } from "../types";

/** The worlds a player can live a week in, in the order they are offered. */
export const STORIES: Story[] = [alderRowWeek, wrenfieldWeek, haldenPryceWeek];
