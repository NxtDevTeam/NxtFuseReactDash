const dataSources = {
	sales: {
		id: 'sales',
		name: 'Sales',
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
	something: {
		id: 'something',
		name: 'Some data source',
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
	devices: {
		id: 'devices',
		name: 'Devices',
		data: {
			labels: ['Desktop', 'Mobile', 'Tablet'],
			datasets: [
				{
					label: 'Usage',
					data: [92.8, 6.1, 1.1],
				},
			],
		},
	},
};

export default dataSources;
