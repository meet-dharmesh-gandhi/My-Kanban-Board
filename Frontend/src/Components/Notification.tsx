import { useContext } from "react";
import "../Styles/Notification.css";
import { notificationContext } from "../Contexts/NotificationContext";

export default function Notification() {
	const { notifications } = useContext(notificationContext);

	return (
		<>
			{notifications.length > 0 ? (
				<div className="notification-bar">
					{notifications.map((ele, ind) => (
						<div
							key={"notification-" + ind}
							className="notification"
						>
							{ele.message}
						</div>
					))}
				</div>
			) : null}
		</>
	);
}
