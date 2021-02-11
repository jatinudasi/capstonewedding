const express = require('express');
const app = express.Router();

const userroutes = require('./user.routes')

app.use(userroutes);





module.exports = app;
