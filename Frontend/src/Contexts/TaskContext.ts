import { createContext } from "react";
import { TaskType } from "../Components/Home";

interface TaskContextProps {
	setAllTasks: React.Dispatch<React.SetStateAction<TaskType>> | null;
	allTasks: TaskType | null;
	setEditing: React.Dispatch<React.SetStateAction<string>> | null;
	editing: string;
}

export const taskContext = createContext<TaskContextProps>({
	setAllTasks: null,
	allTasks: null,
	editing: "",
	setEditing: null,
});
