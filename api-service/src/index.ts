import { WeekMenu } from "./types";
import MenuPoller from "./webScrape/MenuPoller";
import dotenv from "dotenv";
import { Archiver, newClient } from "./database/db";
import assert from "assert";
import { startServer } from "./api/startServer";

// Env
dotenv.config();

const DISABLE_POLL = process.env.DISABLE_POLL == "true";
const DISABLE_DB = process.env.DISABLE_DB == "true";
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "SafkaArchiverDB";
const API_PREFIX = process.env.API_PREFIX || "";
export const PORT = process.env.PORT || 5000;

if (DISABLE_POLL) {
console.log("Menu polling is disabled. This can be changed in the root directory's .env file by setting the 'DISABLE_POLL=false'.");
}
if (DISABLE_DB) {
console.log("Database is disabled. This can be changed in the root directory's .env file by setting the 'DISABLE_DB=false'.");
}

export let currentMenu: WeekMenu;
export let archiver: Archiver | undefined;

// Async setup code
(async function () {
// Code for when database enabled
if (!DISABLE_DB) {
    archiver = new Archiver(await newClient({ dbUrl: DB_URL, dbName: DB_NAME }));

    assert(archiver, "Archiver is undefined");
}

const poller = new MenuPoller({ enableLogs: true });

poller.on("polled", (menu) => {
    currentMenu = menu;

    // Check that the database is not disabled
    if (!DISABLE_DB && archiver) {
        // foodArchive menus                                                   
        archiver.weekMenu = currentMenu;
        // Add current menu to MongoDb                                         
        archiver.saveMenus();
    }
});

if (!DISABLE_POLL) poller.startPolling();

// Start the http api server
startServer(Number(PORT), { apiBaseRoute: API_PREFIX });
})();