import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';
import auth0Service from 'app/services/auth0Service';
import NxtBackendApi from 'app/nxt-api';

export const fetchOrganization = createAsyncThunk(
	'organization/fetchOne',
	async (orgId) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.getOrganization(orgId);
	}
);

export const fetchAllOrganizations = createAsyncThunk(
	'organization/fetchAll',
	async () => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.getAllOrganizations();
	}
);

export const updateOrganization = createAsyncThunk(
	'organization/updateOne',
	async ({ orgId, organization }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		return await api.updateOrganization(orgId, organization);
	}
);

export const fetchOwnOrganization = createAsyncThunk(
	'organization/fetchOwn',
	async (_, { dispatch }) => {
		const userData = await auth0Service.getUserData();
		const orgId = auth0Service.extractAppMetadata(userData).organization_id;

		if (orgId) {
			dispatch(fetchOrganization(orgId));
			return orgId;
		} else {
			return null;
		}
	}
);

export const updateOwnOrganization = createAsyncThunk(
	'organization/updateOwn',
	async (organization, { dispatch }) => {
		const userData = await auth0Service.getUserData();
		const orgId = auth0Service.extractAppMetadata(userData).organization_id;

		if (orgId) {
			dispatch(updateOrganization(orgId, organization));
		} else {
			throw new Error('User does not belong to an organization');
		}
	}
);

/**
 * Stores loading organizations wrapped in some metadata about their loading.
 *
 * Each object is stored as:
 * {
 *  id,
 * 	loading,
 * 	updating,
 * 	data, // actual organization data
 * 	error,
 * }
 */
const organizationAdapter = createEntityAdapter();

const selectOrganizationsSlice = state => state.organization.organizations;

const createSliceSelector = prop => createSelector(
	selectOrganizationsSlice,
	slice => slice[prop],
);

export const {
	selectAll: selectOrganizations,
	selectById: selectOrganization,
} = organizationAdapter.getSelectors(selectOrganizationsSlice);

export const selectLoadingAll = createSliceSelector('loadingAll');

export const selectErrorLoadingAll = createSliceSelector('error');

export const selectOwnOrgId = createSliceSelector('ownOrgId');

export function selectOwnOrganization(state) {
	const id = selectOwnOrgId(state);
	return id ? selectOrganization(state, id) : null;
}

function errorReducer(state, action) {
	organizationAdapter.upsertOne(state, {
		id: action.meta.arg,
		loading: false,
		updating: false,
		error: action.error,
	});
}

const wrapOrgData = (organization) => ({
	id: organization.id,
	loading: false,
	updating: false,
	data: organization,
	error: null,
});

const organizationSlice = createSlice({
	name: 'organizations',
	initialState: organizationAdapter.getInitialState({
		loadingAll: false,
		ownOrgId: null,
		error: null,
	}),
	reducers: {},
	extraReducers: {
		[fetchOrganization.pending]: (state, action) => {
			organizationAdapter.upsertOne(state, {
				id: action.meta.arg,
				loading: true,
				error: null,
			});
		},
		[fetchOrganization.fulfilled]: (state, action) => {
			organizationAdapter.upsertOne(state, wrapOrgData(action.payload));
		},
		[fetchOrganization.rejected]: errorReducer,

		[fetchAllOrganizations.pending]: (state) => {
			state.loadingAll = true;
		},
		[fetchAllOrganizations.fulfilled]: (state, action) => {
			state.loadingAll = false;
			state.error = null;
			organizationAdapter.setAll(state, action.payload.map(wrapOrgData));
		},
		[fetchAllOrganizations.rejected]: (state, action) => {
			state.loadingAll = false;
			state.error = action.error;
		},

		[updateOrganization.pending]: (state, action) => {
			organizationAdapter.upsertOne(state, {
				id: action.meta.arg,
				updating: true,
				error: null,
			});
		},
		[updateOrganization.fulfilled]: (state, action) => {
			organizationAdapter.upsertOne(state, wrapOrgData(action.payload));
		},
		[updateOrganization.rejected]: errorReducer,

		[fetchOwnOrganization.fulfilled]: (state, action) => {
			state.ownOrgId = action.payload;
		},
	}
});

export default organizationSlice.reducer;
