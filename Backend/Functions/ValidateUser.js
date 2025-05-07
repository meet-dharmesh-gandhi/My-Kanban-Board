const jwt = require("jsonwebtoken");
const User = require("../Database/UserSchema");

async function ValidateUser(cookies, jwtSecret) {
	if (!cookies || !Object.keys(cookies).includes("authToken"))
		return [400, "No Cookie Found!"];
	// write the logic for user validation later
	try {
		const token = Buffer.from(cookies.authToken, "base64").toString("utf8");
		const decoded = jwt.verify(token, jwtSecret);
		if (typeof decoded !== "object" || !decoded.userName)
			return [400, "Invalid Cookie!"];
		const userName = decoded.userName;
		const userValid = await checkUserExists(userName);
		if (!userValid) return [400, "Invalid Username!"];
		return [userName];
	} catch (error) {
		console.error("Error while validating user!");
		return [400, "Login Expired!"];
	}
}

async function checkUserExists(userName) {
	const userValid = await User.find({ userName });
	if (userValid.length > 0) return true;
	return false;
}

module.exports = { ValidateUser, checkUserExists };
