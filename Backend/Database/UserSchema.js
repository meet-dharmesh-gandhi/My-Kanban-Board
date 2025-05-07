const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userName: String,
	email: { type: String, required: true, unique: true },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
