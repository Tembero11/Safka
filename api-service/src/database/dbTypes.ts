import { ObjectId } from "mongodb";
import { DayMenu, Meal, WeekMenu, Weekday } from "../types";

export interface DatabaseOptions {
    dbUrl: string
    dbName: string
}

export interface DatabaseWeek {
    weekNumber: number;
    year: number;
}

export interface DatabaseMenu {
    _id: ObjectId;
    version: number;
    hash: string | null;
    week: DatabaseWeek;
    date: Date;
    dayId: Weekday;
    meals: Meal[];
}

export type PublicDatabaseWeekMenu = Omit<WeekMenu, "modifiedTime" | "days"> & { days: PublicDatabaseDayMenu[] }
export type PublicDatabaseDayMenu = DayMenu & { version: number };