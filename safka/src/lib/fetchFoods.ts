import type { WeekMenu } from "../types";

const URL = "http://localhost:5000/api/v3/menu";
export async function fetchFoods(start?: number, end?: number): Promise<WeekMenu> {
    const res = await fetch(URL);
    if (!res.ok) {
        throw new Error("Menu fetch from API failed");
    }

    const weekMenu = await res.json()

    if (!start && !end) return weekMenu

    const daysLength = weekMenu.days.length - 1
    const days = weekMenu.days
    return { ...weekMenu, days: days.slice(start ?? 0, end ?? daysLength) }
}