const {MongoClient} = require("mongodb");

async function runServer(){
    const url = "mongodb+srv://patelaryan5636_db_user:@mypersonaldatabase.kjlla10.mongodb.net/?appName=Database";

    const client = new MongoClient(url);

    try {
      const database = client.db("sample_mflix");

      const movies= database.collection('comments');

      // const query = { name : "Olenna Tyrell"};
      
      // const movie =  await movies.find({}).toArray;

      try{
        const delete1 = await movies.deleteMany({name: "Doreah"});
        console.log(delete1);
      }
      catch(error){
        consol.log("not found");
      }
      finally{
        console.log("not ");
      }

      // console.log(movie);
    }finally{
      await client.close();
    }
}

runServer().catch(console.dir);