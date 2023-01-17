import { WeekMenu } from "../types";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { DatabaseMenu, DatabaseWeek } from "./dbTypes";

interface DatabaseOptions {
    dbUrl: string
    dbName: string
}

export class Database {
    dbUrl: string;
    dbName: string; 
    _client?: MongoClient = undefined;
    _db?: Db = undefined;

    constructor(options: DatabaseOptions) {
        this.dbUrl = options.dbUrl;
        this.dbName = options.dbName;
    }
    
    async newClient() {
        // Don't do a new client if we already have a client
        if (this.client !== undefined) return;

        console.log(`\nAttempting connection to "${this.dbUrl}"...\nProgram will exit if connection does not succeed\n`);
        try {
            // Creating a client
            const client = await MongoClient.connect(this.dbUrl);

            console.log(`Connected successfully to server with database "${this.dbName}"\n`);

            // Create a database object used to modify or read the database
            this._db = client.db(this.dbName);
            this._client = client;

            return new Archiver({dbUrl: this.dbUrl, dbName: this.dbName}, this.database as Db);
        } catch (err) {
            console.log(`Error happened. Shutting down. Logs: ${err}`);
            process.exit(1);
        }

    }

    get database() {
        if (this._db !== undefined)  return this._db;
    }

    get client() {
        return this._client;
    }
    
}

///////////////////////////////////////////////////////////

export class Archiver extends Database {
    weekMenu?: WeekMenu;
    _db?: Db = undefined;

    constructor(options: DatabaseOptions, db: Db) {
        super(options);
        this._db = db;
        
    }

    // Converts a WeekMenu to be suited for saving to a database
    private convertMenu(): DatabaseMenu[] | Error {
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
        return daysMenus.length !== 0 ? daysMenus : new Error("Archiver is never given a weekMenu.");
    }

    async saveMenus() {
        if (this._db !== undefined) {
            // Menu conversation
            const convertedMenu = this.convertMenu();
            if (convertedMenu instanceof Error) {
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
                oldVer !== null ? await collection.updateOne({ date: convertedMenu[i].date}, { $set: { version: oldVer.version + 1}}) : null;

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

    // async retrieveEntry(query: Query ) {
    //     if (this._db !== undefined) {
    //         const xd: unknown = await this._db.collection("foods").findOne({"dayMenu.menu": {$elemMatch: {"name": "Lohimurekepihvit"}}})

    //         if (query.weekNumber) console.log(query.weekNumber)
    //         if (query.date) console.log(query.date)
    //     }
    // }
}