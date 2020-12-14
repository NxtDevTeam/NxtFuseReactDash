import React from 'react';
import { makeStyles } from '@material-ui/core';
import FeaturedProductList from './FeaturedProductsList';
import CategoriesList from './CategoriesList';

const useStyles = makeStyles((theme) => ({
	categories: {
		backgroundColor: theme.palette.background,
	},
	newProducts: {
		backgroundColor: theme.palette.primary.dark,
	},
	saleProducts: {
		backgroundColor: theme.palette.background,
	},
}));

function MarketplaceFrontPageContent({
	categories,
	newProducts,
	saleProducts,
}) {
	const classes = useStyles();

	return (
		<div>
			<CategoriesList
				className={classes.categories}
				title="Categories"
				categories={categories}
			/>

			<FeaturedProductList
				className={classes.newProducts}
				title="New Products"
				products={newProducts}
			/>

			<FeaturedProductList
				className={classes.saleProducts}
				title="On Sale"
				products={saleProducts}
			/>
		</div>
	);
}

export default MarketplaceFrontPageContent;
