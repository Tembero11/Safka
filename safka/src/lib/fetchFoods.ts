import type { WeekMenu } from "../types";


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