import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';
import auth0Service from 'app/services/auth0Service';
import { NxtCoreApi } from 'app/nxt-api';

export const fetchMemberList = createAsyncThunk(
	'memberList/fetch',
	async (orgId) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtCoreApi(token);
		return await api.getOrganizationMembers(orgId);
	}
);

/**
 * Stores loading member lists wrapped in some metadata about their loading.
 *
 * Each element is stored as:
 * {
 *  id,
 * 	loading,
 * 	data, // actual member list data returned from the API
 * 	error,
 * }
 */
const membersAdapter = createEntityAdapter();

export const selectMembersSlice = (state) => state.organization.members;

export const {
	selectById: selectOrgMembers,
} = membersAdapter.getSelectors(selectMembersSlice);

const membersSlice = createSlice({
	name: 'members',
	initialState: membersAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[fetchMemberList.pending]: (state, action) => {
			membersAdapter.upsertOne(state, {
				id: action.meta.arg,
				loading: true,
			});
		},
		[fetchMemberList.fulfilled]: (state, action) => {
			membersAdapter.upsertOne(state, {
				id: action.meta.arg,
				loading: false,
				data: action.payload,
				error: null,
			});
		},
		[fetchMemberList.rejected]: (state, action) => {
			membersAdapter.upsertOne(state, {
				id: action.meta.arg,
				error: action.error,
			});
		},
	},
});

export default membersSlice.reducer;
