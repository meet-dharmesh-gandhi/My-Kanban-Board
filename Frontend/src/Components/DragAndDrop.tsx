// import React, { useContext, useEffect, useRef, useState } from "react";
// import { dragContext } from "../Contexts/DragContext";

// type props = {
// 	onDrop: (draggedElement: HTMLElement, dropzone: HTMLElement) => void;
// };

// const DragAndDrop: React.FC<props> = ({ onDrop }) => {
// 	const clicked = useRef<true | false>(false);
// 	const isDragging = useRef<true | false>(false);
// 	const clone = useRef<HTMLDivElement | null>(null);
// 	const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
// 		null
// 	);
// 	const x = useRef<number>(0);
// 	const y = useRef<number>(0);
// 	const { items: draggableElements } = useContext(dragContext);

// 	const handleClickUp.current = useRef((e: MouseEvent | TouchEvent) => {
// 		clicked.current = false;
// 		isDragging.current = false;
// 		if (clone.current) {
// 			clone.current?.remove();
// 			clone.current = null;
// 			document.body.style.userSelect = "auto";
// 		}
// 		if (e instanceof MouseEvent)
// 			document.removeEventListener("mousemove", handleMouseMove.current);
// 		else document.removeEventListener("touchmove", handleMouseMove.current);
// 		const dropzone = document.elementFromPoint(
// 			x.current,
// 			y.current
// 		) as HTMLElement;
// 		if (dropzone && dropzone.dataset.drop === "true" && draggedElement)
// 			if (onDrop) onDrop(draggedElement, dropzone);
// 	});

// 	const handleClickDown.current = useRef((e: MouseEvent | TouchEvent) => {
// 		const target = e.target as HTMLElement;
// 		if (target.dataset.drag !== "true") {
// 			target.removeEventListener("mousedown", handleClickDown.current.current);
// 		}
// 		clicked.current = true;
// 		setDraggedElement(target);
// 		if (e.type === "mousedown") {
// 			document.addEventListener("mouseup", handleClickUp.current.current, {
// 				once: true,
// 			});
// 			document.addEventListener("mousemove", handleMouseMove.current);
// 		} else {
// 			document.addEventListener("touchend", handleClickUp.current.current, {
// 				once: true,
// 				passive: true,
// 			});
// 			document.addEventListener("touchmove", handleMouseMove.current, {
// 				passive: true,
// 			});
// 		}
// 	});

// 	const handleMouseMove = useRef((event: MouseEvent | TouchEvent) => {
// 		if (!draggedElement) return;
// 		let e;
// 		if (event instanceof MouseEvent) e = event;
// 		else e = event.touches[0];
// 		x.current = e.clientX;
// 		y.current = e.clientY;
// 		if (!isDragging.current) {
// 			isDragging.current = true;
// 			clone.current = draggedElement.cloneNode(true) as HTMLDivElement;
// 			clone.current.classList.add("dragging-element");
// 			clone.current.style.width = draggedElement.clientWidth + "px";
// 			clone.current.style.height = draggedElement.clientHeight + "px";
// 			clone.current.style.cursor = "grabbing";
// 			document.body.appendChild(clone.current);
// 			document.body.style.userSelect = "none";
// 			clone.current.style.left = `${
// 				e.pageX - clone.current.offsetWidth / 2
// 			}px`;
// 			clone.current.style.top = `${
// 				e.pageY - clone.current.offsetHeight / 2
// 			}px`;
// 		} else if (clone.current) {
// 			clone.current.style.left = `${
// 				e.pageX - clone.current.offsetWidth / 2
// 			}px`;
// 			clone.current.style.top = `${
// 				e.pageY - clone.current.offsetHeight / 2
// 			}px`;
// 		}
// 	});

// 	const execOnStart = useRef(() => {
// 		const clickUpFunc = handleClickUp.current.current;
// 		const mouseMoveFunc = handleClickUp.current.current;
// 		if (draggedElement) {
// 			document.addEventListener("mousemove", mouseMoveFunc);
// 			document.addEventListener("mouseup", clickUpFunc);
// 			document.addEventListener("touchmove", mouseMoveFunc, {
// 				passive: true,
// 			});
// 			document.addEventListener("touchend", clickUpFunc, {
// 				passive: true,
// 			});
// 		} else {
// 			document.removeEventListener("mousemove", mouseMoveFunc);
// 			document.removeEventListener("mouseup", clickUpFunc);
// 			document.removeEventListener("touchmove", mouseMoveFunc);
// 			document.removeEventListener("touchend", clickUpFunc);
// 		}

// 		return () => {
// 			document.removeEventListener("mousemove", mouseMoveFunc);
// 			document.removeEventListener("mouseup", clickUpFunc);
// 			document.removeEventListener("touchmove", mouseMoveFunc);
// 			document.removeEventListener("touchend", clickUpFunc);
// 		};
// 	});

// 	useEffect(() => execOnStart.current(), []);

// 	useEffect(() => {
// 		execOnStart.current();
// 		const clickDownFunc = handleClickDown.current.current;
// 		draggableElements.forEach((element) =>
// 			element.ref.current
// 				? element.ref.current.addEventListener(
// 						"mousedown",
// 						clickDownFunc
// 				  )
// 				: null
// 		);
// 		draggableElements.forEach((element) =>
// 			element.ref.current
// 				? element.ref.current.addEventListener(
// 						"touchstart",
// 						clickDownFunc,
// 						{
// 							passive: true,
// 						}
// 				  )
// 				: null
// 		);

// 		return () => {
// 			draggableElements.forEach((element) =>
// 				element.ref.current
// 					? element.ref.current.removeEventListener(
// 							"mousedown",
// 							clickDownFunc
// 					  )
// 					: null
// 			);
// 			draggableElements.forEach((element) =>
// 				element.ref.current
// 					? element.ref.current.removeEventListener(
// 							"touchstart",
// 							clickDownFunc
// 					  )
// 					: null
// 			);
// 		};
// 	}, [draggableElements, execOnStart]);

// 	return <></>;
// };

// export default DragAndDrop;

import "./DragAndDrop.css";
import React, { useEffect, useRef } from "react";

type props = {
	onDrop: (draggedElement: HTMLElement, dropzone: HTMLElement) => void;
};

const DragAndDrop: React.FC<props> = ({ onDrop }) => {
	const clicked = useRef<true | false>(false);
	const isDragging = useRef<true | false>(false);
	const clone = useRef<HTMLDivElement | null>(null);
	const draggedElement = useRef<HTMLElement | null>(null);
	const x = useRef<number>(0);
	const y = useRef<number>(0);

	const handleClickUp = useRef((e: MouseEvent | TouchEvent) => {
		clicked.current = false;
		isDragging.current = false;
		if (clone.current) {
			clone.current?.remove();
			clone.current = null;
		}
		if (e instanceof MouseEvent)
			document.removeEventListener("mousemove", handleMouseMove);
		else document.removeEventListener("touchmove", handleMouseMove);
		const dropzone = document.elementFromPoint(
			x.current,
			y.current
		) as HTMLElement;
		if (
			dropzone &&
			dropzone.dataset.drop === "true" &&
			draggedElement.current
		)
			if (onDrop) onDrop(draggedElement.current, dropzone);
	});

	const handleClickDown = useRef((e: MouseEvent | TouchEvent) => {
		const target = e.target as HTMLElement;
		if (target.dataset.drag !== "true") {
			target.removeEventListener("mousedown", handleClickDown.current);
		}
		clicked.current = true;
		draggedElement.current = target;
		if (e.type === "mousedown") {
			document.addEventListener("mouseup", handleClickUp.current, {
				once: true,
			});
			document.addEventListener("mousemove", handleMouseMove);
		} else {
			document.addEventListener("touchend", handleClickUp.current, {
				once: true,
				passive: true,
			});
			document.addEventListener("touchmove", handleMouseMove, {
				passive: true,
			});
		}
	});

	function handleMouseMove(event: MouseEvent | TouchEvent) {
		if (!draggedElement.current) return;
		let e;
		if (event instanceof MouseEvent) e = event;
		else e = event.touches[0];
		x.current = e.clientX;
		y.current = e.clientY;
		if (!isDragging.current) {
			isDragging.current = true;
			clone.current = draggedElement.current.cloneNode(
				true
			) as HTMLDivElement;
			clone.current.classList.add("dragging-element");
			document.body.appendChild(clone.current);
			clone.current.style.left = `${
				e.pageX - clone.current.offsetWidth / 2
			}px`;
			clone.current.style.top = `${
				e.pageY - clone.current.offsetHeight / 2
			}px`;
		} else if (clone.current) {
			clone.current.style.left = `${
				e.pageX - clone.current.offsetWidth / 2
			}px`;
			clone.current.style.top = `${
				e.pageY - clone.current.offsetHeight / 2
			}px`;
		}
	}

	const addListeners = useRef(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleClickUp.current);
		document.addEventListener("touchmove", handleMouseMove, {
			passive: true,
		});
		document.addEventListener("touchend", handleClickUp.current, {
			passive: true,
		});
	});

	const removeListeners = useRef(() => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleClickUp.current);
		document.removeEventListener("touchmove", handleMouseMove);
		document.removeEventListener("touchend", handleClickUp.current);
	});

	useEffect(() => {
		if (draggedElement) addListeners.current();
		else removeListeners.current();
		return removeListeners.current();
	}, [draggedElement, addListeners, removeListeners]);

	useEffect(() => {
		const draggableElements = document.querySelectorAll(
			'[data-drag="true"]'
		) as NodeListOf<HTMLElement>;
		draggableElements.forEach((element) =>
			element.addEventListener("mousedown", handleClickDown.current)
		);
		draggableElements.forEach((element) =>
			element.addEventListener("touchstart", handleClickDown.current, {
				passive: true,
			})
		);

		return () => {
			draggableElements.forEach((element) =>
				element.removeEventListener(
					"mousedown",
					handleClickDown.current
				)
			);
			draggableElements.forEach((element) =>
				element.removeEventListener(
					"touchstart",
					handleClickDown.current
				)
			);
		};
	}, [handleClickDown]);

	return <></>;
};

export default DragAndDrop;
