const express = require("express");
const app = express.Router();

const userroutes = require("./user.routes");
const vendorroutes = require("./vendor.routers");
const userrouter = require("./review.router");

app.use("/user", userroutes);
app.use("/vendor", vendorroutes);
app.use("/review", userrouter);


module.exports = app;
