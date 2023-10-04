import { Db, MongoClient } from "mongodb";
import { DatabaseOptions } from "./dbTypes";
import { Archiver } from "./Archiver";

export class DatabaseConnection {
  dbUrl: string;
  dbName: string; 
  _client?: MongoClient = undefined;
  _db?: Db = undefined;

  private constructor(options: DatabaseOptions, client: MongoClient, db: Db) {
    this.dbUrl = options.dbUrl;
    this.dbName = options.dbName;
    this._client = client;
    this._db = db;
  }
    
  static async newClient(options: DatabaseOptions): Promise<DatabaseConnection | undefined> {
    console.log(`\nAttempting connection to "${options.dbUrl}"...\nProgram will exit if connection does not succeed\n`);
    try {
      // Creating a client
      const client = await MongoClient.connect(options.dbUrl);

      console.log(`Connected successfully to server with database "${options.dbName}"\n`);

      return new DatabaseConnection(options, client, client.db(options.dbName));
    } catch (err) {
      console.log(`Error occured. Shutting down. Logs: ${err}`);
      process.exit(1);
    }
  }

  get database(): Db | undefined {
    return this._db;
  }

  get client(): MongoClient | undefined {
    return this._client;
  }
}