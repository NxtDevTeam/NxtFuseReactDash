import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import _ from '@lodash';

function BarChart({ input, options }) {
	const theme = useTheme();

	return (
		<Bar
			data={{
				labels: input.labels,
				datasets: input.datasets.map(obj => ({
					...obj,
					borderColor: theme.palette.secondary.main,
					backgroundColor: theme.palette.secondary.main
				}))
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
				input.options,
			)}
		/>
	);
}

export default React.memo(BarChart);
