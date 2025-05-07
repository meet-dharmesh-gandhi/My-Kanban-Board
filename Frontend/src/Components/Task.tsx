import { useContext, useEffect, useRef } from "react";
import "../Styles/Task.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { dragContext } from "../Contexts/DragContext";
import { taskContext } from "../Contexts/TaskContext";

export interface TaskProps {
	id: string;
	text: string;
}

export default function Task({ id, text }: TaskProps) {
	const currentTask = useRef<HTMLDivElement | null>(null);
	const { dragging, draggingElement, clicked } = useContext(dragContext);
	const { setAllTasks, allTasks, editing, setEditing } =
		useContext(taskContext);
	const newTask = useRef("");
	const changeTask = useRef((newTask: string) => {
		if (!setAllTasks || !allTasks || !setEditing) {
			console.log("setAllTasks or allTasks not found!");
			return;
		}
		let parentId, taskId;
		setAllTasks((prev) => {
			try {
				[parentId, taskId] = id
					.split("-")
					.map((ele) => Number.parseInt(ele));
				if (parentId === null || taskId === null)
					throw new Error(
						"Could not edit because one of the id's was missing!"
					);
				const newTasks = prev.map((ele) => [...ele]);
				newTasks[parentId][taskId] = newTask;
				return newTasks;
			} catch (error) {
				console.error("Error while editing task:", error);
			}
			return prev;
		});
	});
	const deleteTask = useRef(() => {
		// @ts-expect-error the lengths may not match
		setAllTasks((prev) =>
			prev.map((ele, ind) =>
				ele.filter((_, index) => `${ind}-${index}` !== id)
			)
		);
	});
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (!newTask.current) return;
		changeTask.current(newTask.current);
		newTask.current = "";
	}, [editing, changeTask]);

	useEffect(() => {
		const onClick = () => {
			// check if clicked
			if (!clicked) return;
			if (!clicked.current) clicked.current = true; // clicked
		};

		const onMove = () => {
			// check if clicked and moved ==> dragged
			if (
				!clicked ||
				!clicked.current ||
				!dragging ||
				!draggingElement ||
				draggingElement.current ||
				!currentTask.current
			)
				return; // no dragging
			dragging.current = true; // started dragging
			const clone = currentTask.current?.cloneNode(true);
			if (!clone) return;
			draggingElement.current = clone as HTMLDivElement;
			draggingElement.current.classList.add("dragging-element");
			document.body.appendChild(draggingElement.current);
			draggingElement.current.style.width =
				currentTask.current.getBoundingClientRect().width + "px";
			draggingElement.current.style.height =
				currentTask.current.getBoundingClientRect().height + "px";
			document.body.style.userSelect = "none";
		};

		const currentTaskRef = currentTask.current;

		if (!currentTaskRef) return;

		currentTaskRef.addEventListener("mousedown", onClick);
		currentTaskRef.addEventListener("touchstart", onClick);
		currentTaskRef.addEventListener("mousemove", onMove);
		currentTaskRef.addEventListener("touchmove", onMove);

		return () => {
			if (!currentTaskRef) return;
			currentTaskRef.removeEventListener("mousedown", onClick);
			currentTaskRef.removeEventListener("touchstart", onClick);
			currentTaskRef.removeEventListener("mousemove", onMove);
			currentTaskRef.removeEventListener("touchmove", onMove);
		};
	}, [dragging, draggingElement, clicked]);

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, [editing, id]);

	return (
		<div id={id} className="task" ref={currentTask}>
			<button
				className="edit-task-button floating-button"
				onClick={() => {
					if (clicked) clicked.current = false;
					if (!setEditing) return;
					setEditing(id);
				}}
			>
				<FaRegEdit />
			</button>
			<button
				className="delete-task-button floating-button"
				onClick={() => {
					if (clicked) clicked.current = false;
					deleteTask.current();
				}}
			>
				<MdDelete />
			</button>
			{editing === id ? (
				<input
					className="task-input"
					defaultValue={text}
					onClick={(e) => {
						if (clicked) clicked.current = false;
						e.stopPropagation();
					}}
					ref={inputRef}
					onKeyDown={(e) => {
						if (
							(e.key === "Escape" || e.key === "Enter") &&
							setEditing
						) {
							setEditing("");
							return;
						}
						// Prevent special keys like Backspace, Shift, etc.
						if (e.key.length > 1) return;
						// Only allow visible characters
						if (
							!e.key.match(
								/^[a-zA-Z0-9!@#$%^&*()/><.,'";:[\]{}\-_=+~` ]$/
							)
						)
							return;
						// @ts-expect-error value may not exist in e.target
						newTask.current = e.target.value + e.key;
					}}
				/>
			) : (
				<div>{text}</div>
			)}
		</div>
	);
}
