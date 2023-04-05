import { WeekMenu } from "./types";
import MenuPoller from "./webScrape/MenuPoller";
import dotenv from "dotenv";
import { convertMenu, createClient, saveMenu } from "./database/db";
import assert from "assert";
import { startServer } from "./api/startServer";
import { Db } from "mongodb";

// Env
dotenv.config();

const DISABLE_POLL = process.env.DISABLE_POLL == "true";
const DISABLE_DB = process.env.DISABLE_DB == "true";
export const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
export const DB_NAME = process.env.DB_NAME || "SafkaArchiverDB";
const API_PREFIX = process.env.API_PREFIX || "/api";
export const PORT = process.env.PORT || 5000;

if (DISABLE_POLL) {
  console.log("Menu polling is disabled. This can be changed in the root directory's .env file by setting the 'DISABLE_POLL=false'.");
}
if (DISABLE_DB) {
  console.log("Database is disabled. This can be changed in the root directory's .env file by setting the 'DISABLE_DB=false'.");
}

export let db: Db; // Will remain undefined if not assigned to a client later on
export let currentMenu: WeekMenu;

// Async setup code
(async function() {
  if (!DISABLE_DB) {
    db = await createClient({ dbUrl: DB_URL, dbName: DB_NAME });
    assert(db, new Error("Database undefined"));
  }

  const poller = new MenuPoller({ enableLogs: true });

  poller.on("polled", (menu) => {
    currentMenu = menu;

    // Check that the database is not disabled
    if (!DISABLE_DB) {
      saveMenu(db, convertMenu(currentMenu))
    }
  });

  if (!DISABLE_POLL) poller.startPolling();

  // Start the http api server
  startServer(Number(PORT), { apiBaseRoute: API_PREFIX });
})();
