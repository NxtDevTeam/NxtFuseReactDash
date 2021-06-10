import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { NxtCoreApi } from 'app/nxt-api';
import auth0Service from 'app/services/auth0Service';

function VideoConfernceApp() {
	// TODO Should this direct to a plain vidoe conference page (without the
	// navigation bars, etc.) for non-authenticated users?

	const history = useHistory();
	const { conferenceId } = useParams();

	const [jitsiToken, setJitsiToken] = useState(undefined);

	// Effect to pull in the jitsi JWT token on mount
	useEffect(() => {
		(async () => {
			try {
				const accessToken = await auth0Service.getApiToken();
				const { jwt } = await new NxtCoreApi(accessToken).jitsi.getJitsiToken();
				setJitsiToken(jwt);
			} catch (e) {
				// null indicates no token available
				setJitsiToken(null);
			}
		})();
	}, [setJitsiToken]);

	const jitsiParentRef = useRef();
	const jitsiApiRef = useRef();

	// Once the jitsi JWT token is either acquired or user is not logged in,
	// initialize the jitsi Api controller to create the iframe with the meeting
	useEffect(() => {
		if (jitsiToken !== undefined) {
			// Store in a separate variable in case the ref gets overridden before
			// cleanup
			// TODO This may not be necessary, but might as well be safe
			const jitsiApi = new window.JitsiMeetExternalAPI(
				process.env.REACT_APP_JITSI_ORIGIN,
				{
					roomName: conferenceId,
					parentNode: jitsiParentRef.current,
					jwt: jitsiToken !== null ? jitsiToken : undefined,
				}
			);
			jitsiApiRef.current = jitsiApi;

			// Redirect back to video admin page when done
			// Only done if logged in (since the page won't work for guests anyway)
			if (jitsiToken !== null) {
				jitsiApi.addEventListener('readyToClose', () => {
					history.push('/apps/video-conference');
				});
			}

			return () => {
				jitsiApi.dispose();
				if (jitsiApiRef === jitsiApi) {
					jitsiApiRef.current = null;
				}
			};
		}
	}, [jitsiToken, conferenceId, history]);

	return (
		<div className="w-full h-full" ref={jitsiParentRef}></div>
	);
}

export default VideoConfernceApp;
