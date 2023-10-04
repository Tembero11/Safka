import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { WeekMenu } from "../types";
import { DatabaseMenu, DatabaseWeek } from "./dbTypes";

export interface IDatabaseOptions {
  dbUrl: string;
  dbName: string; 
}

export function connectToDatabase(options: IDatabaseOptions) {
  console.log(`\nAttempting connection to "${options.dbUrl}"...\nProgram will exit if connection does not succeed\n`);
  let client: MongoClient = new MongoClient(options.dbUrl);

  (async function () {
    try {
      await client.connect();
      console.log(`Connection to ${options.dbName} succesful!`);
    } catch (err) {
      console.log(`Error happened. Shutting down. Logs: ${err}`);
      process.exit(1);
    }
    // Creating a client
  })()

  // Create a database object used to modify or read the database
  return client.db(options.dbName);
}

export class Archiver {
  weekMenu?: WeekMenu;
  _db: Db

  constructor(db: Db) {
    this._db = db;
  }

  // Converts a WeekMenu to be suited for saving to a database
  private convertMenu(): DatabaseMenu[] {
    const daysMenus: DatabaseMenu[] = [];
    if (this.weekMenu !== undefined) {
      this.weekMenu.days.forEach((dayMenu) => {
        // New object with date data for the week
        const weekData: DatabaseWeek = { weekNumber: (this.weekMenu as WeekMenu).weekNumber, year: new Date().getUTCFullYear() };

        // Construct full object which is then...
        const full = { _id: new ObjectId(), version: 0, hash: dayMenu.hash, week: weekData, date: dayMenu.date, dayId: dayMenu.dayId, meals: dayMenu.menu };
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

      for (let i = 0; i < 6 + 1; i++) {
        const isEntrySaved: boolean = await collection.findOne({ hash: convertedMenu[i].hash }) !== null;
        const isDuplicate: boolean = await collection.findOne({ date: convertedMenu[i].date }) !== null;
        const isWeekend: boolean = convertedMenu[i].hash === null;

        // Version updating; We want our frontend to take the most recent aka the least "problematic" version of the foods data.
        // Sometimes they are updated during days because of typos or some other reason. This system basically tries to get around those typos and always
        // give users the best service possible.
        const oldVer = await collection.findOne({ date: convertedMenu[i].date, hash: !convertedMenu[i].hash });
        // In case a match was found, just update the version to be itself + 1
        if (oldVer !== null) await collection.updateOne({ date: convertedMenu[i].date }, { $set: { version: oldVer.version + 1 } });

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

  async query(term: unknown): Promise<DatabaseMenu | null> {
    if (this._db !== undefined) {
      const collection: Collection = this._db.collection("foods");
      const result = await collection.findOne({ date: term });
      if (result) {
        return result as DatabaseMenu;
      }
    }
    return null;
  }
}
