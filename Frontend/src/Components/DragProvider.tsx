import React from "react";
import { dragContext } from "../Contexts/DragContext";
// import Task from "./Task";
// import TaskList from "./TaskList";

export interface DraggableItems {
	taskItem: string;
	fromTaskList: string;
	dragging: boolean;
	taskText?: string;
	dropped: boolean;
}

interface DragProviderProps {
	children: React.ReactNode;
	dragging: React.RefObject<boolean>;
	draggingElement: React.RefObject<HTMLDivElement | null>;
}

export function DragProvider({
	children,
	dragging,
	draggingElement,
}: DragProviderProps) {
	return (
		<dragContext.Provider value={{ dragging, draggingElement }}>
			{children}
		</dragContext.Provider>
	);
}
