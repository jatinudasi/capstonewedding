const express = require("express");
const app = express.Router();

const userroutes = require("./user.routes");
const vendorroutes = require("./vendor.routers");

app.use("/user", userroutes);
app.use("/vendor", vendorroutes);

module.exports = app;
