import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';
import auth0Service from 'app/services/auth0Service';
import { NxtCoreApi } from 'app/nxt-api';

export const fetchUser = createAsyncThunk(
	'users/fetchOne',
	async (userId) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtCoreApi(token);
		return await api.getUser(userId);
	}
);

// TODO Have an `ensureUser` which only fetches a user if not already
// downloaded, or just fetch it every time it is needed so that it will refresh
// information?

/**
 * Stores loading users wrapped in some metadata about their loading.
 *
 * Each object is stored as:
 * {
 *  id,
 * 	loading,
 * 	data, // actual users data
 * 	error,
 * }
 */
const usersAdapter = createEntityAdapter();

const selectUsersSlice = state => state.users;

export const {
	selectAll: selectUsers,
	selectEntities: selectUsersMap,
	selectById: selectUser,
} = usersAdapter.getSelectors(selectUsersSlice);

function errorReducer(state, action) {
	usersAdapter.upsertOne(state, {
		id: action.meta.arg,
		loading: false,
		error: action.error,
	});
}

const wrapuserData = (user) => ({
	id: user.id,
	loading: false,
	data: user,
	error: null,
});

const usersSlice = createSlice({
	name: 'users',
	initialState: usersAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[fetchUser.pending]: (state, action) => {
			usersAdapter.upsertOne(state, {
				id: action.meta.arg,
				loading: true,
				error: null,
			});
		},
		[fetchUser.fulfilled]: (state, action) => {
			usersAdapter.upsertOne(state, wrapuserData(action.payload));
		},
		[fetchUser.rejected]: errorReducer,
	}
});

export default usersSlice.reducer;
