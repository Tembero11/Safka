import { Db, MongoClient, ObjectId } from "mongodb";
import { currentMenu, foods, versions } from "..";
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
export function convertToDb(weekMenu: WeekMenu): DatabaseMenu[] {
  const daysMenus: DatabaseMenu[] = [];
  weekMenu.days.forEach((dayMenu) => {
    // New object with date data for the week
    const weekData: DatabaseWeek = { weekNumber: weekMenu.weekNumber, year: new Date().getUTCFullYear() };

    // Construct full object which is then...
    const full = { _id: new ObjectId(), versions: null, hash: dayMenu.hash, week: weekData, date: dayMenu.date, dayId: dayMenu.dayId, meals: dayMenu.menu };
    // pushed into the array
    daysMenus.push(full);
  });
  return daysMenus;
}

export function convertFromDb(ogMenu: DatabaseMenu | DatabaseMenu[]): WeekMenu {
  // Convert to array if not passed in array form
  if (!Array.isArray(ogMenu)) ogMenu = [ogMenu];

  const week: WeekMenu = { modifiedTime: currentMenu.modifiedTime, weekNumber: ogMenu[0].week.weekNumber, days: [] };
  ogMenu.forEach((dayMenu) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, versions, ...rest } = dayMenu;
    week.days.push({ hash: rest.hash, dayId: rest.dayId, date: rest.date, menu: rest.meals });
  });

  return week;
}

export async function saveMenu(convertedMenu: DatabaseMenu[]) {
  for (let i = 0; i < 7; i++) {
    const isMealsHashed: boolean = await foods.findOne({ hash: convertedMenu[i].hash }) !== null;
    const isDuplicate: boolean = await foods.findOne({ date: convertedMenu[i].date }) !== null;
    const isSchoolDay: boolean = convertedMenu[i].hash !== null;

    // Version updating; We want our frontend to take the most recent aka the least "problematic" version of the foods data.
    // Sometimes they are updated during days because of typos or some other reason. This system basically tries to get around those typos and always
    // give users the best service possible.
    const oldVer = await foods.find(
      { date: convertedMenu[i].date, $and: [ { hash: { $ne: null }}, { hash: { $ne: convertedMenu[i].hash }}]}).sort({ "version": -1 }).limit(1).toArray();

    if (oldVer[0]) {
      await versions.insertOne({ ...convertedMenu[i], version: oldVer[0].version + 1 });
    }

    // Workdays
    else if (!isMealsHashed && !isDuplicate && isSchoolDay) {
      await foods.insertOne(convertedMenu[i]);
    // Weekends
    } else if (!isSchoolDay && !isDuplicate) {
      await foods.insertOne(convertedMenu[i]);
    }
  }
}
