import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
	name: 'calendarApp/filter',
	initialState: {
		eventType: 'all',
	},
	reducers: {
		setEventTypeFilter: (state, action) => {
			state.eventType = action.payload;
		},
	}
});

export const {
	setEventTypeFilter,
} = filterSlice.actions;

export const selectEventTypeFilter =
	(state) => state.calendarApp.filter.eventType;

export default filterSlice.reducer;
