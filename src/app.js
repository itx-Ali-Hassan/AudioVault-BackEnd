const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const adminRoutes = require('./routing/admin.routes')
const audioRoutes = require('./routing/audio.routes')
const authRoutes = require('./routing/auth.routes')

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/admin', adminRoutes)
app.use('/api/audio', audioRoutes)
app.use('/api/auth', authRoutes)

module.exports = app