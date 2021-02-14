const express = require("express");
const validator = require("validator");
const router = express.Router();

const Vendor = require("./../models/vendor.models");
const { signaccesstoken } = require("./../helpers/jwt.helpers");

//creating a new user
router.post("/signup", async (req, res, next) => {
	// res.send("good");
	console.log(req.body);

	let { email, password, mobile, business, type, info, state, city, location, adv_payment } = req.body;
	if (!email || !password) res.json({ error: "please enter emailid and password" });

	if (!validator.isEmail(email)) res.json({ error: "enter a valid email" });
	try {
		let duplicateemail = await Vendor.findOne({ email: email });
		let phonenumber = await Vendor.findOne({ mobile: mobile });
		if (duplicateemail || phonenumber) res.json({ error: "please enter unique email or phone number" });

		let user = await new Vendor({ email, password, mobile, business, type, info, state, city, location, adv_payment });
		let saveduser = await user.save();
		const token = await signaccesstoken(saveduser.id, saveduser.email);

		res.send({ token: token, saveduser: saveduser });
	} catch (error) {
		next(error);
	}
});
//existing user to signin
router.post("/signin", async (req, res, next) => {
	// res.send("good");
	let { email, password } = req.body;
	if (!email || !password) res.json({ error: "please enter emailid and password" });

	try {
		let userexist = await Vendor.findOne({ email: email });
		if (!userexist) res.json({ error: "enter valid email password" });

		let result = await userexist.isvalid(password);
		if (!result) res.json({ error: "enter valid email password" });

		const token = await signaccesstoken(userexist.id, userexist.email);

		res.send({ success: token });
	} catch (error) {
		next(error);
	}
});

router.patch("/updatepassword", async (req, res, next) => {
	let { email, password, newpassword } = req.body;
	if (!email || !password || !newpassword) {
		res.json({ error: "plese enter all the fields" });
	}

	try {
		let userexist = await Vendor.findOne({ email: email });
		if (!userexist) res.json({ error: "enter valid email" });

		let result = await userexist.isvalid(password);

		if (!result) res.json({ error: "invalid credentials" });

		userexist.password = newpassword;
		await userexist.save();
		res.json({ success: "password updated" });
	} catch (error) {
		next(error);
	}
});

router.patch("/updatedetail", async (req, res, next) => {
	console.log("this 1 is triggred");
	let { email, newemail } = req.body;

	const result = await Vendor.findOne({ email: email });
	if (!result) res.send("enter valid email");
	result.email = newemail;
	const result2 = await result.save();
	res.send(result2);
});

module.exports = router;
