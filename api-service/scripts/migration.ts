import { Collection, Db, MongoClient } from "mongodb";

const params = process.argv.slice(2);
if (!params[0]) {
  console.log("Please give name of DB as argument!");
  process.exit(1);
}

const DB_NAME = params[0];
const DB_URL = "mongodb://127.0.0.1:27017";

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
    if (typeof doc.meals !== undefined && doc.meals.length > 0) {
      console.log(`Skipping already migrated id ${doc._id}..`);
      return;
    }

    try {
      // Create new field if doesn't exist or is size 0
      collection.updateOne({ $or: [{ meals: null }, { meals: { $size: 0 } }] }, { $set: { meals: [] } });

      const meals: any[] = [];

      doc.foods.forEach((_: null, index: number) => {
        const names = [doc.foods[index].name];
        const diets =
                [{ isLactoryFree: doc.foods[index].isLactoseFree },
                  { isDairyFree: doc.foods[index].isDairyFree },
                  { isGlutenFree: doc.foods[index].isGlutenFree }];
        const meal = { names: names, diets: diets };

        meals.push(meal);
      });
      collection.updateOne({_id: doc._id}, { $set: { meals: meals }, $unset: { foods: ""}});
      console.log(`Migration of id ${doc._id} succesful!`);

    } catch (err) {
      console.log(`Migration of id ${doc._id} FAILED!!!`);
    }
  });
};

migrate();
