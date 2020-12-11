import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import fuse from './fuse';
import i18n from './i18nSlice';
import organization from './organization';
import users from './usersSlice';

const createReducer = asyncReducers =>
	combineReducers({
		auth,
		fuse,
		i18n,
		organization,
		users,
		...asyncReducers
	});

export default createReducer;
