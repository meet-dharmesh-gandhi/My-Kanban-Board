const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const initDB = require("./Database/db");
const User = require("./Database/UserSchema");
const mongoose = require("mongoose");
const Tasks = require("./Database/TasksSchema");
const jwt = require("jsonwebtoken");
const { ValidateUser, checkUserExists } = require("./Functions/ValidateUser");
const Preferences = require("./Database/PreferencesSchema");
const { createAuthCookie } = require("./Functions/CookieFunctions");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = 3000;
const clientUrl = process.env.FRONTEND_URL;
const mongoDBURI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
if (!clientUrl || !mongoDBURI || !jwtSecret)
	throw new Error("Frontend URL or MongoDB URI or JWT Secret not given!");

initDB(mongoDBURI);

app.use(cors({ origin: [clientUrl], credentials: true }));

app.get("/", (req, res) => res.send("Request Recieved!"));

app.post("/save", express.json(), cookieParser(), async (req, res) => {
	try {
		const { tasks, properties } = req.body;
		if (
			!tasks ||
			!properties ||
			!Array.isArray(tasks) ||
			!Array.isArray(properties) ||
			tasks.length < 4 ||
			properties.length < 4
		)
			return res
				.status(400)
				.send("Invalid tasks or properties provided!");
		const validationDetails = await ValidateUser(req.cookies, jwtSecret);
		if (validationDetails.length > 1)
			return res.status(validationDetails[0]).send(validationDetails[1]);
		const [userName] = validationDetails;
		const userExists = await User.find({ userName });
		if (userExists.length < 1)
			return res.status(400).send("User does not exist!");
		const updated = await Tasks.updateOne(
			{ userName },
			{ tasks, properties },
			{ upsert: true }
		);
		if (updated.acknowledged) return res.status(200).send("Updated!");
		else
			return res
				.status(400)
				.send("Could not update the tasks and properties!");
	} catch (error) {
		console.error(
			"Error while saving user tasks and user preferences:",
			error
		);
		return res.sendStatus(500);
	}
});

app.post("/create-user", express.json(), async (req, res) => {
	try {
		const { userName, email } = req.body;
		if (!userName || !email)
			return res.status(400).send("Invalid Email or userName");
		const userFound = await User.find({ userName });
		if (userFound.length > 0)
			return res.status(400).send("User already Exists!");
		const userInserted = await User.insertOne({ userName, email });
		const taskInserted = await Tasks.insertOne({
			userName,
			tasks: [[], [], [], []],
		});
		const preferencesInserted = await Preferences.insertOne({
			userName,
			preferences: [
				["Pending", "#ff3333"],
				["Reviewing", "#33dddd"],
				["Done", "#33ff33"],
				["On Going", "#5555ff"],
			],
		});
		if (userInserted && taskInserted && preferencesInserted) {
			const [cookieValue, cookieOptions] = createAuthCookie(
				userName,
				jwtSecret,
				clientUrl.includes("https")
			);
			res.cookie("authToken", cookieValue, cookieOptions);
			return res.status(200).send("User Created!");
		}
		if (userInserted) await User.deleteOne({ userName });
		if (taskInserted) await Tasks.deleteOne({ userName });
		if (preferencesInserted) await Preferences.deleteOne({ userName });
		return res.status(400).send("Could not create specified User!");
	} catch (error) {
		console.error("Error while inserting user:", error);
		res.sendStatus(500);
	}
});

app.post("/login-user", express.json(), async (req, res) => {
	try {
		const { userName } = req.body;
		if (!userName)
			return res.status(400).send("Username or Email not found!");
		const userExists = await checkUserExists(userName);
		if (!userExists) return res.status(400).send("Invalid Username!");
		const [cookieValue, cookieOptions] = createAuthCookie(
			userName,
			jwtSecret,
			clientUrl.includes("https")
		);
		res.cookie("authToken", cookieValue, cookieOptions);
		return res.status(200).send("User Valid!");
	} catch (error) {
		console.error("Error while verifying user:", error);
		return res.sendStatus(500);
	}
});

app.get("/verify-user", cookieParser(), async (req, res) => {
	try {
		const validationDetails = await ValidateUser(req.cookies, jwtSecret);
		if (validationDetails.length > 1)
			return res.status(validationDetails[0]).send(validationDetails[1]);
		res.status(200).send("User Valid!");
	} catch (error) {
		console.error("Error while verifying user:", error);
		return res.sendStatus(500);
	}
});

app.get("/task-details", cookieParser(), async (req, res) => {
	try {
		const validationDetails = await ValidateUser(req.cookies, jwtSecret);
		if (validationDetails.length > 1)
			return res.status(validationDetails[0]).send(validationDetails[1]);
		const [userName] = validationDetails;
		const tasks = await Tasks.find({ userName }, { tasks: 1, _id: 0 });
		if (tasks.length <= 0) return res.status(400).send("No Tasks Found!");
		const preferences = await Preferences.find(
			{ userName },
			{ preferences: 1, _id: 0 }
		);
		if (preferences.length <= 0)
			return res.status(400).send("No Preferences Found!");
		return res.status(200).send({
			tasks: tasks[0].tasks,
			preferences: preferences[0].preferences,
		});
	} catch (error) {
		console.error("Error while getting user's task details:", error);
		res.sendStatus(500);
	}
});

app.listen(port, () => console.log("Server Running on port", port));
