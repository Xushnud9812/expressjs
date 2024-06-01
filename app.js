const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// MongoDB-ga ulanish
mongoose
  .connect(
    "mongodb+srv://xushnud9812:ma8YtZ5vGYzRpvhH@cluster2.trlnhhx.mongodb.net/",
    {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error:", err));

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Post modelini yaratish
const postSchema = new mongoose.Schema({
  id: Number,
  author: String,
  title: String,
  plantsType: String,
  plantsVariety: String,
});
const Post = mongoose.model("Post", postSchema);

// Body-parserni o'rnatish
app.use(bodyParser.urlencoded({ extended: true }));

// Pug shablon dvigatelini o'rnatish
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Root route
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("index", { posts: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Server Error");
  }
});

// Create route
app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  try {
    const { id, author, title, plantsType, plantsVariety } = req.body;
    const post = new Post({ id, author, title, plantsType, plantsVariety });
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Server Error");
  }
});

// Edit route
app.get("/edit/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("edit", { post: post });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).send("Server Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Server Error");
  }
});
app.get("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Server Error");
  }
});

// Delete route

// Serverni boshlash
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
