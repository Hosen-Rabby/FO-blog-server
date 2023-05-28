const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abw17jm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// datas

async function run() {
  try {
    await client.connect();
    console.log("Connected to the database.");

    // collections
    const database = client.db("blog");
    const blogCollection = database.collection("blogs");

    // get blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // get single blogs
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.send(blog);
    });

    // post blog
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.json(result);
    });

    // update blog
    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const blog = req.body;
      option = { upsert: true };
      updatedBlog = {
        $set: {
          name: blog.name,
          summary: blog.summary,
          content: blog.content,
        },
      };
      const result = await blogCollection.updateOne(
        filter,
        updatedBlog,
        option
      );
      res.json(result);
    });

    // delete a blog
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello...");
});

app.listen(port, () => {
  console.log(`Listening ${port}`);
});
