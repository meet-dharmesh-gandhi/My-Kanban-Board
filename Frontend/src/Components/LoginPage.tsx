import { useContext, useRef } from "react";
import "../Styles/LoginPage.css";
import { notificationContext } from "../Contexts/NotificationContext";
import { serverUrl } from "../Globals/Urls";
import { Link, useNavigate } from "react-router-dom";

interface LoginPageProps {
	mode?: "login" | "signup";
}

interface InputBoxProps {
	setProperty: (value: string) => void;
	propertyName?: string;
}

export default function LoginPage({ mode = "login" }: LoginPageProps) {
	const details = useRef<[string, string]>(["", ""]);
	const { addNotification } = useContext(notificationContext);
	const navigate = useNavigate();

	function login(userName: string) {
		if (!addNotification) return;
		if (userName === "") {
			addNotification("Missing Username!");
			return;
		}
		fetch(serverUrl + "/login-user", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				userName,
			}),
		})
			.then((data) => {
				if (data.status !== 200) return data.text();
				else return "OK";
			})
			.then((data) => {
				if (data === "OK") navigate("/");
				else addNotification(data);
			});
	}

	function signUp(userName: string, email: string) {
		if (!addNotification) return;
		if (userName === "" || email === "") {
			addNotification("Missing Username or Email!");
			return;
		}
		fetch(serverUrl + "/create-user", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				userName,
				email,
			}),
		})
			.then((data) => {
				if (data.status !== 200) return data.text();
				else return "OK";
			})
			.then((data) => {
				if (data === "OK") navigate("/");
				else addNotification(data);
			});
	}

	return (
		<div className="login-page-wrapper">
			<div className="login-page">
				<h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
				<div className="login-inputs">
					<InputBox
						propertyName="Username"
						setProperty={(value) => (details.current[0] = value)}
					/>
					{mode === "login" ? null : (
						<InputBox
							propertyName="Email"
							setProperty={(value) =>
								(details.current[1] = value)
							}
						/>
					)}
					<button
						className="login-button"
						onClick={(e) =>
							e.isTrusted
								? mode === "login"
									? login(details.current[0])
									: signUp(...details.current)
								: null
						}
					>
						{mode === "login" ? "Login" : "Sign Up"}
					</button>
				</div>
			</div>
			<p>
				{mode === "login" ? "New Here? " : "Already a user? "}{" "}
				<Link to={mode === "login" ? "/signup" : "/login"}>
					{mode === "login" ? "Sign Up" : "Login"}
				</Link>
			</p>
			<h4>Be Patient, It may take us some time to get your data!</h4>
		</div>
	);
}

function InputBox({ setProperty, propertyName = "property" }: InputBoxProps) {
	return (
		<div className="input-box">
			<label htmlFor={propertyName + "-input"}>{propertyName}:</label>
			<input
				type="text"
				id={propertyName + "-input"}
				onInputCapture={(e) => {
					// @ts-expect-error value may not exist on e.target
					const value = e.target.value;
					if (!value) return;
					setProperty(value);
				}}
			/>
		</div>
	);
}
