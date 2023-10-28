import { writable } from "svelte/store";
import type { DayMenu, IRestaurant } from "../types";

export const restaurant = writable<IRestaurant>();
export const foods = writable<DayMenu[]>();