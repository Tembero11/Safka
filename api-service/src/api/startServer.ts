import cors from "cors";
import express, { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { archiver, currentMenu } from "../index";
import { Weekday } from "../types";
import { getCurrentDayIndex } from "../utils";
import { apiResponse } from "./apiResponse";

export const app = express();

app.disable("x-powered-by");

const api = Router();
api.use(cors());

api.get("/v1/menu", (req, res) => {
  apiResponse(res, 200, { ...currentMenu });
});

api.get("/v1/menu/today", (req, res) => {
  const today = getDayFromWeek(currentMenu, getCurrentDayIndex());

  apiResponse(res, 200, { ...today });
});

api.get("/v1/menu/:dayId", (req, res) => {
  const dayId = +req.params.dayId;

  if (Object.hasOwn(Weekday, dayId)) {
    const day = getDayFromWeek(currentMenu, dayId);
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