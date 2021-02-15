const express = require("express");
const validator = require("validator");
const router = express.Router();

const User = require("./../models/user.models");
const { signaccesstoken } = require("./../helpers/jwt.helpers");

//creating a new user
router.post("/signup", async (req, res, next) => {
	try {
	console.log(req.body);

	let { email, password, mobile } = req.body;

	if (!email || !password || !mobile) throw new Error("please enter emailid and password");
	if (!validator.isEmail(email) || !validator.isMobilePhone(mobile,"en-IN")) 	throw new Error("enter a valid email and valid phone number");
	
	
		let duplicateemail = await User.findOne({ email: email });
		let phonenumber = await User.findOne({ mobile: mobile });
		
		if (duplicateemail || phonenumber) throw new Error("please enter unique email and phone number");

		let user = await new User({ email, password, mobile });
		 await user.save();
		const token = await signaccesstoken(user.id,user.email);

		res.status(201).send({ token: token, saveduser:user });
	} catch (error) {
		next(error);
	}
});

//existing user to signin
router.post("/signin", async (req, res, next) => {
	// res.send("good");
	try {
	let { email, password } = req.body;
	if (!email || !password) throw new Error("please enter emailid and password");

	
		let usersearchbyemail = await User.findOne({ email: email });
		let usersearchbymobile = await User.findOne({mobile:email}); 
		//user can login by both email and phone number
		if (!usersearchbyemail && !usersearchbymobile) throw new Error("enter valid email password");

		let userexist = usersearchbyemail || usersearchbymobile;
		let result = await userexist.isvalid(password);
		if (!result) throw new Error("enter valid email password");

		const token = await signaccesstoken(userexist.id, userexist.email);

		res.status(200).send({success: token });
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
