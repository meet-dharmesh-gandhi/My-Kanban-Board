import { useContext } from "react";
import "../Styles/Settings.css";
import { settingsContext } from "../Contexts/SettingsContext";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export default function Settings() {
	const {
		setOpenSettings,
		taskProperties,
		setTaskProperties,
		setAllTasks,
		allTasks,
	} = useContext(settingsContext);

	return (
		<div className="dialog-box">
			<button
				className="dialog-box-close-button"
				onClick={() =>
					setOpenSettings ? setOpenSettings(false) : null
				}
			>
				<IoCloseCircleSharp />
			</button>
			<h2>Settings</h2>
			<div className="tasklists-list">
				{taskProperties &&
					taskProperties.map((ele, ind) => (
						<div key={ind + ""} className={ind + ""}>
							{taskProperties.length > 4 ? (
								<button
									className="tasklists-delete-button"
									onClick={() => {
										if (
											!setTaskProperties ||
											!setAllTasks ||
											!allTasks
										)
											return;
										let newTaskProperties =
											taskProperties.map((ele) => [
												...ele,
											]);
										newTaskProperties =
											newTaskProperties.filter(
												(_, index) => index !== ind
											);
										// @ts-expect-error newTaskProperties may not contain the same length as the original one
										setTaskProperties(newTaskProperties);
										let newAllTasks = allTasks.map(
											(ele) => [...ele]
										);
										newAllTasks = newAllTasks.filter(
											(_, index) => index !== ind
										);
										setAllTasks(newAllTasks);
									}}
								>
									<MdDelete />
								</button>
							) : (
								<></>
							)}
							<input
								type="text"
								defaultValue={ele[0]}
								onInputCapture={(e) => {
									if (!e.isTrusted || !setTaskProperties)
										return;
									const newTasksList = taskProperties.map(
										(ele) => [...ele]
									);
									// @ts-expect-error value may not exist on e.target
									newTasksList[ind][0] = e.target.value;
									// @ts-expect-error new tasks list may not be of same size as before
									setTaskProperties(newTasksList);
								}}
							/>
							<input
								type="color"
								defaultValue={ele[1]}
								onInputCapture={(e) => {
									if (!e.isTrusted || !setTaskProperties)
										return;
									const newTasksList = taskProperties.map(
										(ele) => [...ele]
									);
									// @ts-expect-error value may not exist on e.target
									newTasksList[ind][1] = e.target.value;
									// @ts-expect-error new tasks list may not be of same size as before
									setTaskProperties(newTasksList);
								}}
							/>
						</div>
					))}
				<button
					className="add-category"
					onClick={() => {
						if (
							!setTaskProperties ||
							!setAllTasks ||
							!taskProperties
						)
							return;
						const newTaskList = taskProperties.map((ele) => [
							...ele,
						]);
						newTaskList.push(["New Category", "#000000"]);
						// @ts-expect-error newTasksList length may not be the same
						setTaskProperties(newTaskList);
						setAllTasks((prev) => {
							const newAllTasks = prev.map((ele) => [...ele]);
							newAllTasks.push([]);
							return newAllTasks;
						});
					}}
				>
					Add a new Category
				</button>
			</div>
		</div>
	);
}
