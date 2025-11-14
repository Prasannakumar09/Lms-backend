const mongoose = require('mongoose')

const answerschema = new mongoose.Schema({
    mentorId:{
        type: String,
        required: true
    },
    mentorname:{
        type: String,
        required: true
    },
    answer:{
        type: String,
        required: true
    },
},{timestamps:true})
const questionschema = new mongoose.Schema({
    studentId:{
        type: String,
        required: true
    },
    question:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    answer:[answerschema],
},{timestamps:true})

const discussion = mongoose.model('discussion',questionschema)

module.exports = discussion