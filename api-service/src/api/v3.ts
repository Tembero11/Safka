import cors from "cors";
import { Router } from "express";
import { Weekday } from "../types";
import { apiResponse } from "./apiResponse";
import { getWeek, getYear, subDays } from "date-fns";
import { DatabaseMenu } from "../database/dbTypes";
import { archiver } from "../";
import { Archiver } from "../database/archiver";
import restaurants from "../restaurants";
import { validateDateRange, validateRestaurantId } from "./middlewares/validation";
import { parse } from "date-fns";

const api = Router();
api.use(cors());

api.get("/v3/restaurants", async (req, res) => {
  return apiResponse(res, 200, { restaurants });
});

api.get("/v3/menu/:restaurantId", validateRestaurantId, async (req, res) => {
  const currentWeek = getWeek(new Date());
  const currentYear = getYear(new Date());

  const restaurantId = res.locals.restaurantId;

  const pipeline = [{ $sort: { dayId: 1, version: -1 } },
    { $match: { restaurantId: restaurantId, week: { weekNumber: currentWeek, year: currentYear }}},
    { $group: { _id: "$dayId", doc_with_max_ver: { $first: "$$ROOT" } } },
    { $replaceWith: "$doc_with_max_ver" },
    { $sort: { dayId: 1 } }
  ];

  const menus = await archiver.foods.aggregate<DatabaseMenu>(pipeline).toArray();

  const payload = Archiver.fromDatabaseMenus(menus);

  return apiResponse(res, 200, { ...payload });
});

api.get("/v3/menu/:restaurantId/today", validateRestaurantId, async (req, res) => {
  const today = new Date();
  const yesterday = subDays(today, 1);

  const restaurantId = res.locals.restaurantId;
  // Finds the current date
  // This method is used because finding exact ISO date string is really unreliable and annoying
  const todaysMenu = await archiver.foods.findOne<DatabaseMenu>({ restaurantId: restaurantId, date: { $gte: yesterday, $lt: today } });
  if (!todaysMenu) {
    return apiResponse(res, 500);
  }

  const payload = Archiver.fromDatabaseMenu(todaysMenu);

  return apiResponse(res, 200, { ...payload });
});

api.get("/v3/menu/:restaurantId/between", validateRestaurantId, validateDateRange, async (req, res) => {
  const { startDate, endDate } = res.locals.dateRange;
  const  restaurantId = res.locals.restaurantId;

  console.log(startDate, endDate);

  const pipeline = [{ $sort: { date: 1, version: -1 } },
    { $match: { restaurantId: restaurantId, date: { $gte: startDate, $lte: endDate } }},
    { $group: { _id: "$dayId", doc_with_max_ver: { $first: "$$ROOT" } } },
    { $replaceWith: "$doc_with_max_ver" },
    { $sort: { date: 1 } }
  ];

  const menusForRange = await archiver.foods.aggregate<DatabaseMenu>(pipeline).toArray();

  const payload = menusForRange.map(Archiver.fromDatabaseMenu);
  console.log(payload);
  return apiResponse(res, 200, { ...payload });
});

api.get("/v3/menu/:restaurantId/:dayId", validateRestaurantId, async (req, res) => {
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
});


export default api;
