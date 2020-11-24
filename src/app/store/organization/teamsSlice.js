import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';
import auth0Service from 'app/services/auth0Service';
import NxtBackendApi from 'app/nxt-api';

import { selectOwnOrgId } from 'app/auth/store/userSlice';

export const fetchTeamList = createAsyncThunk(
	'organization/teams/fetchAll',
	async (orgId) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtBackendApi(token);
		return await api.getAllTeams(orgId);
	}
);

/**
 * Stores loading team lists wrapped in some metadata about their loading.
 *
 * Each element is stored as:
 * {
 *  id,
 * 	loading,
 * 	data, // actual team list data returned from the API
 * 	error,
 * }
 */
const teamsAdapter = createEntityAdapter();

export const selectTeamsSlice = (state) => state.organization.teams;

const {
	selectById: selectOrgTeams,
	selectEntities: selectTeamEntities,
} = teamsAdapter.getSelectors(selectTeamsSlice);

export { selectOrgTeams };

export const selectOwnOrgTeams = createSelector(
	selectTeamEntities,
	selectOwnOrgId,
	(teamsMap, ownOrgId) => ownOrgId ? teamsMap[ownOrgId] : undefined
);

const teamsSlice = createSlice({
	name: 'teams',
	initialState: teamsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[fetchTeamList.pending]: (state, action) => {
			teamsAdapter.upsertOne(state, {
				id: action.meta.arg,
				loading: true,
			});
		},
		[fetchTeamList.fulfilled]: (state, action) => {
			teamsAdapter.upsertOne(state, {
				id: action.meta.arg,
				loading: false,
				data: action.payload,
				error: null,
			});
		},
		[fetchTeamList.rejected]: (state, action) => {
			teamsAdapter.upsertOne(state, {
				id: action.meta.arg,
				error: action.error,
			});
		},
	},
});

export default teamsSlice.reducer;

