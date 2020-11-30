import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

const dataSources = [
	{
		id: 'SQL_12345_ZXY',
		type: 'PHP/SQL',
		name: 'SQL_12345_ZXY',
		size: 1200_000_000,
	},
	{
		id: 'SQL_54321_ZYX',
		type: 'PHP/SQL',
		name: 'SQL_54321_ZYX',
		size: 1000_000_000,
	},
	{
		id: 'DB_JASPE6',
		type: 'MongoDB',
		name: 'DB_JASPE6',
		size: 700_000_000,
	},
	{
		id: 'DB_JASPE7',
		type: 'MongoDB',
		name: 'DB_JASPE7',
		size: 400_000_000,
	},
	{
		id: 'DB_JASPE8',
		type: 'MongoDB',
		name: 'DB_JASPE8',
		size: 110_000_000,
	},
	{
		id: 'DB_JASPE9',
		type: 'MongoDB',
		name: 'DB_JASPE9',
		size: 200_000_000,
	},
	{
		id: 'DB_JASPE3',
		type: 'MySQL',
		name: 'DB_JASPE3',
		size: 200_000_000,
	},
	{
		id: 'CLD_321',
		type: 'Cloud',
		name: 'CLD_321',
		size: 1000_000_000,
	},
	{
		id: 'REST_12QA',
		type: 'REST API',
		name: 'REST_12QA',
		size: 120_000_000,
	},
	{
		id: 'REST_98WD',
		type: 'REST API',
		name: 'REST_98WD',
		size: 250_000_000,
	},
	{
		id: 'LOCAL_DB_781',
		type: 'Local',
		name: 'LOCAL_DB_781',
		size: 80_000_000,
	},
];

export const getDataSources = createAsyncThunk(
	'dataLibrary/dataSources/getDataSources',
	async () => {
		return dataSources;
	});

const dataSourcesAdapter = createEntityAdapter();

const selectSlice = (state) => state.dataLibrary.dataSources;

export const {
	selectAll: selectDataSources,
	selectEntities: selectDataSourceEntities,
	selectById: selectDataSourceById
} = dataSourcesAdapter.getSelectors(selectSlice);

export const selectSelectedItemId =
	(state) => selectSlice(state).selectedItemId;

export const selectSelectedDataSource =
	(state) => selectDataSourceById(state, selectSelectedItemId(state));

const dataSourcesSlice = createSlice({
	name: 'dataLibrary/dataSources',
	initialState: dataSourcesAdapter.getInitialState({
		selectedItemId: null,
	}),
	reducers: {
		setSelectedItem: (state, action) => {
			state.selectedItemId = action.payload;
		}
	},
	extraReducers: {
		[getDataSources.fulfilled]: dataSourcesAdapter.setAll
	}
});

export const { setSelectedItem } = dataSourcesSlice.actions;

export default dataSourcesSlice.reducer;
