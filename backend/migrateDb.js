const { MongoClient } = require('mongodb');

const URI = "mongodb://vihangadewindi:Test1234@ac-jn1kn8t-shard-00-00.lpe3fz6.mongodb.net:27017,ac-jn1kn8t-shard-00-01.lpe3fz6.mongodb.net:27017,ac-jn1kn8t-shard-00-02.lpe3fz6.mongodb.net:27017/?ssl=true&replicaSet=atlas-v9b0cz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=EchoLearn";

const collectionsToMigrate = ['users', 'lessons', 'lessonprogresses', 'courses', 'progresses'];

async function migrate() {
  const client = new MongoClient(URI);

  try {
    console.log("Connecting to Cluster...");
    await client.connect();

    const dbOld = client.db('test');
    const dbNew = client.db('echolearn');

    for (const colName of collectionsToMigrate) {
      console.log(`\nMigrating collection: ${colName}`);
      const data = await dbOld.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        console.log(`Found ${data.length} documents in test.${colName}.`);
        
        // We delete from the destination to ensure a clean copy of the source data
        await dbNew.collection(colName).deleteMany({});
        
        const result = await dbNew.collection(colName).insertMany(data);
        console.log(`Result: Successfully moved ${result.insertedCount} documents into echolearn.${colName}`);
      } else {
        console.log(`Collection ${colName} is empty in source database (test).`);
      }
    }

    console.log("\nFull Migration from 'test' to 'echolearn' completed successfully!");
    console.log("Now 'echolearn' database is a perfect copy of the 'test' database.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

migrate();
