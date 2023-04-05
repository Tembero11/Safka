import cors from "cors";
import { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenu } from "../index";
import { Weekday, WeekMenu } from "../types";
import { db } from "../index";
import { getCurrentDayIndex } from "../utils";
import { apiResponse } from "./apiResponse";

const api = Router();
api.use(cors());

api.get("/v3/menu", async (req, res) => {
  const wholeWeek: any = [];
  await db.collection("foods").find({ week: { weekNumber: currentMenu.weekNumber, year: new Date().getFullYear() } }).forEach(day => wholeWeek.push(day));

  apiResponse(res, 200, { wholeWeek });
});

api.get("/v3/menu/today", async (req, res) => {
  const today = getDayFromWeek(currentMenu, getCurrentDayIndex());

  apiResponse(res, 200, { ...today });
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
