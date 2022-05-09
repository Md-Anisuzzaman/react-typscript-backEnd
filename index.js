const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhzyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const database = client.db('typeIelts');
    const coursesCollection = database.collection('Courses');

    //POST API

    app.post('/addcourses', async (req, res) => {
      console.log("hit hit");
      const Courses = req.body;
      const result = await coursesCollection.insertOne(Courses);
      console.log("added course", result);
      res.send(result);
    });

    //Get API

    app.get("/allcourses", async (req, res) => {
      const result = await coursesCollection.find({}).toArray();
      res.send(result);
    });

    // single course details to enroll

    app.get("/singleCourse/:id", async (req, res) => {
      //console.log(req.params.id);
      const query = { _id: ObjectId(req.params.id) }
      const result = await coursesCollection.findOne(query)
      res.send(result);
      //console.log("result vaiya",result);
    });
  }
  finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Ielts BD')
})

app.listen(port, () => {
  console.log(`Hello World! Do You Need Server: ${port}`)
})