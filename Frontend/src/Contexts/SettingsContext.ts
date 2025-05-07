import { createContext } from "react";
import { TaskType } from "../Components/Home";

interface SettingsContextProps {
	openSettings: boolean;
	setOpenSettings: React.Dispatch<React.SetStateAction<boolean>> | null;
	taskProperties: [string, string][] | null;
	setTaskProperties: React.Dispatch<
		React.SetStateAction<[string, string][]>
	> | null;
	setAllTasks: React.Dispatch<React.SetStateAction<TaskType>> | null;
	allTasks: TaskType | null;
}

export const settingsContext = createContext<SettingsContextProps>({
	openSettings: false,
	setOpenSettings: null,
	taskProperties: null,
	setTaskProperties: null,
	setAllTasks: null,
	allTasks: null,
});
