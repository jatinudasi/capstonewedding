const jwt = require("jsonwebtoken");

module.exports = {
	signaccesstoken: async (userid, useremail, usermobile) => {
		return new Promise((resolve, reject) => {
			const payload = {
				email: useremail,
				id: userid,
				mobile: usermobile,
			};
			const secret = process.env.jwtkey;
			const optains = { expiresIn: "1h" };
			jwt.sign(payload, secret, optains, (err, token) => {
				if (token) {
					return resolve(token);
				}
				reject(err);
			});
		});
	},
	verifyaccesstoken: async (req, res, next) => {
		if (!req.headers["authorization"]) return next(new Error("jwt token not present"));
		const token = req.headers["authorization"].split(" ")[1];
		console.log(token);
		jwt.verify(token, process.env.jwtkey, (err, payload) => {
			if (err) {
				return next(new Error("jwt token expired"));
			}
			req.payload = payload;
			next();
		});
	},
};
