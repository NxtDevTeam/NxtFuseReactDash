import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import _ from '@lodash';

function LineChart({ input, options }) {
	const theme = useTheme();

	return (
		<Line
			data={{
				labels: input.labels,
				datasets: input.datasets.map(obj => ({
					...obj,
					borderColor: theme.palette.secondary.main
				})),
			}}
			options={_.merge(
				{
					maintainAspectRatio: false,
					legend: {
						display: false,
					},
					scales: {
						xAxes: [
							{
								gridLines: {
									display: false,
									displayBorder: false,
								},
							},
						],
						yAxes: [
							{
								display: false,
							},
						]
					},
				},
				options,
			)}
		/>
	);
}

export default React.memo(LineChart);
