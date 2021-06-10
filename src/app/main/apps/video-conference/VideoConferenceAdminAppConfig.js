import { authRoles } from 'app/auth';
import React from 'react';

const VideoConferenceAdminAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/apps/video-conference',
			component: React.lazy(() => import('./VideoConferenceAdminApp'))
		},
	]
};

export default VideoConferenceAdminAppConfig;
