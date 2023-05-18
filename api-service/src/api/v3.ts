import cors from "cors";
import { Router } from "express";
import { currentMenu, foods } from "../index";
import { Weekday } from "../types";
import { db } from "../index";
import { apiResponse } from "./apiResponse";
import { subDays } from "date-fns";
import { DatabaseMenu } from "../database/dbTypes";
import { convertFromDb } from "../database/db";
import { getDayFromWeek } from "../foodUtils";
import { getCurrentDayIndex } from "../utils";

const api = Router();
api.use(cors());

api.get("/v3/menu", async (req, res) => {
  const wholeWeek = await foods
    // Find using weekNumber AND year since week numbers are not year specific
    .find({ week: { weekNumber: currentMenu.weekNumber, year: new Date().getFullYear() } }).toArray() as DatabaseMenu[];

  apiResponse(res, 200, { ...convertFromDb(wholeWeek) });
});

api.get("/v3/menu/today", async (req, res) => {
  const today = new Date();
  const yesterday = subDays(today, 1);

  // Finds the current date
  // This method is used because finding exact ISO date string is really unreliable and annoying
  const todaysMenu = await foods.findOne({ date: { $gte: yesterday, $lt: today } }) as DatabaseMenu;

  apiResponse(res, 200, { ...convertFromDb(todaysMenu).days[0] });
});

api.get("/v3/menu/:dayId", async (req, res) => {
  const dayId = +req.params.dayId;

  if (Object.hasOwn(Weekday, dayId)) {
    const menuOnDay = await foods.findOne({ dayId: dayId, week: { weekNumber: currentMenu.weekNumber, year: new Date().getFullYear() } }) as DatabaseMenu;
    apiResponse(res, 200, { ...convertFromDb(menuOnDay).days[0] });
  } else {
    apiResponse(res, 400, { msg: "Invalid dayId" });
  }
});

export default api;
