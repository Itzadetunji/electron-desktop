import { useMemo } from "react";
import { BaseChart } from "./BaseChart";

export interface ChartProps {
	data: number[];
	maxDataPoints: number;
}

export const Chart = (props: ChartProps) => {
	const preparedData = useMemo(() => {
		const points = props.data.map((value) => ({ value: value * 100 }));

		return [
			...points,
			...Array.from({ length: props.maxDataPoints - points.length }).map(
				() => ({ value: undefined })
			),
		];
	}, [props.data, props.maxDataPoints]);

	return <BaseChart data={preparedData} />;
};
