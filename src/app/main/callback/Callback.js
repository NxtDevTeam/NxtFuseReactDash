import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import auth0Service from 'app/services/auth0Service';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setUserDataAuth0 } from 'app/auth/store/userSlice';
import { useHistory } from 'react-router';

function Callback(props) {
	const dispatch = useDispatch();

	// Only run this once upon startup
	useEffect(() => {
		dispatch(showMessage({ message: 'Logging in with Auth0' }));
	}, [dispatch]);

	// Store the user data in local state before sending it into redux to avoid
	// calling the effect with handleRedirectCallback() multiple times when the
	// dispatch() function changes. Because the effect that calls
	// handleRedirectCallback() is asynchronous, it might run into issues if the
	// dispatch() function changes while performing the authentication.
	const [user, setUser] = useState(null);

	const history = useHistory();

	useEffect(() => {
		(async () => {
			try {
				// Only try if not already signed in
				if (!await auth0Service.isAuthenticated()) {
					await auth0Service.handleRedirectCallback();
				}

				const userData = await auth0Service.getUserData();
				setUser(userData);
			} catch (ex) {
				dispatch(showMessage({ message: ex.message, variant: 'error' }));
				history.replace('/');
			}
		})();
	}, [setUser, dispatch, history]);

	// Keep the user data up to date in Redux
	useEffect(() => {
		if (user) {
			dispatch(setUserDataAuth0(user));
			dispatch(showMessage({ message: 'Logged in with Auth0' }));
		}
	}, [user, dispatch]);

	return <FuseSplashScreen />;
}

export default Callback;
