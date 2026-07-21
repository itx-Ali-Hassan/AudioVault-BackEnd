const express = require('express')
require('dotenv').config();

const app = express()

app.get('/', (req, res) => {
    res.send("hello Bro")
})

app.listen(process.env.PORT)