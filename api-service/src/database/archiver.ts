import { Db, ObjectId, Collection } from "mongodb";
import { WeekMenu } from "../types";
import { ArchiverOptions, DatabaseMenu, DatabaseQuery, DatabaseWeek } from "./dbTypes";

export class Archiver {
    weekMenu?: WeekMenu;
    _db: Db;

    constructor(options: ArchiverOptions) {
        this._db = options.db;
    }

    // Converts a WeekMenu to be suited for saving to a database
    private convertMenu(): DatabaseMenu[] {
        const daysMenus: DatabaseMenu[] = [];
        if (this.weekMenu !== undefined) {
            this.weekMenu.days.forEach((dayMenu) => {
                // New object with date data for the week
                const weekData: DatabaseWeek = { weekNumber: (this.weekMenu as WeekMenu).weekNumber, year: new Date().getUTCFullYear() };

                // Construct full object which is then...
                const full = { _id: new ObjectId(), version: 0, hash: dayMenu.hash, week: weekData, date: dayMenu.date, dayId: dayMenu.dayId, foods: dayMenu.menu };
                // pushed into the array
                daysMenus.push(full);
            });
        }
        if (daysMenus.length === 0) throw new Error("Archiver is never given a weekMenu.");
        return daysMenus;
    }

    async saveMenus() {
        if (this._db !== undefined) {
            // Menu conversation
            let convertedMenu: DatabaseMenu[];
            try {
                convertedMenu = this.convertMenu();
            } catch (err) {
                console.error("Menu cannot be saved to database, no non-undefined menu was given to Archiver.");
                return;
            }

            const collection: Collection = this._db.collection("foods");

            for (let i = 0; i < 6+1; i++) {
                const isEntrySaved: boolean = await collection.findOne({ hash: convertedMenu[i].hash }) !== null;
                const isDuplicate: boolean = await collection.findOne({ date: convertedMenu[i].date }) !== null;
                const isWeekend: boolean = convertedMenu[i].hash === null;

                // Version updating; We want our frontend to take the most recent aka the least "problematic" version of the foods data.
                // Sometimes they are updated during days because of typos or some other reason. This system basically tries to get around those typos and always
                // give users the best service possible.
                const oldVer = await collection.findOne({ date: convertedMenu[i].date, hash: !convertedMenu[i].hash });
                // In case a match was found, just update the version to be itself + 1
                if (oldVer !== null) await collection.updateOne({ date: convertedMenu[i].date}, { $set: { version: oldVer.version + 1}});

                // Workdays
                if (!isEntrySaved && !isDuplicate && !isWeekend) {
                    await collection.insertOne(convertedMenu[i]);
                // Weekends
                } else if (isWeekend && !isDuplicate) {
                    await collection.insertOne(convertedMenu[i]);
                }
            }

        }
    }

    async query(query: DatabaseQuery): Promise<DatabaseMenu | DatabaseMenu[]> {
//         function menuArrBuilder(elemCount: number, oldArr: DatabaseMenu[]): DatabaseMenu[] {
//             const arr: DatabaseMenu[] = [];
//             for (let j = 0; j < elemCount; j++);
//                 arr.push(oldArr[j] as DatabaseMenu);
//             return arr as DatabaseMenu[];
//         }
// 
        const collection: Collection = this._db.collection("foods");

        if (Object.keys(query.query).length <= 0) return {} as DatabaseMenu;

        // Search from the collection based on query terms and after turning results to an array, remove mongoids
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await (await collection.find(query.query).toArray()).map(({_id, ...item}) => item) as DatabaseMenu[];

        if (result.length === 1) return result[0] as DatabaseMenu;

        if (query.opts?.count !== undefined && query.opts.count >= 1) {
            return result[0] as DatabaseMenu;
        } 

        return result;
    }
}

    //         const xd: unknown = await this._db.collection("foods").findOne({"dayMenu.menu": {$elemMatch: {"name": "Lohimurekepihvit"}}});