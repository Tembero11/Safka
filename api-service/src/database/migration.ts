import { Collection, Db, MongoClient } from "mongodb";
import { DB_NAME, DB_URL } from "..";
import { Food } from "../types";

const connect = async (dbUrl: string, dbName: string) => {
  console.log("-- MIGRATION SCRIPT --");
  console.log(`\nAttempting connection to "${dbUrl}"...\nProgram will exit if connection does not succeed\n`);

  try {
    // Creating a client
    const client = await MongoClient.connect(dbUrl);
    return client.db(dbName);
  } catch (err) {
    console.log(`Error happened. Shutting down. Logs: ${err}`);
    process.exit(1);
  }
};

const migrate = async () => {
  const db: Db = await connect(DB_URL, DB_NAME);
  const collection: Collection = db.collection("foods");

  await collection.find({}).forEach((doc) => {
    // Create new field if doesn't exist or is size 0
    collection.updateOne({ $or: [{ meals: null }, { meals: { $size: 0 } }] }, { $set: { meals: [] } });

    const meals: any[] = [];

    doc.foods.forEach((_: any, index: number) => {
      const names = [doc.foods[index].name];
      const diets =
                [{ isLactoryFree: doc.foods[index].isLactoseFree },
                  { isDairyFree: doc.foods[index].isDairyFree },
                  { isGlutenFree: doc.foods[index].isGlutenFree }];
      const meal = { names: names, diets: diets };

      meals.push(meal);
    });
    collection.updateOne({_id: doc._id}, { $set: { meals: meals }, $unset: { foods: ""}});
  });

  await collection.find({}).forEach(doc => console.log(doc));
};

migrate();
