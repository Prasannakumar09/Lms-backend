const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    description :{
        type:String,
        required : true
    },
    category:{
        type:String,
        required : true
    },
    pricing:{
        type:String,
        required : true
    },status : {
        type:String,
        enum : ['pending','approved','reject'],
        default : 'pending',
    },
    mentorname:{
        type:String,
        required : true
    }
},{timestamps : true})

const course =  mongoose.model('course',schema)
module.exports = course;