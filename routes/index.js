//Dependencies
const express = require('express'),
      // router = express.Router(),
      db = require("../models"),
      app = express();

//get route to root, populating index.handlebars with articles
app.get('/', (req,res) => {
  db.Article
    .find({})
    .then(articles => res.render('index', {articles}))
    .catch(err=> res.json(err));
});

module.exports = app;
