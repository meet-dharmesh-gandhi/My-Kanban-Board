const mongoose = require("mongoose");

function initDB(mongoDBUri) {
	if (!mongoDBUri) throw new Error("MongoDB URI missing!");
	mongoose
		.connect(mongoDBUri)
		.then(() => console.log("MongoDB connected!"))
		.catch((err) =>
			console.error("Error while connecting to MongoDB:", err)
		);
}

module.exports = initDB;
