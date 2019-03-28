const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  title: String,
  body: String
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
