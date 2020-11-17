import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Doughnut } from 'react-chartjs-2';
import _ from '@lodash';

function PieChart({ input, options }) {
	const theme = useTheme();

	return (
			<Doughnut
				data={{
					labels: input.labels,
					datasets: input.datasets.map(obj => ({
						...obj,
						borderColor: theme.palette.divider,
						backgroundColor: [
							theme.palette.primary.dark,
							theme.palette.primary.main,
							theme.palette.primary.light
						],
						hoverBackgroundColor: [
							theme.palette.secondary.dark,
							theme.palette.secondary.main,
							theme.palette.secondary.light
						]
					}))
				}}
				options={_.merge(
					{
						maintainAspectRatio: false,
						legend: {
							display: true,
						},
					},
					options,
				)}
			/>
	);
}

export default React.memo(PieChart);
