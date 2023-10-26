import { Collection, Db, ObjectId } from "mongodb";
import { WeekMenu } from "../types";
import { DatabaseMenu, DatabaseWeek, PublicDatabaseDayMenu, PublicDatabaseWeekMenu } from "./dbTypes";

export class Archiver {
  _db: Db;
  foods: Collection<DatabaseMenu>;

  constructor(db: Db) {
    this._db = db;
    this.foods = this._db.collection("foods");
  }

  static fromDatabaseMenu(databaseMenu: DatabaseMenu): PublicDatabaseDayMenu {
    const { hash, dayId, date, meals, version } = databaseMenu;
    return {
      hash,
      version,
      dayId,
      date,
      menu: meals
    };
  }

  static fromDatabaseMenus(databaseMenu: DatabaseMenu[]): PublicDatabaseWeekMenu {
    const days: PublicDatabaseDayMenu[] = databaseMenu.map((menu) => {
      return Archiver.fromDatabaseMenu(menu);
    });

    return { 
      restaurantId: databaseMenu[0].restaurantId, 
      weekNumber: databaseMenu[0].week.weekNumber, 
      days };
  }

  // Converts a WeekMenu to be suited for saving to a database
  private toDatabaseMenus(weekMenu: WeekMenu): DatabaseMenu[] {
    const year = new Date().getUTCFullYear();

    return weekMenu.days.map(dayMenu => {
      const weekNumber = weekMenu.weekNumber;
      const weekData: DatabaseWeek = { weekNumber, year };

      const { hash, date, dayId, menu } = dayMenu;
      return {
        _id: new ObjectId(),
        restaurantId: weekMenu.restaurantId,
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
    const convertedMenu = this.toDatabaseMenus(weekMenu);

    for (const menu of convertedMenu) {
      const sameDateMenu = await this.foods.findOne({ date: menu.date, restaurantId: menu.restaurantId }, 
        { sort: { version: -1}});
      const isSameHash = sameDateMenu?.hash === menu.hash;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const isWeekend = menu.hash === null; // Maybe needed in the future

      // Simple early return so new polls won't cause re-inserts
      if (sameDateMenu && isSameHash) continue;

      // Version updating; We want our frontend to take the most recent aka the least "problematic" version of the foods data.
      // Sometimes they are updated during days because of typos or some other reason. This system basically tries to get around those typos and always
      // give users the best service possible.
      if (sameDateMenu && !isSameHash) {
        menu.version = sameDateMenu.version + 1;
      }

      await this.foods.insertOne(menu);
    }
  }
}

// insert if that date and that hash has been recorded but not for that restaurant.
