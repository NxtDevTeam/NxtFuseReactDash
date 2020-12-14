import React from 'react';

const MarketplaceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/marketplace',
			component: React.lazy(() => import('./front-page/MarketplaceFrontPage')),
		},
	]
};

export default MarketplaceAppConfig;
