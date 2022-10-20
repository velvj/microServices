const express = require('express')
const app = express()
const morgan = require('morgan')
require("dotenv").config()
const db = require('./models')


const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

//productRoutes
const produtRoutes = require('./routes/productRoute')
app.use('/product', produtRoutes)


// db.sequelize.sync().then(()=>{
// console.log("Database sync");
// })

app.listen(PORT, () => { console.log(`Server listening on ${PORT}`); })

