import "../Styles/Home.css";
import TaskList from "./TaskList.tsx";
import "../Styles/DragAndDrop.css";
import { useContext, useEffect, useRef, useState } from "react";
import { dragContext } from "../Contexts/DragContext.ts";
import { taskContext } from "../Contexts/TaskContext.ts";
import { settingsContext } from "../Contexts/SettingsContext.ts";
import Settings from "./Settings.tsx";
import { IoSettings } from "react-icons/io5";
import { serverUrl } from "../Globals/Urls.ts";
import { notificationContext } from "../Contexts/NotificationContext.ts";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.tsx";

export interface DropProps {
	droppedOn: number;
	droppedBy: number;
	DroppedElementProperties?: { id: string; textContent: string };
}

export type TaskType = string[][];

function Home() {
	const [allTasks, setAllTasks] = useState<TaskType>([]);
	const [taskProperties, setTaskProperties] = useState<[string, string][]>([
		["Pending", "#ff3333"],
		["Reviewing", "#33dddd"],
		["Done", "#33ff33"],
		["On Going", "#5555ff"],
	]);
	const allTasksRef = useRef(allTasks);
	const taskPropertiesRef = useRef(taskProperties);
	const dragging = useRef<boolean>(false);
	const clicked = useRef<boolean>(false);
	const draggingElement = useRef<HTMLDivElement | null>(null);
	const [editing, setEditing] = useState<string>("");
	const scrollCache = useRef({
		viewportHeight: window.innerHeight,
		scrollMargin: 50,
		scrollSpeed: 10,
	});
	const animationFrameId = useRef<number | null>(null);
	const [openSettings, setOpenSettings] = useState(false);
	const { addNotification } = useContext(notificationContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const onMargin = useRef<0 | "U" | "D">(0);

	useEffect(() => {
		let scrollId: number = 0;

		const scroll = () => {
			if (!draggingElement.current) {
				onMargin.current = 0;
				return;
			}
			const { scrollSpeed } = scrollCache.current;
			if (onMargin.current === "U") {
				window.scrollBy({
					top: -scrollSpeed,
					behavior: "auto",
				});
			} else if (onMargin.current === "D") {
				window.scrollBy({
					top: scrollSpeed,
					behavior: "auto",
				});
			}
			scrollId = requestAnimationFrame(scroll);
		};

		const observeDragging = setInterval(() => {
			if (
				onMargin.current !== 0 &&
				draggingElement.current &&
				!scrollId
			) {
				scroll();
			} else if (
				(onMargin.current === 0 || !draggingElement.current) &&
				scrollId
			) {
				cancelAnimationFrame(scrollId);
				scrollId = 0;
			}
		}, 100);

		return () => {
			clearInterval(observeDragging);
			cancelAnimationFrame(scrollId);
			scrollId = 0;
		};
	}, []);

	useEffect(() => {
		// Update cache on resize
		const updateCache = () => {
			scrollCache.current.viewportHeight = window.innerHeight;
		};

		window.addEventListener("resize", updateCache);
		updateCache(); // init
		return () => window.removeEventListener("resize", updateCache);
	}, []);

	useEffect(() => {
		allTasksRef.current = allTasks;
		taskPropertiesRef.current = taskProperties;
	}, [allTasks, taskProperties]);

	useEffect(() => {
		const saveProgress = () => {
			fetch(serverUrl + "/save", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					tasks: allTasksRef.current,
					properties: taskPropertiesRef.current,
				}),
			});
		};

		const intervalId = setInterval(saveProgress, 30 * 1000);
		window.addEventListener("beforeunload", saveProgress);

		return () => {
			window.removeEventListener("beforeunload", saveProgress);
			clearInterval(intervalId);
		};
	}, []);

	useEffect(() => {
		(async () => {
			const userVerified = await fetch(serverUrl + "/verify-user", {
				method: "get",
				credentials: "include",
			}).then((data) => {
				if (data.status !== 200) navigate("/login");
				return "OK";
			});
			if (!userVerified) navigate("/login");
			fetch(serverUrl + "/task-details", {
				method: "get",
				credentials: "include",
			})
				.then((data) => {
					if (data.status !== 200) return data.text();
					else return data.json();
				})
				.then((data) => {
					if (
						typeof data === "object" &&
						data.tasks &&
						data.preferences
					) {
						setAllTasks(data.tasks);
						setTaskProperties(data.preferences);
						setLoading(false);
					} else if (addNotification) {
						addNotification(data);
						addNotification(
							"Some error occurred, redirecting you to the login page in 2 seconds!"
						);
						setTimeout(() => navigate("/login"), 2000);
					}
				});
		})();
	}, []);

	useEffect(() => {
		const onDrop = (x: number, y: number) => {
			// check if dropped the element
			if (
				!dragging.current ||
				!draggingElement.current ||
				!draggingElement.current.id
			)
				return;
			const draggedTaskId = draggingElement.current.id;
			dragging.current = false;
			draggingElement.current.remove();
			draggingElement.current = null;
			document.body.style.userSelect = "auto";
			clicked.current = false;
			// dragged element is dropped
			// get the elements at that position
			const dropzones = document.elementsFromPoint(x, y) as HTMLElement[];
			const validDropZones = dropzones.filter((ele) => ele.dataset.drop);
			if (validDropZones.length < 1) return;
			const taskId = Number.parseInt(draggedTaskId.split("-")[1]);
			const senderTaskList = Number.parseInt(draggedTaskId.split("-")[0]);
			const receiverTaskList = Number.parseInt(validDropZones[0].id);
			if (senderTaskList === receiverTaskList) return;
			const newTasks: TaskType = allTasks.map((ele, ind) => {
				let newTaskList = ele;
				if (ind === senderTaskList) {
					// this is the sender, remove the task from here!
					newTaskList = newTaskList.filter(
						(_, taskInd) => taskInd !== taskId
					);
				} else if (ind === receiverTaskList) {
					// this is the receiver, add the task here!
					newTaskList.push(allTasks[senderTaskList][taskId]);
				}
				return newTaskList;
			});
			setAllTasks(newTasks);
		};

		const onMove = (x: number, y: number) => {
			if (!draggingElement.current) return;

			const scrolledY = window.scrollY;

			draggingElement.current.style.left =
				x - draggingElement.current.offsetWidth / 2 + "px";
			draggingElement.current.style.top =
				y - draggingElement.current.offsetHeight / 2 + "px";

			const { viewportHeight, scrollMargin } = scrollCache.current;

			// Scroll vertically
			if (y - scrolledY < scrollMargin) {
				onMargin.current = "U";
			} else if (y - scrolledY > viewportHeight - scrollMargin) {
				onMargin.current = "D";
			} else {
				onMargin.current = 0;
			}
		};

		const onMouseUp = (e: MouseEvent) => {
			onDrop(e.clientX, e.clientY);
		};

		const onTouchEnd = (e: TouchEvent) => {
			onDrop(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		};

		const onMouseMove = (e: MouseEvent) => {
			if (animationFrameId.current) return;
			animationFrameId.current = requestAnimationFrame(() => {
				onMove(e.pageX, e.pageY);
				animationFrameId.current = null;
			});
		};

		const onTouchMove = (e: TouchEvent) => {
			if (!draggingElement.current) return;
			e.preventDefault();
			if (animationFrameId.current) return;
			animationFrameId.current = requestAnimationFrame(() => {
				onMove(e.touches[0].pageX, e.touches[0].pageY);
				animationFrameId.current = null;
			});
		};

		document.body.addEventListener("mouseup", onMouseUp);
		document.body.addEventListener("mousemove", onMouseMove);
		document.body.addEventListener("touchend", onTouchEnd);
		document.body.addEventListener("touchmove", onTouchMove, {
			passive: false,
		});

		return () => {
			document.body.removeEventListener("mouseup", onMouseUp);
			document.body.removeEventListener("mousemove", onMouseMove);
			document.body.removeEventListener("touchend", onTouchEnd);
			document.body.removeEventListener("touchmove", onTouchMove);
		};
	}, [allTasks]);

	useEffect(() => {
		const stopEditing = (e: MouseEvent | TouchEvent) => {
			const obj =
				e instanceof MouseEvent
					? document.elementsFromPoint(e.clientX, e.clientY)
					: document.elementsFromPoint(
							e.touches[0].clientX,
							e.touches[0].clientY
					  );
			if (obj.every((ele) => ele.tagName.toLowerCase() !== "input")) {
				setEditing("");
			}
		};

		document.body.addEventListener("mousedown", stopEditing);
		document.body.addEventListener("touchstart", stopEditing);

		return () => {
			document.body.removeEventListener("mousedown", stopEditing);
			document.body.removeEventListener("touchstart", stopEditing);
		};
	}, []);

	return (
		<dragContext.Provider value={{ dragging, draggingElement, clicked }}>
			<taskContext.Provider
				value={{ setAllTasks, allTasks, editing, setEditing }}
			>
				<settingsContext.Provider
					value={{
						openSettings,
						setOpenSettings,
						taskProperties,
						setTaskProperties,
						setAllTasks,
						allTasks,
					}}
				>
					{loading ? (
						<Loader />
					) : openSettings ? (
						<Settings />
					) : (
						<div className="app-div">
							<button
								className="open-settings-button"
								onClick={() => setOpenSettings(true)}
							>
								<IoSettings />
							</button>
							{Array.isArray(allTasks) &&
								allTasks.map((_, ind) => (
									<TaskList
										key={ind}
										id={ind}
										text={taskProperties[ind][0]}
										color={taskProperties[ind][1]}
										tasks={allTasks}
									/>
								))}
						</div>
					)}
				</settingsContext.Provider>
			</taskContext.Provider>
		</dragContext.Provider>
	);
}

export default Home;
