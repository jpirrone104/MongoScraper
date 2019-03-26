var mongoose = require("mongoose");

// Save a reference to the Schema constructor


// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var CommentSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Body: {
    type: String,
    required: true
  },
  User: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  Article: { type: mongoose.Schema.Types.ObjectId, ref: "Article"},
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Article model
module.exports = Comment;