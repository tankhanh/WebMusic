const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Songs = new Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  File: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("songs", Songs);
