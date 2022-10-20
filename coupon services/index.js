const express = require('express')
const app = express()
const morgan = require('morgan')
require("dotenv").config()
const db = require('./models')

const PORT = process.env.PORT || 4500

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))


//couponRoutes

const couponRoutes = require('./routes/couponRoute')
app.use('/coupon', couponRoutes)

// db.sequelize.sync({}).then(()=>{
// console.log("Database sync");
// })

app.listen(PORT, () => { console.log(`Server listening on ${PORT}`); })

