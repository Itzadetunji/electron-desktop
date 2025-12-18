import { useEffect, useState } from "react";

export const useStatistics = (dataPointCount: number): Statistics[] => {
	const [value, setValue] = useState<Statistics[]>([]);

	useEffect(() => {
		const unsub = window.electron.subscribeStatistics((data) => {
			setValue((prev) => {
				const newData = [...prev, data];
				if (newData.length > dataPointCount) {
					newData.shift();
				}

				return newData;
			});
		});

		return unsub;
	}, []);

	return value;
};
