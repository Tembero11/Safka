import { MongoClient } from "mongodb";
import { ArchiverOptions, DatabaseOptions } from "./dbTypes";

export async function newClient(options: DatabaseOptions): Promise<ArchiverOptions> {
    console.log(`\nAttempting connection to "${options.dbUrl}"...\nProgram will exit if connection does not succeed\n`);
    try {
        // Creating a client
        const client = await MongoClient.connect(options.dbUrl);

        console.log(`Connected successfully to server with database "${options.dbName}"\n`);

        // Create a database object used to modify or read the database
        const db = client.db(options.dbName);

        // return new Archiver({ dbUrl: options.dbUrl, dbName: options.dbName }, options.database as Db); // Return a new archiver which holds crucial data in order to CRUD mongo
        return { dbName: options.dbName, db: db } as ArchiverOptions;
    } catch (err) {
        console.log(`Error happened. Shutting down. Logs: ${err}`);
        process.exit(1); // If we got to this point, developer wants database enabled and working. If it's not, quit the program. 
    }
}