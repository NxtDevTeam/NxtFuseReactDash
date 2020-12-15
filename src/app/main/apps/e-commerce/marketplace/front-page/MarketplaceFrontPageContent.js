import React from 'react';
import { makeStyles } from '@material-ui/core';
import FeaturedProductList from './FeaturedProductsList';
import CategoriesList from './CategoriesList';
import ProductSearchBox from '../common/ProductSearchBox';

const useStyles = makeStyles((theme) => ({
	searchBox: {
		backgroundColor: theme.palette.background,
	},
	categories: {
		backgroundColor: theme.palette.primary.dark,
	},
	newProducts: {
		backgroundColor: theme.palette.background,
	},
	saleProducts: {
		backgroundColor: theme.palette.primary.dark,
	},
}));

function MarketplaceFrontPageContent({
	categories,
	newProducts,
	saleProducts,
	searchText,
	setSearchText,
	onSubmitSearch,
}) {
	const classes = useStyles();

	return (
		<div>
			<ProductSearchBox
				className={classes.searchBox}
				searchText={searchText}
				setSearchText={setSearchText}
				onSubmit={onSubmitSearch}
				canSubmit={!!searchText}
			/>

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
