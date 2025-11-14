const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true})

const message = mongoose.model('Messages',schema)

module.exports = message