import { MongoClient } from "mongodb";

export interface IDatabaseOptions {
  dbUrl: string;
  dbName: string;
}

export async function connectToDatabase(options: IDatabaseOptions) {
  console.log(`\nAttempting connection to "${options.dbUrl}"...`);

  try {
    const client: MongoClient = await new MongoClient(options.dbUrl).connect();

    console.log("Connection succesfully established!\n");

    // Create a database object used to modify or read the database
    return client.db(options.dbName);

  } catch (err) {
    console.log(`Error happened. Shutting down. Logs: ${err}`);
    process.exit(1);
  }
}