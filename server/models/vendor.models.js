const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const { Schema, model } = mongoose;

export const VENDOR_TYPES = {
	PHOTOGRAPHER: "photographer",
	MAKEUP: "makeup",
	MEHNDI: "mehndi",
	PLANNING_DECOR: "planning_decor",
	FOOD: "food",
	MUSIC_DANCE: "music_dance",
};

const vendorchema = new Schema({
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true,
		match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
	},
	password: {
		type: String,
		trim: true,
		required: true,
		minLength: 5,
	},
	mobile: {
		type: String,
		trim: true,
		unique: true,
	},
	business: {
		type: String,
		trim: true,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	info: {
		type: String,
		trim: true,
		required: true,
	},
	state: {
		type: String,
		trim: true,
		required: true,
	},
	city: {
		type: String,
		trim: true,
		required: true,
	},
	location: {
		type: String,
		trim: true,
		required: true,
	},
	adv_payment: {
		type: Number,
		trim: true,
		required: true,
	},
});

vendorchema.pre("save", async function (next) {
	try {
		if (this.isModified("password")) {
			//this is compulsary
			console.log("save function triggred");
			const salt = await bcrypt.genSalt(10);
			const hashedpassword = await bcrypt.hash(this.password, salt);
			this.password = hashedpassword;
		}

		next();
	} catch (error) {
		next(error);
	}
});
//this function has to run manually by calling it
vendorchema.methods.isvalid = async function (password) {
	try {
		return await bcrypt.compare(password, this.password); //returns boolean
	} catch (error) {
		next(error);
	}
	return 0;
};

const Vendor = model("Vendor", vendorchema);
module.exports = Vendor;