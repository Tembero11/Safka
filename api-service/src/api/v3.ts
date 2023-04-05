import cors from "cors";
import { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenu } from "../index";
import { Weekday } from "../types";
import { getCurrentDayIndex } from "../utils";
import { apiResponse } from "./apiResponse";

export const api = Router();
api.use(cors());

api.get("/v3/menu", (req, res) => {
  apiResponse(res, 200, { ...currentMenu });
});

api.get("/v3/menu/today", (req, res) => {
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
