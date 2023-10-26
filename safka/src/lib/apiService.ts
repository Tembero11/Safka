import type { ApiUrl, IRestaurant, WeekMenu, restaurantId } from "../types";

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
 * Fetches foods from an URL. Automatically slices off weekends, so days is 5-length and is 0 (monday) to 5 (friday).
 * Additional slicing can be controlled via `start` and `end` params.
 * @param url - URL of the API used for fetching.
 * @param restaurant - ID of restaurant where fetch() fetches the foods
 * @param [start] - Start index of `days`. Example: `2` would start the array from Wednesday.
 * @param [end] - End index of `days`. Example: `4` would cut days off from Thursday.
 * @returns Week menu from API if fetch was succesful. Returns `null` if fetch wasn't succesful.
 */
export async function fetchFoods(url: ApiUrl, restaurant: restaurantId, start?: number, end?: number): Promise<WeekMenu | null> {
    try {
        const res = await fetch(`${url}/${restaurant}`);
        if (!res.ok) {
            return null
        }

        const weekMenu: WeekMenu = await res.json()
        const weekDays = weekMenu.days.slice(0, 5) // Slice away weekends, because they have no meals

        if (!start && !end) return { ...weekMenu, days: weekDays };

        return { ...weekMenu, days: weekDays.slice(start ?? 0, end ?? weekDays.length) }
    } catch (err) {
        return null;
    }
}