import { WeekMenu } from "./types";
import MenuPoller from "./webScrape/MenuPoller";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/connection";
import { Archiver } from "./database/archiver";
import assert from "assert";
import { startServer } from "./api/startServer";
import { Db } from "mongodb";

// Env
dotenv.config();

const DISABLE_POLL = process.env.DISABLE_POLL == "true";
const DISABLE_DB = process.env.DISABLE_DB == "true" || false;
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
export let archiver: Archiver;

async function run() {
  if (!DISABLE_DB) {
    const db = await connectToDatabase({ dbName: DB_NAME, dbUrl: DB_URL });
    archiver = new Archiver(db);
  }

  const poller = new MenuPoller({ enableLogs: true });

  poller.on("polled", (menu) => {
    currentMenu = menu;

    if (!DISABLE_DB) {
      archiver.saveMenus(currentMenu);
    }
  });

  poller.startPolling();

  startServer(Number(PORT), { apiBaseRoute: API_PREFIX, withDatabase: !DISABLE_DB });
}

run();
