import { authRoles } from 'app/auth';
import React from 'react';
import { Redirect } from 'react-router-dom';

const OrganizationProfileAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/apps/organization/:orgId',
			component: React.lazy(() => import('./OrganizationProfileApp'))
		},
		{
			path: '/apps/organization',
			component: () => <Redirect to="/apps/organization/own" />
		}
	]
};

export default OrganizationProfileAppConfig;
