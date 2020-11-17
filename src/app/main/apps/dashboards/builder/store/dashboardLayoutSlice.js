import { createSlice } from '@reduxjs/toolkit';

const initiailDashlet = {
	title: '',
	type: null,
	input: null,
	options: null,
};

const initialRow = {
	title: '',
	dashlets: [initiailDashlet],
}

const dashboardLayoutSlice = createSlice({
	name: 'dashbordBuilderApp/dashboardLayout',
	initialState: {
		rows: [initialRow],
	},
	reducers: {
		addDashletRow(state, action) {
			state.rows.splice(action.payload, 0, initialRow);
		},
		removeDashletRow(state, action) {
			state.rows.splice(action.payload, 1);
		},
		setDashletRowTitle(state, action) {
			const { index, title } = action.payload;
			state.rows[index].title = title;
		},
		addDashlet(state, action) {
			const { row, col } = action.payload;
			state.rows[row].dashlets.splice(col, 0, initiailDashlet);
		},
		removeDashlet(state, action) {
			const { row, col } = action.payload;
			state.rows[row].dashlets.splice(col, 1);
		},
		updateDashlet(state, action) {
			const { row, col, data } = action.payload;
			// TODO is this save to use with immer?
			Object.assign(state.rows[row].dashlets[col], data);
		},
	},
});

export const {
	addDashletRow,
	removeDashletRow,
	setDashletRowTitle,
	addDashlet,
	removeDashlet,
	updateDashlet,
} = dashboardLayoutSlice.actions;

export const selectDashboardLayout =
	(state) => state.dashboardBuilderApp.dashboardLayout;

export default dashboardLayoutSlice.reducer;
