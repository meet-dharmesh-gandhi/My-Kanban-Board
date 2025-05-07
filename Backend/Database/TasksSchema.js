const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	userName: { type: String, required: true },
	tasks: { type: Array, required: true },
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;
