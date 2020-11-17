import { combineReducers } from '@reduxjs/toolkit';
import dashboardLayout from './dashboardLayoutSlice';

const reducer = combineReducers({
	dashboardLayout,
});

export default reducer;
