import { Db, ObjectId } from "mongodb";
import { Food, Weekday } from "../types";

export interface ArchiverOptions {
    dbName: string;
    db: Db;
}

export interface DatabaseOptions {
    dbUrl: string;
    dbName: string;
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
    foods: Food[];
}