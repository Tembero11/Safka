import { ObjectId } from "mongodb";
import { Meal, Weekday } from "../types";

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
    foods: Meal[];
}