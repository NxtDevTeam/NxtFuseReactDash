import { createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { fetchOwnOrganization } from 'app/store/organization/organizationsSlice';
import auth0Service from 'app/services/auth0Service';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';

export const setUserDataAuth0 = data => async dispatch => {
	let roles = auth0Service.extractRoles(data);
	if (roles.length === 0) {
		roles = ['Member'];
	}

	const user_metadata = auth0Service.extractUserMetadata(data);
	const app_metadata = auth0Service.extractAppMetadata(data);
	const user = {
		role: roles,
		from: 'auth0',
		data: {
			id: data.sub,
			name: data.name,
			displayName: data.name || data.username,
			picture: data.picture,
			email: data.email,
			settings: user_metadata.settings ? user_metadata.settings : {},
			shortcuts: user_metadata.shortcuts ? user_metadata.shortcuts : [],
			organizationId: app_metadata.organization_id,
			teamId: app_metadata.team_id,
		}
	};

	return dispatch(setUserData(user));
};

export const setUserDataFirebase = (user, authUser) => async dispatch => {
	if (
		user &&
		user.data &&
		user.data.settings &&
		user.data.settings.theme &&
		user.data.settings.layout &&
		user.data.settings.layout.style
	) {
		// Set user data but do not update
		return dispatch(setUserData(user));
	}

	// Create missing user settings
	return dispatch(createUserSettingsFirebase(authUser));
};

export const createUserSettingsFirebase = authUser => async (dispatch, getState) => {
	const guestUser = getState().auth.user;
	const fuseDefaultSettings = getState().fuse.settings.defaults;
	const { currentUser } = firebase.auth();

	/**
	 * Merge with current Settings
	 */
	const user = _.merge({}, guestUser, {
		uid: authUser.uid,
		from: 'firebase',
		role: ['admin'],
		data: {
			displayName: authUser.displayName,
			email: authUser.email,
			settings: { ...fuseDefaultSettings }
		}
	});
	currentUser.updateProfile(user.data);

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const setUserData = user => async (dispatch, getState) => {
	// You can redirect the logged-in user to a specific route depending on his role

	history.location.state = {
		redirectUrl: user.redirectUrl
	};

	dispatch(setDefaultSettings(user.data.settings));

	dispatch(setUser(user));

	dispatch(fetchOwnOrganization());
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
			shortcuts
		}
	};

	dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
	const { user } = getState().auth;

	if (!user.role || user.role.length === 0) {
		// is guest
		return null;
	}

	switch (user.from) {
		case 'firebase': {
			firebaseService.signOut();
			break;
		}
		case 'auth0': {
			auth0Service.logout();
			break;
		}
		default: {
			jwtService.logout();
		}
	}

	dispatch(setInitialSettings());

	dispatch(userLoggedOut());
};

export const updateUserData = user => async (dispatch, getState) => {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}
	switch (user.from) {
		case 'firebase': {
			firebaseService
				.updateUserData(user)
				.then(() => {
					dispatch(showMessage({ message: 'User data saved to firebase' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
		case 'auth0': {
			auth0Service
				.updateUserData({
					settings: user.data.settings,
					shortcuts: user.data.shortcuts
				})
				.then(() => {
					dispatch(showMessage({ message: 'User data saved to auth0' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
		default: {
			jwtService
				.updateUserData(user)
				.then(() => {
					dispatch(showMessage({ message: 'User data saved with api' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
	}
};

const selectUserSlice = (state) => state.auth.user;
const selectSliceProp = (prop) => (state) => selectUserSlice(state)[prop];
export const selectUserData = selectSliceProp('data');
export const selectUserRole = selectSliceProp('role');
export const selectUserName = (state) => selectUserData(state).displayName;
export const selectOwnOrgId = (state) => selectUserData(state).organizationId;

const initialState = {
	role: [], // guest
	data: {
		displayName: '',
		shortcuts: [],
	}
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (_, action) => action.payload,
		userLoggedOut: () => initialState
	},
	extraReducers: {}
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
