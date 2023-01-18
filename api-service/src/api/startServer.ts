 import express from "express";
import { archiver } from "..";
import { apiResponse } from "./apiResponse";
import {default as v1} from "./v1";
import {default as v2} from "./v2";

export const app = express();

app.disable("x-powered-by");

interface StartServerOptions {
  apiBaseRoute?: string
}

export function startServer(port: number, options?: StartServerOptions) {
  // Use apiv1 if database is up and running.
  console.log(archiver);
  archiver !== undefined ? app.use(`${options?.apiBaseRoute || "/"}v2`, v2) : app.use(`${options?.apiBaseRoute || "/"}v1`, v1);

  app.get("*", function (req, res) {
    apiResponse(res, 404);
  });
  app.listen(port);
}       