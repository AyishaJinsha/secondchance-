const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const db = require('./config/db')

const admin = require('./main/admin.js')
const user = require('./main/user.js')
const storeadmin= require('./main/storeadmin.js')
const delivery=require('./main/delivery.js')

app.use(cors())
app.options('*', cors())
app.use(express.json())

// Connect to database
db().then(() => {
    console.log("Database connected, starting server...")
    
    app.use('/user', user)
    app.use('/admin', admin)
    app.use('/storeadmin',storeadmin)
    app.use('/delivery',delivery)

    app.use('/uploads', express.static('uploads'))
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}).catch((error) => {
    console.error("Failed to connect to database:", error)
    process.exit(1)
})
module.exports = app