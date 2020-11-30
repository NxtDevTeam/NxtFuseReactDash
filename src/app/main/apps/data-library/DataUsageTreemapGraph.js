import React, { useMemo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useTheme } from '@material-ui/core';
import ReactApexChart from 'react-apexcharts';
import { byteSizeToString } from './dataSourceUtils';

function DataUsageTreemapGraph({ data }) {
	const theme = useTheme();

	const chartOptions = useMemo(() => ({
		chart: {
			animations: {
				// The animations are pretty clunky and slow
				enabled: false,
				// These animations (which trigger when the data changes) cause the
				// chart to crash when data is updated
				dynamicAnimation: {
					enabled: false
				},
			},
			// This is just for downloading the data as CSV, etc.
			toolbar: {
				show: false,
			},
		},
		tooltip: {
			theme: 'dark',
			followCursor: true,
			style: {
				fontSize: theme.typography.fontSize,
				fontFamily: theme.typography.fontFamily,
			},
			y: {
				formatter: byteSizeToString,
			},
		},
		legend: {
			show: true,
			position: 'right',
			fontSize: theme.typography.fontSize,
			fontWeight: theme.typography.fontWeightBold,
			fontFamily: theme.typography.fontFamily,
			labels: {
				colors: theme.palette.text,
			},
		},
		noData: {
			text: 'No data sources',
			style: {
				color: theme.palette.text,
				fontSize: theme.typography.fontSize,
				fontFamily: theme.typography.fontFamily,
			},
		},
	}), [theme]);

	// Translate the data format into what Apexcharts wants
	// - Collect sources of the same type into seperate series
	// - Rename fields (`name -> x`, `size -> y`)
	const series = useMemo(() => {
		// Set of series keyed by the name
		let seriesMap = {};
		for (let elem of data) {
			if (!(elem.type in seriesMap)) {
				seriesMap[elem.type] = {
					name: elem.type,
					data: [],
				};
			}

			seriesMap[elem.type].data.push({
				x: elem.name,
				y: elem.size,
			});
		}

		// Collect into an array, sorted by the name in order to maintain a
		// consistent ordering
		return Object.values(seriesMap).sort(
			(a, b) => a.name.localeCompare(b.name));
	}, [data]);

	// TODO Figure out how to properly make this 100% width. Setting width=100%
	// Works except for the first render, where it seems to take up the full width
	// of the screen. Resizing the page will make it recalculate the width and
	// end up correct, but I can't find any CSS options that make the chart
	// properly size itself off the bat.
	// TODO The chart throws an error if the series is empty (a bug in Apexcharts)
	// See issue: https://github.com/apexcharts/react-apexcharts/issues/187
	return series.length > 0
		?
			<ReactApexChart
				type="treemap"
				height="300px"
				width="600px"
				options={chartOptions}
				series={series}
			/>
		: <FuseLoading />
}

export default DataUsageTreemapGraph;
