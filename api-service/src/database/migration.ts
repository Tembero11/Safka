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
        collection.updateOne({ $or: [{ meals: null }, { meals: { $size: 0 } }] }, { $set: { meals: [] } })
        let meals: any[] = []

        doc.foods.forEach((_: any, index: number) => {
            const names = [doc.foods[index].name]
            const diets =
                [{ isLactoryFree: doc.foods[index].isLactoseFree },
                { isDairyFree: doc.foods[index].isDairyFree },
                { isGlutenFree: doc.foods[index].isGlutenFree }]
            const meal = { names: names, diets: diets }
            meals.push(meal)
        })
        collection.updateOne({_id: doc._id}, { $set: { meals: meals }})
    })

    await collection.find({}).forEach(doc => console.log(doc))
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
