import { createContext } from "react";

interface NotificationContextProps {
	notifications: Array<string>;
	addNotification: ((newNotification: string) => void) | null;
}

export const notificationContext = createContext<NotificationContextProps>({
	notifications: [],
	addNotification: null,
});
