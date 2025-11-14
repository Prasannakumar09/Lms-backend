const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required : true
    },
    role :{
        type:String,
        required : true
    },
    password:{
        type:String,
        required : true
    }
},{timestamps : true})

 
const mentor= mongoose.model('mentor',schema)
module.exports = mentor