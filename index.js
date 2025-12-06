const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0nyvlxc.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("petService");
    const petServices = database.collection("services");
    const ordercollection = database.collection("orders");

    app.post("/services", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await petServices.insertOne(data);
      res.send(result);
    });


    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await petServices.findOne(query);
      res.send(result);
    });

    app.get("/my-services", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const result = await petServices.find(query).toArray();

      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: data };
      const result = await petServices.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await petServices.deleteOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to delete service" });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const data = req.body;

    if (!data.email) {
      return res.status(400).send({ message: "User email is required" });
    }

    const result = await ordercollection.insertOne(data);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to place order" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const email = req.query.email;
    const query = {};

    if (email) {
      query.email = email;
    }

    const orders = await ordercollection.find(query).toArray();
    res.send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch orders" });
  }
});


    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developers");
});

app.listen(port, () => {
  console.log(`server is runnion on ${port}`);
});
