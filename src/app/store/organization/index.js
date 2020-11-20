import { combineReducers } from '@reduxjs/toolkit';
import organizations from './organizationsSlice';
import members from './membersSlice';
import teams from './teamsSlice';

const organizationReducers = combineReducers({
	organizations,
	members,
	teams,
});

export default organizationReducers;
