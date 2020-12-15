import React from 'react';

const MarketplaceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/marketplace/product/:productId',
			component:
				React.lazy(() => import('./product-details/ProductDetailsPage')),
		},
		{
			path: '/apps/marketplace/category/:categoryId',
			component:
				React.lazy(() => import('./category-products/CategoryProductsPage')),
		},
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
