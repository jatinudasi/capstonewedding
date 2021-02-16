const express = require("express");
const validator = require("validator");
const router = express.Router();

const User = require("./../models/user.models");
const { signaccesstoken } = require("./../helpers/jwt.helpers");
const Vendor = require("../models/vendor.models");
const {usersignup,updatepassword, usersignin, givereview} = require("./../controllers/user.controller");
//creating a new user
router.post("/signup", usersignup);

//existing user to signin
router.post("/signin", usersignin);

router.patch("/updatepassword",updatepassword);

// router.patch("/updatedetail", async (req, res, next) => {
// 	console.log("this 1 is triggred");
// 	let { email, newemail } = req.body;

// 	const result = await User.findOne({ email: email });
// 	if (!result) res.send("enter valid email");
// 	result.email = newemail;
// 	const result2 = await result.save();
// 	res.send(result2);
// });

router.post("/:id/reviews", givereview);

module.exports = router;
