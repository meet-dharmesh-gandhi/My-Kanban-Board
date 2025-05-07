const jwt = require("jsonwebtoken");

function createAuthCookie(userName, jwtSecret, secure) {
	const payload = { userName };
	const token = jwt.sign(payload, jwtSecret, { expiresIn: "15d" });
	const base64Encoded = Buffer.from(token).toString("base64");
	return [
		base64Encoded,
		{
			httpOnly: true,
			secure,
			sameSite: secure ? "None" : "Lax",
			maxAge: 15 * 24 * 60 * 60 * 1000,
		},
	];
}

module.exports = {
	createAuthCookie,
};
