const validator = require("validator");
const User = require("./../models/user.models");
const { signaccesstoken } = require("./../helpers/jwt.helpers");

exports.usersignup= async (req, res, next) => {
	try {
		console.log(req.body);

		let { email, password, mobile } = req.body;

		if (!email || !password || !mobile) throw new Error("please enter emailid and password");
		if (!validator.isEmail(email) || !validator.isMobilePhone(mobile, "en-IN")) throw new Error("enter a valid email and valid phone number");

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
}


exports.usersignin = async (req, res, next) => {
	// res.send("good");
	try {
		let { email, password } = req.body;
		if (!email || !password) throw new Error("please enter emailid and password");

		let usersearchbyemail = await User.findOne({ email: email });
		let usersearchbymobile = await User.findOne({ mobile: email });
		//user can login by both email and phone number
		if (!usersearchbyemail && !usersearchbymobile) throw new Error("enter valid email password");

		let userexist = usersearchbyemail || usersearchbymobile;
		let result = await userexist.isvalid(password);
		if (!result) throw new Error("enter valid email password");

		const token = await signaccesstoken(userexist.id, userexist.email, saveduser.mobile);

		res.status(200).send({ success: token });
	} catch (error) {
		next(error);
	}
}


exports.updatepassword = async (req, res, next) => {
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
}


exports.givereview =async (req, res,next) => {
	try {
		const vendor = await Vendor.findById(req.params.id);
		if (!vendor) 
		throw new Error("vendor Not Found");

			const review = {
				name: req.body.name,
				rating: Number(req.body.rating),
				comment: req.body.comment,
			};
			vendor.reviews.push(review);
			vendor.numReviews = vendor.reviews.length;
			vendor.rating = vendor.reviews.reduce((a, c) => c.rating + a, 0) / vendor.reviews.length;
			const updatedvendor = await vendor.save();
			res.status(201).send({
				data: updatedvendor.reviews[updatedvendor.reviews.length - 1],
				message: "Review saved successfully.",
			});
	
		
	} catch (error) {

		next(error);
		
	}
	
}
