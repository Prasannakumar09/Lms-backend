const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    courseId:{
        type: String,
        required: true
    },
    feedback:{
        type: String,
        required: true
    }
},{timestamps:true})

const feedback = mongoose.model('feedback',schema)
module.exports = feedback 