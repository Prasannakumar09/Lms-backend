const mongoose = require("mongoose");


const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  multipleChoice: { type: Boolean, default: false },
  options: [
    {
      optionId: { type: String, required: true },
      text: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  votedUser: { type: [String], default: [] },  
  votedUserData: { type: [{ userId: String, selectedOptionIds: [String] }], default: [] }
},{timestamps:true});


const Poll = mongoose.model("Polls", pollSchema);

module.exports = Poll;
