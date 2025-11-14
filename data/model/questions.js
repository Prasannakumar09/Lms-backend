const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    explanation:{
        type:String,
        required:true
    },
    correctans:{
        type:String,
        required:true
    },
    option:[],
},{timestamps:true});

const questions = mongoose.model('Question',schema)

module.exports = questions;