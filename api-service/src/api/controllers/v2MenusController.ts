import { Request, Response } from "express";
import { currentMenus } from "../..";
import { WeekMenu, Weekday } from "../../types";
import { apiResponse } from "../apiResponse";
import { getDayFromWeek } from "../../foodUtils";
import { getCurrentDayIndex } from "../../utils";

export class v2MenusController {
  static getMenus(req: Request, res: Response) {
    const currentMenu = currentMenus.get(0)?.poller.latestMenu as WeekMenu;
    return apiResponse(res, 200, { ...currentMenu });
  }

  static getMenusForToday(req: Request, res: Response) {
    const currentMenu = currentMenus.get(0)?.poller.latestMenu as WeekMenu;
    const today = getDayFromWeek(currentMenu, getCurrentDayIndex());
    return apiResponse(res, 200, { ...today });
  }

  static getMenusForDayId(req: Request, res: Response) {
    const dayId = +req.params.dayId;

    if (Object.hasOwn(Weekday, dayId)) {
      const currentMenu = currentMenus.get(0)?.poller.latestMenu as WeekMenu;
      const day = getDayFromWeek(currentMenu, dayId);
      apiResponse(res, 200, { ...day });
    } else {
      apiResponse(res, 400, { msg: "Invalid dayId" });
    }
  }
}