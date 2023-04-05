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
  if (options?.withDatabase) {
    console.log("ni")
    app.use(options?.apiBaseRoute || "/api", v3)
  } else {
    app.use(options?.apiBaseRoute || "/api", v2);
  }

  app.get("*", function(req, res) {
    apiResponse(res, 404);
  });

  app.listen(port);
}
