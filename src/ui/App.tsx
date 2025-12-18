import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Chart } from "./Chart";
import { useStatistics } from "./useStatistics";

function App() {
	const statistics = useStatistics(10);
	const staticData = useStaticData();
	const [activeView, setActiveView] = useState<View>("CPU");

	const cpuUsages = useMemo(
		() => statistics.map((stat) => stat.cpuUsage),
		[statistics]
	);
	const ramUsages = useMemo(
		() => statistics.map((stat) => stat.ramUsage),
		[statistics]
	);
	const storageUsages = useMemo(
		() => statistics.map((stat) => stat.storageUsage),
		[statistics]
	);

	const activeUsages = useMemo(() => {
		switch (activeView) {
			case "CPU":
				return cpuUsages;
			case "RAM":
				return ramUsages;
			case "STORAGE":
				return storageUsages;
		}
	}, [activeView, cpuUsages, ramUsages, storageUsages]);

	useEffect(() => {
		window.electron.subscribeChangeView((view) => {
			setActiveView(view);
		});
	}, []);

	return (
		<div className="App">
			<Header />
			<div className="main">
				<div>
					<SelectOption
						onClick={() => setActiveView("CPU")}
						title="CPU"
						view="CPU"
						subTitle={staticData?.cpuModel ?? ""}
						data={cpuUsages}
					/>
					<SelectOption
						onClick={() => setActiveView("RAM")}
						title="RAM"
						view="RAM"
						subTitle={`${staticData?.totalMemoryGB.toString() ?? ""} GB`}
						data={ramUsages}
					/>
					<SelectOption
						onClick={() => setActiveView("STORAGE")}
						title="STORAGE"
						view="STORAGE"
						subTitle={`${staticData?.totalStorage.toString() ?? ""} GB`}
						data={storageUsages}
					/>
				</div>
				<div className="mainGrid">
					<Chart
						selectedView={activeView}
						data={activeUsages}
						maxDataPoints={10}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;

const Header = () => {
	return (
		<header>
			<button
				id="close"
				type="button"
				onClick={() => window.electron.sendFrameAction("CLOSE")}
			/>
			<button
				id="minimize"
				type="button"
				onClick={() => window.electron.sendFrameAction("MINIMIZE")}
			/>
			<button
				id="maximize"
				type="button"
				onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
			/>
		</header>
	);
};

const SelectOption = (props: {
	title: string;
	view: View;
	subTitle: string;
	data: number[];
	onClick: () => void;
}) => {
	return (
		<button
			type="button"
			className="selectOption"
			onClick={props.onClick}
		>
			<div className="selectOptionTitle">
				<div>{props.title}</div>
				<div>{props.subTitle}</div>
			</div>
			<div className="selectOptionChart">
				<Chart
					selectedView={props.view}
					data={props.data}
					maxDataPoints={10}
				/>
			</div>
		</button>
	);
};

const useStaticData = () => {
	const [staticData, setStaticData] = useState<StaticData | null>(null);

	useEffect(() => {
		(async () => {
			setStaticData(await window.electron.getStaticData());
		})();
	}, []);

	return staticData;
};
