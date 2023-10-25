import type { WeekMenu } from "../types";

/**
 * Fetches foods from an URL. Automatically slices off weekends, so days is 5-length and is 0 (monday) to 5 (friday).
 * Additional slicing can be controlled via `start` and `end` params.
 * @param url - URL of the API used for fetching
 * @param start - Start index of `days`. Example: `2` would start days off from Tuesday
 * @param start - End index of `days`. Example: `4` would cut days off from Thursday
 * @param end - URL of the API used for fetching
 * @returns Week menu from API if fetch was succesful. Returns `null` if fetch wasn't succesful.
 */
export async function fetchFoods(url: string, start?: number, end?: number): Promise<WeekMenu | null> {
    const res = await fetch(url);
    if (!res.ok) {
        return null
    }

    const weekMenu: WeekMenu = await res.json()
    const weekDays = weekMenu.days.slice(0, 5) // We don't want to show weekends, which have no meals

    if (!start && !end) return { ...weekMenu, days: weekDays };

    const daysLength = weekDays.length - 1;
    return { ...weekMenu, days: weekDays.slice(start ?? 0, end ?? daysLength) }
}