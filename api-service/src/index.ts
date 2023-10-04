import { IRestaurant, Restaurant, WeekMenu } from "./types";
import MenuPoller from "./webScrape/MenuPoller";
import dotenv from "dotenv";
import { Database } from "./database/db";
import { Archiver } from "./database/db";
import assert from "assert";
import { startServer } from "./api/startServer";
import RESTAURANTS from "./restaurants";

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

export let currentMenus = new Map<Restaurant, { poller: MenuPoller } & IRestaurant>();

export let archiver: Archiver | undefined;

function setupPoller(restaurant: IRestaurant) {
  const poller = new MenuPoller(restaurant, { enableLogs: true });

  currentMenus.set(restaurant.id, {
    poller,
    ...restaurant,
  });

  poller.on("polled", (menu) => {
    // Check that the database is not disabled
    if (!DISABLE_DB && archiver) {
      // foodArchive menus
      archiver.weekMenu = menu;
      // Add current menu to MongoDb
      archiver.saveMenus();
    }
  });

  if (!DISABLE_POLL) poller.startPolling();
}

// Async setup code
(async function () {
  const db = new Database({ dbUrl: DB_URL, dbName: DB_NAME });

  assert(db, new Error("Database undefined"));

  if (!DISABLE_DB) {
    archiver = await db.newClient();
    assert(archiver, "Archiver is undefined");
  }

  RESTAURANTS.forEach(setupPoller);

  // Start the http api server
  startServer(Number(PORT), { apiBaseRoute: API_PREFIX });
})();
