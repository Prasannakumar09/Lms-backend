const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    courseId:{
        type:String,
        required:true
    },
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
    },
    mentorname:{
        type:String,
        required : true
    }
},{timestamps : true})

const cartModel = mongoose.model('CartCourse',schema);
module.exports = cartModel 