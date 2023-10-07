//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to Daily Journal, your daily source of inspiration and knowledge. Our mission is to bring you engaging and thought-provoking content on a wide range of topics, from personal growth and lifestyle to technology and current events. Whether you're looking for insightful articles, helpful tips, or simply a daily dose of positivity, you've come to the right place.Explore our latest articles, discover exciting stories, and join us on this journey of learning and discovery. We're dedicated to providing you with fresh and valuable content every day. Let's embark on this adventure together.";
const aboutContent = "Hello, I'm Satyam Sharma, the founder of Daily Journal. I started this blog as a passion project with a simple goal in mind: to share knowledge, insights, and stories that inspire and inform. What began as a personal endeavor has grown into a vibrant community of readers and contributors.At Daily Journal, our mission is to provide you with content that enriches your life. We cover a wide range of topics, including personal development, travel, technology, and more. Our team of dedicated writers and editors is committed to delivering valuable, well-researched articles.We believe that every day is an opportunity to learn something new and make a positive impact. Thank you for joining us on this journey of discovery and growth.";
const contactContent = "We welcome your feedback, questions, and collaboration ideas. Whether you'd like to share your thoughts, inquire about our content, or discuss potential business partnerships, there are various ways to connect with us. Feel free to reach out through our contact form, connect on social media, or drop us an email at satya26.am@gmail.com . For business-related inquiries, including collaboration opportunities, advertising, and projects, please contact us at satya26.am@gmail.com . We value your input and are excited to explore opportunities for meaningful connections and ventures.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({})
    .then(postList => {
      res.render("home", { H_content: homeStartingContent, posts: postList });
    })
    .catch(error => {
      console.error('Error finding data:', error);
    });
});

app.get("/about", function (req, res) {
  res.render("about", { A_content: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { C_content: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:content", function (req, res) {

  const onePostId = lodash.capitalize(req.params.content);

  let t = 1;

  Post.findOne({ _id: onePostId })     //look it up
    .then(foundProduct => {
      if (!foundProduct) {
        t = 0;
      }
      res.render("post", { post: foundProduct, t: t });
    })
    .catch(error => {
      console.error('Error finding data:', error);
    });
});

app.post("/compose", function (req, res) {
  const postContent = new Post({
    title: lodash.capitalize(req.body.postTitle),
    content: req.body.postBody
  });
  (async () => {
    try {
      await postContent.save()
      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  })();
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
