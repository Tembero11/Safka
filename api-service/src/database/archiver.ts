import { Collection, Db, ObjectId } from "mongodb";
import { WeekMenu } from "../types";
import { DatabaseMenu, DatabaseWeek } from "./dbTypes";

export class Archiver {
  _db: Db;
  _foods: Collection;

  constructor(db: Db) {
    this._db = db;
    this._foods = this._db.collection("foods");
  }

  // Converts a WeekMenu to be suited for saving to a database
  private convertMenu(weekMenu: WeekMenu): DatabaseMenu[] {
    const year = new Date().getUTCFullYear();

    return weekMenu.days.map(dayMenu => {
      const weekNumber = weekMenu.weekNumber;
      const weekData: DatabaseWeek = { weekNumber, year };

      const { hash, date, dayId, menu } = dayMenu;
      return { 
        _id: new ObjectId(), 
        version: 0, 
        week: weekData, 
        meals: menu,
        hash,
        date,
        dayId
      };
    });
  }

  async saveMenus(weekMenu: WeekMenu) {
    const convertedMenu = this.convertMenu(weekMenu);

    for (const menu of convertedMenu) {
      const isHashRecorded = await this._foods.findOne({ hash: menu.hash }) !== null;
      const isDateSaved = await this._foods.findOne({ date: menu.date }) !== null;
      const isWeekend = menu.hash === null; // Maybe needed in the future

      // Simple early return so new polls won't cause re-inserts
      if (isDateSaved && isHashRecorded) continue

      // Version updating; We want our frontend to take the most recent aka the least "problematic" version of the foods data.
      // Sometimes they are updated during days because of typos or some other reason. This system basically tries to get around those typos and always
      // give users the best service possible.
      if (isDateSaved && !isHashRecorded) {
        const latestOldVersion = await this._foods.findOne<DatabaseMenu>(
          { date: menu.date }, { sort: { version: -1 } });

        menu.version = latestOldVersion!.version + 1;
      }

      await this._foods.insertOne(menu);
    }
  }
}
