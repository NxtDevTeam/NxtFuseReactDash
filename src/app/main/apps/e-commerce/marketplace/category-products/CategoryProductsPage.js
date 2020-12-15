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
import {
	getAllProductCategories,
	selectCategoriesLoading,
	selectCategoryById,
} from '../../store/productCategoriesSlice';
import { useParams } from 'react-router';
import SortableProductList from '../common/SortableProductList';
import { Typography } from '@material-ui/core';
import FuseLoading from '@fuse/core/FuseLoading';

function MarketplaceFrontPage() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getProducts());
		// Fetch all products for showing other categories of the products shown
		dispatch(getAllProductCategories());
	}, [dispatch]);

	const { categoryId } = useParams();

	const category = useSelector(
		(state) => selectCategoryById(state, categoryId));
	const categoryLoading = useSelector(selectCategoriesLoading);
	const allProducts = useSelector(selectProducts);
	const productsLoading = useSelector(selectProductsLoading);

	const filteredProducts = useMemo(() => {
		return allProducts.filter((product) =>
			product.categories.some((cat) => cat.id === categoryId));
	}, [allProducts, categoryId]);

	return (
		<FusePageSimple
			classes={{
				header: 'flex items-center p-16',
				content: 'sm:p-24',
			}}
			header={categoryLoading
				? <FuseLoading />
				: (
					< Typography variant="h3">
						{category ? category.name : 'Unknown category'}
					</Typography>
				)
			}
			content={
				< SortableProductList
					title="Products"
					loading={productsLoading}
					products={filteredProducts}
				/>
			}
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(MarketplaceFrontPage);
