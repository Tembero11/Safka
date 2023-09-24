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
    versions: IDatabaseVersion[] | null;
    hash: string | null;
    week: DatabaseWeek;
    date: Date;
    dayId: Weekday;
    meals: Meal[];
}

export interface IDatabaseVersion {
    version: number;
    id: ObjectId;
}
