import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getFiles = createAsyncThunk('dataLibrary/files/getFiles', async () => {
	const response = await axios.get('/api/file-manager-app/files');
	const data = await response.data;

	return data;
});

const filesAdapter = createEntityAdapter({});

const selectSlice = (state) => state.dataLibrary.files;

export const {
	selectAll: selectFiles,
	selectEntities: selectFilesEntities,
	selectById: selectFileById
} = filesAdapter.getSelectors(selectSlice);

export const selectSelectedItemId =
	(state) => selectSlice(state).selectedItemId;

export const selectSelectedFile =
	(state) => selectFileById(state, selectSelectedItemId(state));

const filesSlice = createSlice({
	name: 'dataLibrary/files',
	initialState: filesAdapter.getInitialState({
		selectedItemId: '1'
	}),
	reducers: {
		setSelectedItem: (state, action) => {
			state.selectedItemId = action.payload;
		}
	},
	extraReducers: {
		[getFiles.fulfilled]: filesAdapter.setAll
	}
});

export const { setSelectedItem } = filesSlice.actions;

export default filesSlice.reducer;
