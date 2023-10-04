import cors from "cors";
import express, { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { Restaurant, WeekMenu, Weekday } from "../types";
import { getCurrentDayIndex } from "../utils";
import { apiResponse } from "./apiResponse";
import { currentMenus } from "..";
import RESTAURANTS from "../restaurants";

export const app = express();

app.disable("x-powered-by");

const api = Router();
api.use(cors());

function getMenuFromRestaurantId(id: any): WeekMenu | undefined {
  if (typeof id != "string") return undefined;
  
  const IdNum = +id;
  if (isNaN(IdNum)) return undefined;

  const restaurant = currentMenus.get(IdNum);
  if (!restaurant) return undefined;

  return restaurant.poller.latestMenu;
}

api.get("/v3/restaurants", (req, res) => {
  apiResponse(res, 200, {restaurants: RESTAURANTS});
});


api.get("/v3/menu/:restaurant", (req, res) => {
  const menu = getMenuFromRestaurantId(req.params.restaurant);
  apiResponse(res, 200, { ...menu });
});

api.get("/v3/menu/:restaurant/today", (req, res) => {
  const menu = getMenuFromRestaurantId(req.params.restaurant);
  if (!menu) return apiResponse(res, 404);

  const today = getDayFromWeek(menu, getCurrentDayIndex());

  apiResponse(res, 200, { ...today });
});

api.get("/v3/menu/:restaurant/:dayId", (req, res) => {
  const menu = getMenuFromRestaurantId(req.params.restaurant);
  if (!menu) return apiResponse(res, 404);

  const dayId = +req.params.dayId;

  if (Object.hasOwn(Weekday, dayId)) {
    const day = getDayFromWeek(menu, dayId);
    apiResponse(res, 200, { ...day });
  } else {
    apiResponse(res, 400, { msg: "Invalid dayId" });
  }
});

api.get("*", function (req, res) {
  apiResponse(res, 404);
});


interface StartServerOptions {
  apiBaseRoute?: string
}

export function startServer(port: number, options?: StartServerOptions) {
  app.use(options?.apiBaseRoute || "/api", api);
  app.listen(port);
}