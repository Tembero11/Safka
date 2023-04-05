import cors from "cors";
import { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenu } from "../index";
import { Weekday } from "../types";
import { query } from "../database/db";
import { db } from "../index";
import { getCurrentDayIndex } from "../utils";
import { apiResponse } from "./apiResponse";

const api = Router();
api.use(cors());

api.get("/v3/menu", async (req, res) => {
  const data = await query(db, { query: { week: { weekNumber: currentMenu.weekNumber, year: new Date().getFullYear() } } });

  apiResponse(res, 200, { data });
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
