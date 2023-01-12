import { Weekday, WeekMenu } from "./types";

export function getDayFromWeek(week: WeekMenu, day: Weekday | number) {
    return week.days[typeof day == "number" ? day : Object.values(Weekday).indexOf(day)];
}
