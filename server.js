const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const server = express()
const route = require('./data/routes/route')
const path = require('path')

mongoose.connect('mongodb://localhost:27017/lms')
.then(() => {
    console.log("connected to DB successfully")
})
.catch((err) => {
    console.log('DB connection failed')
});

server.use(express.json());
server.use(cors({allowedHeaders: ['Content-Type', 'Authorization']}))
server.use('/api',route)
server.use("/uploads", express.static(path.join(__dirname, "data/uploads")))
server.listen(3000,() => {
    console.log('server is listening')
})
