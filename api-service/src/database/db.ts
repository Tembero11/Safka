import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { WeekMenu } from "../types";
import { DatabaseMenu, DatabaseOptions, DatabaseWeek } from "./dbTypes";

export async function createClient(opts: DatabaseOptions): Promise<Db> {
  console.log(`\nAttempting connection to "${opts.dbUrl}"...\nProgram will exit if connection does not succeed\n`);
  try {
    // Creating a client
    const client = await MongoClient.connect(opts.dbUrl);

    // Everything worked out
    console.log(`Connected successfully to server with database "${opts.dbName}"\n`);

    // Return instance of a Database
    return client.db(opts.dbName);
  } catch (err) {
    console.log(`Error happened. Shutting down. Logs: ${err}`);
    process.exit(1); // Program should not continue if database *should* be live but it can't start
  }
}

// Converts a WeekMenu to be suited for saving to a database
export function convertMenu(weekMenu: WeekMenu): DatabaseMenu[] {
  const daysMenus: DatabaseMenu[] = [];
  weekMenu.days.forEach((dayMenu) => {
    // New object with date data for the week
    const weekData: DatabaseWeek = { weekNumber: (weekMenu as WeekMenu).weekNumber, year: new Date().getUTCFullYear() };

    // Construct full object which is then...
    const full = { _id: new ObjectId(), version: 0, hash: dayMenu.hash, week: weekData, date: dayMenu.date, dayId: dayMenu.dayId, meals: dayMenu.menu };
    // pushed into the array
    daysMenus.push(full);
  });
  return daysMenus;
}

export async function saveMenu(db: Db, convertedMenu: DatabaseMenu[]) {
  const collection: Collection = db.collection("foods");

  for (let i = 0; i < 7; i++) {
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

export async function query(db: Db, term: unknown): Promise<DatabaseMenu | null> {
  const collection: Collection = db.collection("foods");
  const result = await collection.findOne({ date: term });
  if (result) {
    return result as DatabaseMenu;
  }
  return null;
}
