import React from 'react';
import { Redirect } from 'react-router-dom';
import { authRoles } from 'app/auth';

const ECommerceManagementAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.globalAdmin,
	routes: [
		{
			path: '/apps/e-commerce/products/:productId',
			component: React.lazy(() => import('./product/Product'))
		},
		{
			path: '/apps/e-commerce/products',
			component: React.lazy(() => import('./products/Products'))
		},
		{
			path: '/apps/e-commerce/orders/:orderId',
			component: React.lazy(() => import('./order/Order'))
		},
		{
			path: '/apps/e-commerce/orders',
			component: React.lazy(() => import('./orders/Orders'))
		},
		{
			path: '/apps/e-commerce',
			component: () => <Redirect to="/apps/e-commerce/products" />
		}
	]
};

export default ECommerceManagementAppConfig;
