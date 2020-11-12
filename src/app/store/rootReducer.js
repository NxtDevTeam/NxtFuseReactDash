import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import fuse from './fuse';
import i18n from './i18nSlice';
import organization from './organization';

const createReducer = asyncReducers =>
	combineReducers({
		auth,
		fuse,
		i18n,
		organization,
		...asyncReducers
	});

export default createReducer;
