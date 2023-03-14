import { Collection, Db, MongoClient } from "mongodb";
import { DB_NAME, DB_URL } from "..";
import { Food } from "../types";

const connect = async (dbUrl: string, dbName: string) => {
    console.log("-- MIGRATION SCRIPT --")
    console.log(`\nAttempting connection to "${dbUrl}"...\nProgram will exit if connection does not succeed\n`);

    try {
        // Creating a client
        const client = await MongoClient.connect(dbUrl);
        return client.db(dbName)
    } catch (err) {
        console.log(`Error happened. Shutting down. Logs: ${err}`);
        process.exit(1);
    }
}

const migrate = async () => {
    const db: Db = await connect(DB_URL, DB_NAME);
    const collection: Collection = db.collection("foods");

    await collection.find({}).forEach((doc) => {
        doc.foods.forEach((element: Food[], index: number) => {
            const names = [doc.foods[index].name]
            const diets = [doc.foods[index].isLactoseFree, doc.foods[index].isDairyFree, doc.foods[index].isGlutenFree]
            console.log(names)
            console.log(diets)
        });
    })
}

migrate()

  //       for (let i = 0; i < 6+1; i++) {
  //       const isEntrySaved: boolean = await collection.findOne({ hash: convertedMenu[i].hash }) !== null;
  //       const isDuplicate: boolean = await collection.findOne({ date: convertedMenu[i].date }) !== null;
  //       const isWeekend: boolean = convertedMenu[i].hash === null;
  //
  //       // Version updating; We want our frontend to take the most recent aka the least "problematic" version of the foods data.
  //       // Sometimes they are updated during days because of typos or some other reason. This system basically tries to get around those typos and always
  //       // give users the best service possible.
  //       const oldVer = await collection.findOne({ date: convertedMenu[i].date, hash: !convertedMenu[i].hash });
  //       // In case a match was found, just update the version to be itself + 1
  //       if (oldVer !== null) await collection.updateOne({ date: convertedMenu[i].date}, { $set: { version: oldVer.version + 1}});
  //
  //       // Workdays
  //       if (!isEntrySaved && !isDuplicate && !isWeekend) {
  //         await collection.insertOne(convertedMenu[i]);
  //         // Weekends
  //       } else if (isWeekend && !isDuplicate) {
  //         await collection.insertOne(convertedMenu[i]);
  //       }
  //     }
  //
  //   }
  // }
