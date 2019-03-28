//Dependencies
const express = require('express'),
      // router = express.Router(),
      db = require("../models");

      var app = express();

//get route to retrieve all comments for a particlular article
app.get('/getComments/:id', function (req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate('comments')
    .then(results => res.json(results))
    .catch(err => res.json(err));
});

//get route to return a single comment to view it
app.get('/getSingleComment/:id', function (req,res) {
  db.Comment
  .findOne({_id: req.params.id})
  .then( result => res.json(result))
  .catch(err => res.json(err));
});

//post route to create a new comment in the database
app.post('/createComment', function (req,res){
  let { title, body, articleId } = req.body;
  let comment = {
    title,
    body
  };
  db.Comment
    .create(comment)
    .then( result => {
      db.Article
        .findOneAndUpdate({_id: articleId}, {$push:{comments: result._id}},{new:true})//saving reference to comment in corresponding article
        .then( data => res.json(result))
        .catch( err => res.json(err));
    })
    .catch(err => res.json(err));
});

//post route to delete a comment
app.post('/deleteComment', (req,res)=>{
  let {articleId, commentId} = req.body;
  db.Comment
    .remove({_id: commentId})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});


module.exports = app;
