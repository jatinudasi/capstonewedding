const express = require("express");
const validator = require("validator");
const router = express.Router();

const User = require("./../models/user.models");
const { signaccesstoken } = require("./../helpers/jwt.helpers");


//creating a new user
router.post("/signup", async (req, res, next) => {
	// res.send("good");
	console.log(req.body);

	let { email, password, mobile } = req.body;
	if (!email || !password) res.json({ error: "please enter emailid and password" });

	if (!validator.isEmail(email)) res.json({ error: "enter a valid email" });
	try {
		let duplicateemail = await User.findOne({ email: email });
		let phonenumber = await User.findOne({ mobile: mobile });
		if (duplicateemail || phonenumber) res.json({ error: "please enter unique email and phone number" });

		let user = await new User({ email, password, mobile });
		let saveduser = await user.save();
		const token = await signaccesstoken(saveduser.id, saveduser.email, saveduser.mobile);

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
		let userexist = await User.findOne({ email: email });
		if (!userexist) res.json({ error: "enter valid email password" });

		let result = await userexist.isvalid(password);
		if (!result) res.json({ error: "enter valid email password" });

		const token = await signaccesstoken(userexist.id, userexist.email, saveduser.mobile);

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
		let userexist = await User.findOne({ email: email });
		if (!userexist) res.json({ error: "enter valid email password" });

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

	const result = await User.findOne({ email: email });
	if (!result) res.send("enter valid email");
	result.email = newemail;
	const result2 = await result.save();
	res.send(result2);
});



module.exports = router;
