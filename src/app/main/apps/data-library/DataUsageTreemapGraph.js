import React, { useMemo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useMediaQuery, useTheme } from '@material-ui/core';
import ReactApexChart from 'react-apexcharts';
import { byteSizeToString } from './dataSourceUtils';

function legendLabelFormatter(seriesName, opts) {
	const totals = opts.w.globals.seriesTotals;
	const grandTotal = totals.reduce((sum, elem) => sum + elem);
	const seriesTotal = totals[opts.seriesIndex];

	const percent = Math.round(seriesTotal / grandTotal * 100);

	return `${seriesName} (${percent}%)`;
}

function DataUsageTreemapGraph({ className, data }) {
	const theme = useTheme();

	// Chart legend is put below when XS, but to the right when SM and up
	const sizeSm = useMediaQuery(theme.breakpoints.up('sm'));

	// Change to fixed width at XL, when this is put in line with the rest of the
	// header
	const sizeXl = useMediaQuery(theme.breakpoints.up('xl'));
	const width = sizeXl ? '600px' : '100%';

	const chartOptions = useMemo(() => ({
		chart: {
			animations: {
				// Speed up the animations a bit
				speed: 400,
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
			// NOTE: This is used instead of the `responsive` chart option to update
			// the legend position because due to some bug in Apexcharts, using the
			// `responsive` options causes the chart to break when updating the data
			position: sizeSm ? 'right' : 'bottom',
			fontSize: theme.typography.fontSize,
			fontWeight: theme.typography.fontWeightBold,
			fontFamily: theme.typography.fontFamily,
			labels: {
				colors: theme.palette.text,
			},
			formatter: legendLabelFormatter,
		},
		// TODO The chart throws an error if the series is empty
		// See https://github.com/apexcharts/apexcharts.js/issues/2090
		noData: {
			text: 'No data sources',
			style: {
				color: theme.palette.text,
				fontSize: theme.typography.fontSize,
				fontFamily: theme.typography.fontFamily,
			},
		},
	}), [theme, sizeSm]);

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
	// See issue: https://github.com/apexcharts/react-apexcharts/issues/187
	return (
		<div className={className}>
			{series.length > 0
				?
				<ReactApexChart
					type="treemap"
					height="300px"
					width={width}
					options={chartOptions}
					series={series}
				/>
				: <FuseLoading />
			}
		</div>
	);
}

export default DataUsageTreemapGraph;
