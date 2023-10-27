import { apiResponse } from "../apiResponse";
import { Request, Response } from "express";
import { Weekday } from "../../types";
import { getWeek, getYear, nextMonday, subDays } from "date-fns";
import { DatabaseMenu } from "../../database/dbTypes";
import { archiver } from "../../";
import { Archiver } from "../../database/archiver";

export class v3MenusController {
  static async getRestaurantMenus(req: Request, res: Response) {
    const currentYear = getYear(new Date());
    const currentWeek = getWeek(new Date());
    const nextWeeksMonday = nextMonday(new Date());

    const dateQueryData = { year: currentYear, week: currentWeek };

    const restaurantId = res.locals.restaurantId;

    const hasMenusForNextWeek = await archiver.hasMenusAfter(nextWeeksMonday);
    if (hasMenusForNextWeek) {
      // Assigning both again hopefully avoids edge-cases like a new year
      dateQueryData.week = getWeek(nextWeeksMonday);
      dateQueryData.year = getYear(nextWeeksMonday);
    }

    // Core logic of this pipeline gotten from:
    // https://www.mongodb.com/community/forums/t/selecting-documents-with-largest-value-of-a-field/107032
    // This is still very hard for me to grasp currently. So there might be easier methods.
    // But this is the best method I've seen so far.
    const { week, year } = dateQueryData;
    const pipeline = [
      { $match: { restaurantId, "week.weekNumber": week, "week.year": year }},
      { $group: { _id: "$dayId", doc_with_max_ver: { $first: "$$ROOT" } }},
      { $replaceWith: "$doc_with_max_ver" },
      { $sort: { dayId: 1, version: -1 } }
    ];

    const menus = await archiver.foods.aggregate<DatabaseMenu>(pipeline).toArray();

    const payload = Archiver.fromDatabaseMenus(menus);
    if (!payload) {
      return apiResponse(res, 200, 
        { restaurantId, week: { weekNumber: week, year }, days: [] }
      );
    }

    return apiResponse(res, 200, { ...payload });
  }

  static async getTodayMenu(req: Request, res: Response) {
    const today = new Date();
    const yesterday = subDays(today, 1);

    const restaurantId = res.locals.restaurantId;

    const todaysMenu = await archiver.foods.findOne<DatabaseMenu>({ restaurantId, date: { $gte: yesterday, $lt: today } });
    if (!todaysMenu) {
      return apiResponse(res, 500);
    }

    const payload = Archiver.fromDatabaseMenu(todaysMenu);

    return apiResponse(res, 200, { ...payload });
  }

  static async getMenusBetweenDates(req: Request, res: Response) {
    const { startDate, endDate } = res.locals.dateRange;
    const  restaurantId = res.locals.restaurantId;

    // Refer to getRestaurantMenus
    const pipeline = [{ $sort: { date: 1, version: -1 } },
      { $match: { restaurantId: restaurantId, date: { $gte: startDate, $lte: endDate } }},
      { $group: { _id: "$dayId", doc_with_max_ver: { $first: "$$ROOT" } }},
      { $replaceWith: "$doc_with_max_ver" },
      { $sort: { date: 1 } }
    ];

    const menusForRange = await archiver.foods.aggregate<DatabaseMenu>(pipeline).toArray();

    const payload = menusForRange.map(Archiver.fromDatabaseMenu);
    return apiResponse(res, 200, { ...payload });
  }

  static async getMenuByDayId(req: Request, res: Response) {
    const dayId = +req.params.dayId;

    if (!Object.hasOwn(Weekday, dayId)) 
      return apiResponse(res, 400, { msg: "Invalid dayId" });

    const currentWeek = getWeek(new Date());

    const restaurantId = res.locals.restaurantId;
    const menuOnDay = await archiver.foods.findOne({ restaurantId: restaurantId, dayId: dayId, week: { weekNumber: currentWeek, year: new Date().getFullYear() } });
    if (!menuOnDay) {
      return apiResponse(res, 500);
    }

    const payload = Archiver.fromDatabaseMenu(menuOnDay);

    return apiResponse(res, 200, { ...payload });
  }

}