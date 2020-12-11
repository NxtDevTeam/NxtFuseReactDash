import { combineReducers } from '@reduxjs/toolkit';
import orders from './ordersSlice';
import products from './productsSlice';
import categories from './productCategoriesSlice';

const reducer = combineReducers({
	products,
	categories,
	orders,
});

export default reducer;
