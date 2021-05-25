import { combineReducers } from '@reduxjs/toolkit';
import events from './eventsSlice';
import filter from './filterSlice';

const reducer = combineReducers({
	events,
	filter,
});

export default reducer;
