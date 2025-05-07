import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import LoginPage from "./Components/LoginPage";
import NotFound from "./Components/NotFound";
import Notification from "./Components/Notification";
import { notificationContext } from "./Contexts/NotificationContext";
import { useState } from "react";
import Loader from "./Components/Loader";

export default function App() {
	const [notifications, setNotifications] = useState<Array<string>>([]);

	function addNotification(newNotification: string) {
		setNotifications((prev) => [...prev, newNotification]);
		setTimeout(
			() =>
				// @ts-expect-error the new array length may not be the same as the original one
				setNotifications((prev) =>
					prev
						.filter((ele) => ele !== newNotification)
						.map((ele) => [...ele])
				),
			3000
		);
	}

	return (
		<>
			<notificationContext.Provider
				value={{ notifications, addNotification }}
			>
				<BrowserRouter>
					<Routes>
						<Route path="/board" element={<Home />} />
						<Route path="/login" element={<LoginPage />} />
						<Route
							path="/signup"
							element={<LoginPage mode="signup" />}
						/>
						<Route path="/loader" element={<Loader />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
				<Notification />
			</notificationContext.Provider>
		</>
	);
}
