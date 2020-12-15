import React from 'react';

const MarketplaceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/marketplace/search',
			component:
				React.lazy(() => import('./marketplace-search/MarketplaceSearchPage')),
		},
		{
			path: '/apps/marketplace',
			component: React.lazy(() => import('./front-page/MarketplaceFrontPage')),
		},
	]
};

export default MarketplaceAppConfig;
