const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    totalQuestion:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    accuracy:{
        type:Number,
        required:true
    }
},{timestamps:true});

const quizResult = mongoose.model('QuizResult',schema)

module.exports = quizResult