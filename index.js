const express = require('express')
const app = express()
const consign = require('consign') // consign will make it easy to import and export modules
const db = require('./config/db') //conection with the database

app.db =  db

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./config/validateToken.js')
    .then('./services/auth')
    .then('./services/quotes')
    .then('./services/users')
    .then('./config/routes.js')
    .into(app)

module.exports = app 
