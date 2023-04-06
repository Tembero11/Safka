import cors from "cors";
import { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenu } from "../index";
import { Weekday, WeekMenu } from "../types";
import { db } from "../index";
import { apiResponse } from "./apiResponse";
import { addDays, subDays } from "date-fns";

const api = Router();
api.use(cors());

api.get("/v3/menu", async (req, res) => {
  const wholeWeek: any = [];
  await db.collection("foods").find({ week: { weekNumber: currentMenu.weekNumber, year: new Date().getFullYear() } }).forEach(day => wholeWeek.push(day));

  apiResponse(res, 200, { wholeWeek });
});

api.get("/v3/menu/today", async (req, res) => {
  const today = new Date();
  const yesterday = subDays(today, 1);

  // Find dates between today and yesterday
  // Finds the current date
  // This method is used because finding exact ISO date string is really unreliable and annoying
  const todaysMenu = await db.collection("foods").findOne({ date: { $gte: yesterday, $lt: today } });

  apiResponse(res, 200, { ...todaysMenu });
});

api.get("/v3/menu/:dayId", (req, res) => {
  const dayId = +req.params.dayId;

  if (Object.hasOwn(Weekday, dayId)) {
    const day = getDayFromWeek(currentMenu, dayId);
    apiResponse(res, 200, { ...day });
  } else {
    apiResponse(res, 400, { msg: "Invalid dayId" });
  }
});

export default api;
