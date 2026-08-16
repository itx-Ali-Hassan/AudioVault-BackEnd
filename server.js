require('dotenv').config()
const connectDB = require('./src/db/db')
const app = require('./src/app')

async function startServer() {
    const PORT = process.env.PORT || 3000
    await connectDB()
    app.listen(PORT, () => {
        console.log(`server is running on https://localhost:${process.env.PORT}`)
    })
}
startServer()