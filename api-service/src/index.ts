import { IRestaurant, Restaurant, WeekMenu } from "./types";
import MenuPoller from "./webScrape/MenuPoller";
import dotenv from "dotenv";
import { DatabaseConnection } from "./database/db";
import assert from "assert";
import { startServer } from "./api/startServer";
import RESTAURANTS from "./restaurants";
import { Archiver } from "./database/Archiver";

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

export let currentMenus = new Map<Restaurant, { poller: MenuPoller, archiver: Archiver } & IRestaurant>();

export let archiver: Archiver | undefined;

function setupPoller(restaurant: IRestaurant, dbConnection: DatabaseConnection) {
  const poller = new MenuPoller(restaurant, { enableLogs: true });

  const archiver = new Archiver(dbConnection, restaurant);

  currentMenus.set(restaurant.id, {
    poller,
    archiver,
    ...restaurant,
  });

  if (!DISABLE_DB) {
    assert(archiver, "Archiver is undefined");
  }

  poller.on("polled", (menu) => {
    console.log(menu);
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
  const dbConnection = await DatabaseConnection.newClient({ dbUrl: DB_URL, dbName: DB_NAME });

  assert(dbConnection, new Error("Database undefined"));

  RESTAURANTS.forEach((restaurant) => setupPoller(restaurant, dbConnection));

  // Start the http api server
  startServer(Number(PORT), { apiBaseRoute: API_PREFIX });
})();
