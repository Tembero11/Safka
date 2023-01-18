 import express from "express";
import { apiResponse } from "./apiResponse";
import {default as v1} from "./v1";
import {default as v2} from "./v2";

export const app = express();

app.disable("x-powered-by");

interface StartServerOptions {
  apiBaseRoute?: string
}

export function startServer(port: number, options?: StartServerOptions) {
  app.use(`${options?.apiBaseRoute || "/"}v1`, v1);
  app.use(`${options?.apiBaseRoute || "/"}v2`, v2);

  app.get("*", function (req, res) {
    apiResponse(res, 404);
  });
  app.listen(port);
}       