import { combineReducers } from '@reduxjs/toolkit';
import dataSources from './dataSourcesSlice';

const reducer = combineReducers({
	dataSources
});

export default reducer;
