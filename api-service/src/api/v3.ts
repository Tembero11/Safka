import cors from "cors";
import { Router } from "express";
import { currentMenu } from "../index";
import { Weekday, WeekMenu } from "../types";
import { db } from "../index";
import { apiResponse } from "./apiResponse";
import { subDays } from "date-fns";

const api = Router();
api.use(cors());

api.get("/v3/menu", async (req, res) => {
  const foods = db.collection("foods")
  const wholeWeek: any = [];
  await foods
    // Find using weekNumber AND year since week numbers are not year specific
    .find({ week: { weekNumber: currentMenu.weekNumber, year: new Date().getFullYear() } })
    .forEach(day => wholeWeek.push(day));

  apiResponse(res, 200, { wholeWeek });
});

api.get("/v3/menu/today", async (req, res) => {
  const foods = db.collection("foods")
  const today = new Date();
  const yesterday = subDays(today, 1);

  // Find dates between today and yesterday
  // Finds the current date
  // This method is used because finding exact ISO date string is really unreliable and annoying
  const todaysMenu = await foods.findOne({ date: { $gte: yesterday, $lt: today } });

  apiResponse(res, 200, { ...todaysMenu });
});

api.get("/v3/menu/:dayId", async (req, res) => {
  const foods = db.collection("foods")
  const dayId = +req.params.dayId;

  if (Object.hasOwn(Weekday, dayId)) {
    const menuOnDay = await foods.findOne({ dayId: dayId, week: { weekNumber: currentMenu.weekNumber } })
    apiResponse(res, 200, { ...menuOnDay });
  } else {
    apiResponse(res, 400, { msg: "Invalid dayId" });
  }
});

export default api;
