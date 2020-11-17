import React from 'react';

const DashboardBuilderAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/dashboards/builder',
			component: React.lazy(() => import('./DashboardBuilderApp')),
		}
	]
};

export default DashboardBuilderAppConfig;
