import React, { useContext } from "react";
import "../Styles/TaskList.css";
import { TaskType } from "../Components/Home";
import Task from "./Task";
import { FiPlusCircle } from "react-icons/fi";
import { taskContext } from "../Contexts/TaskContext";

interface TaskListProps {
	id: number;
	text: string;
	color: string;
	tasks: TaskType;
}

export default function TaskList({ id, text, color, tasks }: TaskListProps) {
	const { allTasks, setAllTasks } = useContext(taskContext);

	return (
		<div className="task-list" data-drop="true" id={id + ""}>
			<button
				className="task-list-heading-button"
				onClick={(e) => {
					if (!setAllTasks || !e.isTrusted || !allTasks) return;
					const newTasks = allTasks.map((ele) => [...ele]);
					newTasks[id].push("New Task");
					setAllTasks(newTasks);
				}}
			>
				<FiPlusCircle />
			</button>
			<p
				className="task-list-heading"
				style={{ "--color": color } as React.CSSProperties}
			>
				{text}
			</p>
			<div className="task-list-content">
				{tasks[id].map((ele, ind) => (
					<Task key={`${id}-${ind}`} id={`${id}-${ind}`} text={ele} />
				))}
			</div>
		</div>
	);
}
