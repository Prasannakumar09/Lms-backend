const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  mentorname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true,
  },
});

const files = mongoose.model("assests", schema);

module.exports = files;
