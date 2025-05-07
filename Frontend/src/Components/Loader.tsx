import "../Styles/Loader.css";
import { BikerSVG, NormalSVG, OfficerSVG, ScientistSVG } from "./SvgImages";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Loader() {
	return (
		<div className="loader-wrapper">
			<h1>Finding You</h1>
			<h5>Be Patient, It may take us some while to get your data!</h5>
			<FaMagnifyingGlass className="magnifying-glass" />
			<div className="loader">
				{/* Biker */}
				<BikerSVG style={{ "--index": "-4" } as React.CSSProperties} />
				{/* Normal */}
				<NormalSVG style={{ "--index": "-3" } as React.CSSProperties} />
				{/* Scientist */}
				<ScientistSVG
					style={{ "--index": "-2" } as React.CSSProperties}
				/>
				{/* Officer */}
				<OfficerSVG
					style={{ "--index": "-1" } as React.CSSProperties}
				/>
				{/* Biker */}
				<BikerSVG style={{ "--index": "0" } as React.CSSProperties} />
				{/* Normal */}
				<NormalSVG style={{ "--index": "1" } as React.CSSProperties} />
				{/* Scientist */}
				<ScientistSVG
					style={{ "--index": "2" } as React.CSSProperties}
				/>
				{/* Officer */}
				<OfficerSVG style={{ "--index": "3" } as React.CSSProperties} />
			</div>
		</div>
	);
}
