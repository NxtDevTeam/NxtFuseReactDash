import { combineReducers } from '@reduxjs/toolkit';
import meetings from './meetingsSlice';

const reducer = combineReducers({
	meetings,
});

export default reducer;
