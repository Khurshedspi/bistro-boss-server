const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmklx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // start code here

    //create database and collection for menu data in mongodb  with using db method and collection method
    const menuCollection = client.db("bistroDb").collection("menu");
    //create database and collection for reviews data in mongodb  with using db method and collection method

    const reviewsCollection = client.db("bistroDb").collection("reviews");

    const cartsCollection = client.db("bistroDb").collection("carts");

    // for get menu's  all data from mongodb with using find method
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // for get reviews's  all data from mongodb with using find method
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // for insert cart's data in mongodb with using insertOne method

    // carts collection

    app.get("/carts", async (req, res) => {
      const result = await cartsCollection.find().toArray();
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartsCollection.insertOne(cartItem);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("boss is sitting");
});

app.listen(port, () => {
  console.log(`Bistro Boss is sitting on port $(port)`);
});

/**
 * ------------------------
 * NAMING CONVENTION
 * ---------------------------
 *
 * 1. app.get('/users), for get all users data
 * 2. app.get('/users/:id), for get single user data
 * 3. app.post('/users'), for insert user data
 * 4. app.put('/users/:id'), for update user data
 * 5. app.patch('/users/:id'), for update user data
 * 6. app.delete('/users/:id'), for delete user data
 * 7.
 */
