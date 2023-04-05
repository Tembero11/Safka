import express from "express";
import { apiResponse } from "./apiResponse";

export const app = express();

app.disable("x-powered-by");

api.get("*", function(req, res) {
  apiResponse(res, 404);
});

interface StartServerOptions {
  apiBaseRoute?: string
  withDatabase?: boolean
}

export function startServer(port: number, options?: StartServerOptions) {
  app.use(options?.apiBaseRoute || "/api", api);
  app.listen(port);
}
