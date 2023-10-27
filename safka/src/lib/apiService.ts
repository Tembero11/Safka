import type { ApiUrl, DayMenu, IRestaurant, restaurantId } from "../types";
import { addBusinessDays, isWeekend, nextMonday } from "date-fns";
import { formatDate } from "./utils";

export async function fetchRestaurants(url: ApiUrl): Promise<IRestaurant[] | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            // TODO: Add error handling
            return [];
        }

        const restaurants: IRestaurant[] = (await res.json()).restaurants;
        return restaurants;
    } catch (err) {
        return null;
    }
}


/**
 * Fetches foods from an URL. Automatically filters off weekends.
 * 
 * Menus are queried via the /between-endpoint which uses start and end query strings.
 * 
 * Additional slicing can be controlled via `start` and `end` params.
 * @param url - URL of the API used for fetching.
 * @param restaurant - ID of restaurant where fetch() fetches the foods
 * @returns Week menu from API if fetch was succesful. Returns `null` if fetch wasn't succesful.
 */
export async function fetchFoods(url: ApiUrl, restaurant: restaurantId): Promise<DayMenu[] | null> {
    try {
        const baseline = isWeekend(new Date()) ? nextMonday(new Date()) : new Date();
        const startDate = formatDate(baseline);
        const endDate = formatDate(addBusinessDays(baseline, 3));

        const res = await fetch(`${url}/${restaurant}/between?start=${startDate}&end=${endDate}`);
        if (!res.ok) {
            return null
        }

        const days: DayMenu[] = (await res.json()).days;
        const weekDays = days.filter(day => day.hash); // Filter away weekends, because they have no meals

        return weekDays;
    } catch (err) {
        console.error(err)
        return null;
    }
}