import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';
import _ from '@lodash';
import auth0Service from 'app/services/auth0Service';
import { NxtCoreApi } from 'app/nxt-api';
import { buildProductImageUrl } from 'app/nxt-api/MarketplaceApi';
import { selectCategoriesMap } from './productCategoriesSlice';

export const getProducts = createAsyncThunk(
	'eCommerceApp/products/getProducts',
	async () => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);
		return await api.marketplace.getAllProducts();
	});

export const getProduct = createAsyncThunk(
	'eCommerceApp/products/getProduct',
	async (id) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);
		return await api.marketplace.getProduct(id);
	});

export const uploadProductImages = createAsyncThunk(
	'eCommerceApp/products/uploadProductImages',
	async ({ productId, images }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);

		// Try updating all of them. Even if any of the uploads fail, still
		// continue on to re-fetch the product data.
		const results = await Promise.allSettled(images.map(({ file, featured }) =>
			api.marketplace.uploadProductImage(productId, file, featured)));

		for (let res of results) {
			if (res.status !== 'fulfilled') {
				throw res.reason;
			}
		}
	});

export const saveProduct = createAsyncThunk(
	'eCommerceApp/products/saveProduct',
	async ({ id, data, imagesToUpload }, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);

		// Run this first so that the "main" update returns back the new images
		// uploaded and so that the featured image ID is valid.
		await dispatch(uploadProductImages({
			productId: id,
			images: imagesToUpload,
		}));

		return await api.marketplace.updateProduct(id, data);
	});

export const createProduct = createAsyncThunk(
	'eCommerceApp/products/createProduct',
	async ({ data, imagesToUpload }, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);
		const product = await api.marketplace.createProduct(data);
		await dispatch(uploadProductImages({
			productId: product.id,
			images: imagesToUpload,
		}));

		return product;
	});

export const removeProduct = createAsyncThunk(
	'eCommerceApp/products/removeProduct',
	async (id) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);
		// Products cannot be deleted, since they may be referenced from orders, so
		// just mark the product as unavailable.
		await api.marketplace.updateProduct(id, { available: false });
	});

const productsAdapter = createEntityAdapter();

const selectSlice = (state) => state.eCommerceApp.products;

export const selectSearchText = (state) => selectSlice(state).searchText;

export const selectProductsLoading = (state) => selectSlice(state).loading;
export const selectProductUpdating = (state) => selectSlice(state).updating;

const populateProduct = (product, categoriesMap) => (product && {
	...product,
	on_sale: product.sale_price != null,
	actual_price: product.sale_price != null ? product.sale_price : product.price,
	categories: product.categories.map((catId) =>
		categoriesMap[catId] ?? { id: catId }),
	featured_image_url: product.featured_image
		&& buildProductImageUrl(product.id, product.featured_image),
	image_urls: product.images.map((image) =>
		buildProductImageUrl(product.id, image)),
});

const {
	selectAll,
	selectEntities,
	selectById,
} = productsAdapter.getSelectors(selectSlice);

export const selectProducts = createSelector(
	selectAll,
	selectCategoriesMap,
	(products, categoriesMap) =>
		products.map((product) => populateProduct(product, categoriesMap))
);

export const selectProductsMap = createSelector(
	selectEntities,
	selectCategoriesMap,
	(productsMap, categoriesMap) => _.mapValues(
		productsMap,
		(product) => populateProduct(product, categoriesMap),
	)
);

export const selectProductById = (state, productId) => populateProduct(
	selectById(state, productId),
	selectCategoriesMap(state),
);

const productsSlice = createSlice({
	name: 'eCommerceApp/products',
	initialState: productsAdapter.getInitialState({
		searchText: '',
		loading: false,
		updating: false,
	}),
	reducers: {
		setProductsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getProducts.pending]: (state) => {
			state.loading = true;
		},
		[getProducts.fulfilled]: (state, action) => {
			state.loading = false;
			productsAdapter.setAll(state, action);
		},
		[getProducts.rejected]: (state) => {
			state.loading = false;
		},

		[getProduct.pending]: (state) => {
			state.loading = true;
		},
		[getProduct.fulfilled]: (state, action) => {
			state.loading = false;
			productsAdapter.upsertOne(state, action);
		},
		[getProduct.rejected]: (state) => {
			state.loading = false;
		},

		[saveProduct.pending]: (state) => {
			state.updating = true;
		},
		[saveProduct.fulfilled]: (state, action) => {
			state.updating = false;
			productsAdapter.upsertOne(state, action);
		},
		[saveProduct.rejected]: (state) => {
			state.updating = false;
		},

		[createProduct.pending]: (state) => {
			state.updating = true;
		},
		[createProduct.fulfilled]: (state, action) => {
			state.updating = false;
			productsAdapter.addOne(state, action);
		},
		[createProduct.rejected]: (state) => {
			state.updating = false;
		},

		[removeProduct.fulfilled]: (state, action) => {
			const id = action.meta.arg;
			productsAdapter.getSelectors().selectById(state, id).available = false;
		},
	}
});

export const { setProductsSearchText } = productsSlice.actions;

export default productsSlice.reducer;
