import React from 'react';

const VideoConferenceAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/video-conference/:conferenceId',
			component: React.lazy(() => import('./VideoConferenceApp'))
		},
	]
};

export default VideoConferenceAppConfig;
