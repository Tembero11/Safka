import express from "express";
import { apiResponse } from "./apiResponse";
import v2 from "./v2";
import v3 from "./v3";

export const app = express();

app.disable("x-powered-by");

interface StartServerOptions {
  apiBaseRoute?: string
  withDatabase?: boolean
}

export function startServer(port: number, options?: StartServerOptions) {
  app.use(options?.apiBaseRoute || "/api", options?.withDatabase ? v3 : v2);

  app.get("*", function(req, res) {
    apiResponse(res, 404);
  });

  app.listen(port);
}
