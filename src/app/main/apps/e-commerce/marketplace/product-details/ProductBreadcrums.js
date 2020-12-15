import React from 'react';
import { Breadcrumbs, Link as MuiLink } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

function Link(props) {
	return <MuiLink component={RouterLink} {...props} />;
}

function ProductBreadcrums({ product }) {
	// TODO Figure out how to handle products in multiple categories
	const productCategory = product.categories[0];

	return (
		<Breadcrumbs>
			{productCategory?.id &&
				<Link to={`/apps/marketplace/category/${productCategory.id}`}>
					{productCategory.name ?? 'Category'}
				</Link>
			}

			<Link to={`/apps/marketplace/product/${product.id}`}>
				{product.name}
			</Link>
		</Breadcrumbs>
	);
}

export default ProductBreadcrums;
