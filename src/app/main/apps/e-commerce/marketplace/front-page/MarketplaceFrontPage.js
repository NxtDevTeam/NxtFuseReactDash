import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import clsx from 'clsx';
import withReducer from 'app/store/withReducer';
import reducer from '../../store';
import MarketplaceBanner from './MarketplaceBanner';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, selectProducts } from '../../store/productsSlice';
import {
	getAllProductCategories,
	selectCategories,
} from '../../store/productCategoriesSlice';
import MarketplaceFrontPageContent from './MarketplaceFrontPageContent';
import history from '@history';

const bannerImages = [
	{
		id: 1,
		description: 'Nxt AI',
		src: 'assets/images/ecommerce/nxt-banner-ad.png',
	},
	{
		id: 2,
		description: 'Nxt AI',
		src: 'assets/images/ecommerce/nxt-banner-ad.png',
	},
	{
		id: 3,
		description: 'Nxt AI',
		src: 'assets/images/ecommerce/nxt-banner-ad.png',
	},
];

// TODO Determine/choose how many to extract for each subset of products
const PRODUCT_GROUP_SIZE = 12;

const useStyles = makeStyles({
	header: {
		minHeight: 'auto !important',
		height: 'auto !important',
	},
});

function MarketplaceFrontPage() {
	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getProducts());
		dispatch(getAllProductCategories());
	}, [dispatch]);

	const categories = useSelector(selectCategories);
	const allProducts = useSelector(selectProducts);

	const newProducts = useMemo(() => {
		// TODO Base off of creation date once it is added to the product
		// Right now just take the last N items
		return allProducts.slice(allProducts.length - PRODUCT_GROUP_SIZE);
	}, [allProducts]);

	const saleProducts = useMemo(() => {
		const allOnSale = allProducts
			.filter((product) => product.sale_price != null);
		return allOnSale.slice(allOnSale.length - PRODUCT_GROUP_SIZE);
	}, [allProducts]);

	const [searchText, setSearchText] = useState('');

	function handleSubmitSearch() {
		const query = new URLSearchParams({ searchText });
		history.push(`/apps/marketplace/search?${query.toString()}`);
	}

	return (
		<FusePageSimple
			classes={{
				header: clsx(classes.header, 'p-8'),
			}}
			header={<MarketplaceBanner images={bannerImages} />}
			content={
				<MarketplaceFrontPageContent
					categories={categories}
					newProducts={newProducts}
					saleProducts={saleProducts}
					searchText={searchText}
					setSearchText={setSearchText}
					onSubmitSearch={handleSubmitSearch}
				/>
			}
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(MarketplaceFrontPage);
