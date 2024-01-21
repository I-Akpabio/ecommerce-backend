const express = require("express");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://thelordvoldermort97:AN8erx7lZvtiKjWk@cluster0.mimz9qb.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const ObjectId = require("mongodb").ObjectId;

var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.get("/products", async (req, res) => {
  await client.connect();

  // Send a ping to confirm a successful connection
  const db = client.db("ecommerce");
  const ecommerce = db.collection("products");

  // Query for a movie that has the title 'The Room'
  const query = {};

  // Execute query
  const movie = await ecommerce.find(query).toArray();

  res.send(movie);
});

app.get("/products/:id", async (req, res) => {
  await client.connect();

  // Send a ping to confirm a successful connection
  const db = client.db("ecommerce");
  const ecommerce = db.collection("products");

  // Query for a product with a particular id
  const query = { _id: new ObjectId(req.params.id) };

  // Execute query
  const movie = await ecommerce.find(query).toArray();

  if (movie.length > 0) {
    res.send(movie[0]);
  } else {
    res.send([]);
  }
});

// app.get("/products/similar", async (req, res) => {
//   await client.connect();

//   // Send a ping to confirm a successful connection
//   const db = client.db("ecommerce");
//   const ecommerce = db.collection("products");

//   // Query for a movie that has the title 'The Room'
//   const query = {};

//   // Execute query
//   const movie = await ecommerce.find(query).toArray();

//   // let arr = [];
//   // while (arr.length < 4) {
//   //   let r = Math.floor(Math.random() * 10) + 1;
//   //   if (arr.indexOf(r) === -1) arr.push(r);
//   // }

//   // arr = arr.map((item) => movie[item]);
//   res.send(movie)
// });

app.get("/similar", async (req, res) => {
  try {
    await client.connect();

    // Send a ping to confirm a successful connection
    const db = client.db("ecommerce");
    const ecommerce = db.collection("products");

    // Execute query
    const movie = await ecommerce.find().toArray();

    let arr = [];
    while (arr.length < 4) {
      let r = Math.floor(Math.random() * 10) + 1;
      if (arr.indexOf(r) === -1) arr.push(r)
    }

    arr = arr.map(num => movie[num])

    res.send(arr);
  } catch (e) {
    res.send(e.message);
  }
});

app.get("/cart", async (req, res) => {
  await client.connect();

  // Send a ping to confirm a successful connection
  const db = client.db("ecommerce");
  const ecommerce = db.collection("cart");

  // Query for a movie that has the title 'The Room'
  const query = {};

  // Execute query
  const movie = await ecommerce.find(query).toArray();

  res.send(movie);
});

app.post("/add-to-cart", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("ecommerce");
    const cart = db.collection("cart");

    const payload = {
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      color: req.body.color,
      image: req.body.images[0],
      product: req.body["_id"],
      units: 1,
    };

    await cart.insertOne(payload);

    res.send({ status: 200, data: req.body });
  } catch (e) {
    res.send({ status: 400, error: e });
  }
});

app.post("/update-cart", async (req, res) => {
  await client.connect();
  const db = client.db("ecommerce");
  const cart = db.collection("cart");

  // if(! ){}

  // Create a filter for movies with the title "Random Harvest"
  const filter = { _id: new ObjectId(req.body["_id"]) };
  /* Set the upsert option to insert a document if no documents match
  the filter */
  const options = { upsert: false };
  // Specify the update to set a value for the plot field
  const updateDoc = {
    $set: {
      units: req.body.units,
    },
  };
  // Update the first document that matches the filter
  const result = await cart.updateOne(filter, updateDoc, options);

  console.log(result)

  res.send(result);
});

app.post("/remove-from-cart", async (req, res) => {
  await client.connect();
  const db = client.db("ecommerce");
  const cart = db.collection("cart");

  // Create a filter for movies with the title "Random Harvest"
  const filter = { _id: new ObjectId(req.body["_id"]) };

  const result = await cart.deleteOne(filter);
  /* Print a message that indicates whether the operation deleted a
    document */
  if (result.deletedCount === 1) {
    res.send({ status: 200 });
  } else {
    res.send({ status: 400 });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
