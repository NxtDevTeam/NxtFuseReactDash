import React from 'react';
import { authRoles } from 'app/auth';

const DataLibraryAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/apps/data-library',
			component: React.lazy(() => import('./DataLibraryApp'))
		}
	]
};

export default DataLibraryAppConfig;
