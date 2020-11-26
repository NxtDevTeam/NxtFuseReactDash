import React from 'react';

const DataLibraryAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/data-library',
			component: React.lazy(() => import('./DataLibraryApp'))
		}
	]
};

export default DataLibraryAppConfig;
