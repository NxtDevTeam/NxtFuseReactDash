import { combineReducers } from '@reduxjs/toolkit';
import organizations from './organizationsSlice';

const organizationReducers = combineReducers({
	organizations,
});

export default organizationReducers;
