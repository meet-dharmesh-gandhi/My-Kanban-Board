const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
	userName: { type: String, required: true },
	preferences: { type: Array, required: true },
});

const Preferences = mongoose.model("Preferences", preferenceSchema);

module.exports = Preferences;
