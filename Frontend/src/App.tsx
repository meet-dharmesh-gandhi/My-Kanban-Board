import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import LoginPage from "./Components/LoginPage";
import NotFound from "./Components/NotFound";
import Notification from "./Components/Notification";
import { notificationContext } from "./Contexts/NotificationContext";
import { useReducer } from "react";
import Loader from "./Components/Loader";

export interface NotificationProps {
	id: number;
	message: string;
}

type Action =
	| { type: "ADD"; payload: NotificationProps }
	| { type: "REMOVE"; payload: number };

function notificationReducer(
	notifications: NotificationProps[],
	action: Action
) {
	if (action.type === "ADD") return [...notifications, action.payload];
	else if (action.type === "REMOVE")
		return notifications.filter((ele) => ele.id !== action.payload);
	else return notifications;
}

export default function App() {
	const [notifications, setNotifications] = useReducer(
		notificationReducer,
		[]
	);

	function addNotification(newNotification: string) {
		const id = Date.now() + Math.random();
		setNotifications({
			type: "ADD",
			payload: { id, message: newNotification },
		});
		setTimeout(
			() => setNotifications({ type: "REMOVE", payload: id }),
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
