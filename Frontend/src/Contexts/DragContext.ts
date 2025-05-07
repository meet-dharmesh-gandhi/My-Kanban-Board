import { createContext } from "react";

interface DragContextProps {
	dragging: React.RefObject<boolean> | null;
	clicked: React.RefObject<boolean> | null;
	draggingElement: React.RefObject<HTMLDivElement | null> | null;
}

export const dragContext = createContext<DragContextProps>({
	dragging: null,
	draggingElement: null,
	clicked: null,
});
