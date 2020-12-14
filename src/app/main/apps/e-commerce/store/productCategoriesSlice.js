import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';
import _ from '@lodash';

import auth0Service from 'app/services/auth0Service';
import NxtBackendApi, { buildCategoryImageUrl } from 'app/nxt-api';

export const getProductCategory = createAsyncThunk(
	'eCommerceApp/productCategories/fetchOne',
	async (categoryId) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.marketplace.getCategory(categoryId);
	}
);

export const getAllProductCategories = createAsyncThunk(
	'eCommerceApp/productCategories/fetchAll',
	async () => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.marketplace.getAllProductCategories();
	}
);

export const updateCategory = createAsyncThunk(
	'eCommerceApp/productCategories/updateOne',
	async ({ categoryId, category }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.marketplace.updateCategory(categoryId, category);
	}
);

export const uploadCategoryImage = createAsyncThunk(
	'eCommerceApp/productCategories/uploadCategoryImage',
	async ({ categoryId, file }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.marketplace.uploadCategoryImage(categoryId, file);
	})

const categoryAdapter = createEntityAdapter();

const selectCategoriesSlice = (state) => state.eCommerceApp.categories;

export const selectCategoriesLoading =
	(state) => selectCategoriesSlice(state).loading;

const populateCategory = (category) => category && {
	...category,
	featured_image_url: category.featured_image
		&& buildCategoryImageUrl(category.id, category.featured_image),
	image_urls: category.images.map((image) =>
		buildCategoryImageUrl(category.id, image)),
};

const {
	selectAll,
	selectById,
	selectEntities,
} = categoryAdapter.getSelectors(selectCategoriesSlice);

export const selectCategories = createSelector(
	selectAll,
	(categories) => categories.map(populateCategory)
);

export const selectCategoriesMap = createSelector(
	selectEntities,
	(categoriesMap) => _.mapValues(categoriesMap, populateCategory)
);

export const selectCategoryById = (state, productId) =>
	populateCategory(selectById(state, productId));

const categorySlice = createSlice({
	name: 'categories',
	initialState: categoryAdapter.getInitialState({
		loading: false,
	}),
	reducers: {},
	extraReducers: {
		[getProductCategory.fulfilled]: categoryAdapter.upsertOne,

		[getAllProductCategories.pending]: (state) => {
			state.loading = true;
		},
		[getAllProductCategories.fulfilled]: (state, action) => {
			state.loading = false;
			categoryAdapter.setAll(state, action);
		},
		[getAllProductCategories.rejected]: (state, _action) => {
			state.loading = false;
		},

		[updateCategory.fulfilled]: categoryAdapter.upsertOne,
	}
});

export default categorySlice.reducer;

