import cors from "cors";
import { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenus } from "../index";
import { WeekMenu, Weekday } from "../types";
import { getCurrentDayIndex } from "../utils";
import { apiResponse } from "./apiResponse";

const api = Router();
api.use(cors());

api.get("/v2/menu", (req, res) => {
  const currentMenu = currentMenus.get(0)?.poller.latestMenu as WeekMenu;
  apiResponse(res, 200, { ...currentMenu });
});

api.get("/v2/menu/today", (req, res) => {
  const currentMenu = currentMenus.get(0)?.poller.latestMenu as WeekMenu;
  const today = getDayFromWeek(currentMenu, getCurrentDayIndex());
  apiResponse(res, 200, { ...today });
});

api.get("/v2/menu/:dayId", (req, res) => {
  const dayId = +req.params.dayId;

  if (Object.hasOwn(Weekday, dayId)) {
    const currentMenu = currentMenus.get(0)?.poller.latestMenu as WeekMenu;
    const day = getDayFromWeek(currentMenu, dayId);
    apiResponse(res, 200, { ...day });
  } else {
    apiResponse(res, 400, { msg: "Invalid dayId" });
  }
});

export default api;
