import React, { useEffect, useMemo } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import reducer from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import {
	getProducts,
	selectProducts,
	selectProductsLoading,
} from '../../store/productsSlice';
import { getAllProductCategories } from '../../store/productCategoriesSlice';
import { useLocation } from 'react-router';
import history from '@history';
import SortableProductList from '../common/SortableProductList';
import ProductSearchHeader from './ProductSearchHeader';

function MarketplaceFrontPage() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getProducts());
		dispatch(getAllProductCategories());
	}, [dispatch]);

	const allProducts = useSelector(selectProducts);
	const productsLoading = useSelector(selectProductsLoading);

	const location = useLocation();
	const searchText = new URLSearchParams(location.search).get('searchText');

	const filteredProducts = useMemo(() => {
		const lowerSearch = searchText.trim().toLowerCase();

		// TODO More thourough / fuzzy search
		return allProducts.filter((product) =>
			product.name.toLowerCase().includes(lowerSearch));
	}, [allProducts, searchText]);

	function handleSearch(newSearch) {
		const query = new URLSearchParams({ searchText: newSearch });
		history.push(
			`/apps/marketplace/search?${query.toString()}`
		);
	}

	return (
		<FusePageSimple
			classes={{
				content: 'sm:p-24',
			}}
			header={
				<ProductSearchHeader
					initialSearchText={searchText}
					onSubmit={handleSearch}
				/>
			}
			content={
				<SortableProductList
					title="Search Results"
					loading={productsLoading}
					products={filteredProducts}
				/>
			}
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(MarketplaceFrontPage);
