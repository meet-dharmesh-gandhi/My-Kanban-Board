import { createContext } from "react";
import { NotificationProps } from "../App";

interface NotificationContextProps {
	notifications: NotificationProps[];
	addNotification: ((newNotification: string) => void) | null;
}

export const notificationContext = createContext<NotificationContextProps>({
	notifications: [],
	addNotification: null,
});
