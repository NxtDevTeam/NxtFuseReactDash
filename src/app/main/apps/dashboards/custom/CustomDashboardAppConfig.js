import React from 'react';

const CustomDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/dashboards/custom',
			component: React.lazy(() => import('./CustomDashboardApp')),
		}
	]
};

export default CustomDashboardAppConfig;
