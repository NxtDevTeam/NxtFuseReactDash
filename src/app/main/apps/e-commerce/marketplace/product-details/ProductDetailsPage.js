import React, { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import withReducer from 'app/store/withReducer';
import reducer from '../../store';
import {
	getProduct,
	selectProductById,
	selectProductsLoading,
} from '../../store/productsSlice';
import { getAllProductCategories } from '../../store/productCategoriesSlice';
import ProductBreadcrums from './ProductBreadcrums';
import ProductDetailsContent from './ProductDetailsContent';

function ProductDetailsPage() {
	const dispatch = useDispatch();

	const { productId } = useParams();

	useEffect(() => {
		dispatch(getAllProductCategories());
		dispatch(getProduct(productId));
	}, [dispatch, productId]);

	const loading = useSelector(selectProductsLoading);
	const product = useSelector((state) => selectProductById(state, productId));

	return (
		<FusePageCarded
			classes={{
				header: 'flex items-center',
				toolbar: 'px-24',
				content: 'p-24',
			}}
			header={
				loading
					? <FuseLoading />
					: <Typography variant="h3">
						{product ? product.name : 'Unknown product'}
					</Typography>
			}
			contentToolbar={product && <ProductBreadcrums product={product} />}
			content={product && <ProductDetailsContent product={product} />}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(ProductDetailsPage);
