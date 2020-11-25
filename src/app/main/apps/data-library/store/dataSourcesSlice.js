import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';
import auth0Service from 'app/services/auth0Service';
import { NxtCoreApi } from 'app/nxt-api';
import { selectOwnOrgId } from 'app/auth/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getDataSources = createAsyncThunk(
	'dataLibrary/dataSources/getDataSources',
	async (_, { getState, dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const orgId = selectOwnOrgId(getState());

		const api = new NxtCoreApi(token);
		try {
			return await api.getAllDataSources(orgId);
		} catch (e) {
			dispatch(showMessage({ message: 'Failed to fetch data sources' }));
			throw e;
		}
	});

export const createDataSource = createAsyncThunk(
	'dataLibrary/dataSources/createDataSource',
	async (dataSource, { getState, dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const orgId = selectOwnOrgId(getState());

		const api = new NxtCoreApi(token);
		try {
			return await api.createDataSource(orgId, dataSource);
		} catch (e) {
			dispatch(showMessage({ message: 'Failed to create new data source' }));
			throw e;
		}
	});

export const updateDataSource = createAsyncThunk(
	'dataLibrary/dataSources/updateDataSource',
	async ({ id, data }, { getState, dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const orgId = selectOwnOrgId(getState());

		const api = new NxtCoreApi(token);
		try {
			return await api.updateDataSource(orgId, id, data);
		} catch (e) {
			dispatch(showMessage({ message: 'Failed to update data source' }));
			throw e;
		}
	});

export const deleteDataSource = createAsyncThunk(
	'dataLibrary/dataSources/deleteDataSource',
	async (id, { getState, dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const orgId = selectOwnOrgId(getState());

		const api = new NxtCoreApi(token);
		try {
			await api.deleteDataSource(orgId, id);
			return id;
		} catch (e) {
			dispatch(showMessage({ message: 'Failed to delete data source' }));
			throw e;
		}
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

export const selectDialogState = (state) => selectSlice(state).dialog;

const dataSourcesSlice = createSlice({
	name: 'dataLibrary/dataSources',
	initialState: dataSourcesAdapter.getInitialState({
		selectedItemId: null,
		loading: false,
		dialog: {
			open: false,
			initialValue: null,
		},
	}),
	reducers: {
		setSelectedItem: (state, action) => {
			state.selectedItemId = action.payload;
		},
		openNewSourceDialog: (state) => {
			state.dialog = {
				open: true,
				initialValue: null,
			};
		},
		openEditSourceDialog: (state, action) => {
			const current =
				dataSourcesAdapter.getSelectors().selectById(state, action.payload);
			state.dialog = {
				open: true,
				initialValue: current,
			};
		},
		closeDialog: (state) => {
			state.dialog.open = false;
		},
	},
	extraReducers: {
		[getDataSources.pending]: (state) => {
			state.loading = true;
		},
		[getDataSources.fulfilled]: (state, action) => {
			state.loading = false;
			dataSourcesAdapter.setAll(state, action.payload);
		},
		[getDataSources.rejected]: (state) => {
			state.loading = false;
		},

		[createDataSource.fulfilled]: dataSourcesAdapter.addOne,
		[updateDataSource.fulfilled]: dataSourcesAdapter.upsertOne,
		[deleteDataSource.fulfilled]: dataSourcesAdapter.removeOne,
	}
});

export const {
	setSelectedItem,
	openNewSourceDialog,
	openEditSourceDialog,
	closeDialog,
} = dataSourcesSlice.actions;

export default dataSourcesSlice.reducer;