const express = require('express')
const app = express()
const port = process.env.PORT||5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
app.use(cors())
app.use(express.json())
const jwt = require("jsonwebtoken");
// e-commerce
// mj4PXbbg2ylidBIu



const uri = "mongodb+srv://e-commerce:mj4PXbbg2ylidBIu@cluster0.f7zs7lw.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({ error: true, message: "unauthorized acess" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, 'ab24491a7c9a237b41e578935b549e50a88e1a19b29d61cc0017c0bc7a8ba3299c6c9b9877f0660bd22a17a4eb3be7b6b40c0bafc97724ac9122fd4d58c27d43', function (error, decoded) {
    if (error) {
      return res
        .status(403)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


const ecommerceUsersCollections=client.db("ecommerceUsersDB").collection("ecommerceUsersCollections")

const productsCollections=client.db("productsDB").collection("productsCollections")
const cartCollections=client.db("cartDB").collection("cartCollections")


app.get("/allusers/admin/:email",  async (req, res) => {
  const email = req.params.email;
 
  const query = { email: email };
  const user = await ecommerceUsersCollections.findOne(query);
  const result = { admin: user?.role === "admin"||false };
  console.log(result);
  res.send(result); 
});



app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, 'ab24491a7c9a237b41e578935b549e50a88e1a19b29d61cc0017c0bc7a8ba3299c6c9b9877f0660bd22a17a4eb3be7b6b40c0bafc97724ac9122fd4d58c27d43', {
    expiresIn: "1h",
  });
  res.send({ token });
});








app.post('/carts', async (req, res) => {
    const cart = req.body;
    

    const result = await cartCollections.insertOne(cart);
    res.send(result);
  });

  app.get('/carts', async (req, res) => {
  

    const result = await cartCollections.find().toArray();
    res.send(result);
  });

  app.delete('/carts/:id', async (req, res) => {
  let query={_id: new ObjectId(req.params.id)}

    const result = await cartCollections.deleteOne(query);
    res.send(result);
  });


app.post('/products', async (req, res) => {
    const user = req.body;

    const result = await productsCollections.insertOne(user);
    res.send(result);
  });


app.get('/products', async (req, res) => {
 
    const result = await productsCollections.find().toArray();
    res.send(result);
  });

  app.get('/products/:id', async (req, res) => {
 let query={_id: new ObjectId(req.params.id)}
    const result = await productsCollections.findOne(query)
    res.send(result);
  });


  app.get('/allusers/:id', async (req, res) => {
    let query={_id: new ObjectId(req.params.id)}
       const result = await ecommerceUsersCollections.findOne(query)
       res.send(result);
     });
   




app.post('/allusers', async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await ecommerceUsersCollections.findOne(query);
    if (existingUser) {
      return res.send({ message: 'User already exists' });
    }
    const result = await ecommerceUsersCollections.insertOne(user);
    res.send(result);
  });



  app.get('/allusers',verifyJWT, async (req, res) => {
 
    const result = await ecommerceUsersCollections.find().toArray();
    res.send(result);
  });




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);














app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})