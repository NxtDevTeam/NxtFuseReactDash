import { combineReducers } from '@reduxjs/toolkit';
import organizations from './organizationsSlice';
import members from './membersSlice';

const organizationReducers = combineReducers({
	organizations,
	members,
});

export default organizationReducers;
