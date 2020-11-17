import React from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import DashletRow from './DashletRow';

const dashboardLayout = {
	rows: [
		{
			dashlets: [
				{
					title: 'Sales',
					type: 'line',
					input: {
						data: {
							labels: [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
							datasets: [
								{
									label: 'Sales',
									data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9],
									fill: 'start',
								}
							],
						},
					},
				},
			],
		},
		{
			title: 'Smaller graphs',
			dashlets: [
				{
					title: 'A data-source',
					type: 'bar',
					input: {
						data: {
							labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
							datasets: [
								{
									label: 'Conversion',
									data: [221, 428, 492, 471, 413, 344, 294]
								}
							],
						},
					},
				},
				{
					title: 'Devices',
					type: 'pie',
					input: {
						data: {
							labels: ['Desktop', 'Mobile', 'Tablet'],
							datasets: [
								{
									data: [92.8, 6.1, 1.1],
									change: [-0.6, 0.7, 0.1],
								},
							],
						},
					}
				},
			],
		},
	],
};

function CustomDashboardApp() {
	return (
		<div className="w-full">
			<FuseAnimate animation="transition.slideUpIn" delay={200}>
				<div className="flex flex-col sm:p-8">
					{dashboardLayout.rows.map(({ title, dashlets }, index) => (
						<DashletRow key={index} title={title} dashlets={dashlets} />
					))}
				</div>
			</FuseAnimate>
		</div>
	);
}

export default CustomDashboardApp;
