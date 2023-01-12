import { DayMenu, Menus, WeekMenu } from "../types";
import { Db, MongoClient } from 'mongodb';

interface DatabaseOptions {
    dbUrl: string
    dbName: string
}

export class Database {
    dbUrl: string;
    dbName: string; 
    _client?: MongoClient = undefined;
    _db?: Db = undefined;

    constructor(options: DatabaseOptions) {
        this.dbUrl = options.dbUrl;
        this.dbName = options.dbName;
    }
    
    async newClient() {
        // Don't do a new client if we already have a client
        if (this.client !== undefined) {
            return
        }

        console.log(`\nAttempting connection to "${this.dbUrl}"...\nProgram will exit if connection does not succeed\n`)
        try {
            // Creating a client
            const client = await MongoClient.connect(this.dbUrl);

            console.log(`Connected successfully to server with database "${this.dbName}"\n`);

            // Create a database object used to modify or read the database
            this._db = client.db(this.dbName);
            this._client = client;

            return new Archiver({dbUrl: this.dbUrl, dbName: this.dbName}, this.database as Db);
        } catch (err) {
            console.log(`Error happened. Shutting down. Logs: ${err}`);
            process.exit(1);
        }

    }

    get database() {
        if (this._db !== undefined)  return this._db;
    }

    get client() {
        return this._client;
    }
   
}

///////////////////////////////////////////////////////////

interface Query {
    foodName?: string
    weekNumber?: number
    date?: Date
}

export class Archiver extends Database {
    weekMenu?: WeekMenu;
    dayMenu?: DayMenu;
    _db?: Db = undefined

    constructor(options: DatabaseOptions, db: Db) {
        super(options);
        this._db = db
        
    }

    async saveMenus() {
        if (this._db !== undefined) {
            const collection = this._db.collection("foods");
            const menus: Menus = { weekMenu: this.weekMenu as WeekMenu, dayMenu: this.dayMenu as DayMenu }

            await collection.insertOne(menus);
            this.retrieveEntry({foodName: "Riisip", weekNumber: this.weekMenu?.weekNumber})
        }
    }

    async retrieveEntry(query: Query ) {
        if (this._db !== undefined) {
            const xd: unknown = await this._db.collection("foods").findOne({"dayMenu.menu": {$elemMatch: {"name": "Lohimurekepihvit"}}})

            if (query.weekNumber) console.log(query.weekNumber)
            if (query.date) console.log(query.date)
        }
    }
}