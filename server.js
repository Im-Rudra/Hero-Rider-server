const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');
const bufferObj = require('./libs/imgBuffer');

// middlewere
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.listen(port, () => {
  console.log('App is running at port:', port);
});

app.get('/', (req, res) => {
  res.send(`<h1>Server running at port: ${port}</h1>`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ve3u0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db('hero-rider');
    const userCollection = database.collection('users');

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.post('/getUser', async (req, res) => {
      const { email } = req.body;
      const result = await userCollection.findOne({ email });
      res.json(result);
    });

    app.post('/addUser', async (req, res) => {
      const { body, files } = req;
      const { password, password2, ...modBody } = body;
      const imgObj = bufferObj(files);
      const userDoc = { ...modBody, ...imgObj };
      const result = await userCollection.insertOne(userDoc);
      res.json(result);
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    // await client.close();
  }
};

run();
