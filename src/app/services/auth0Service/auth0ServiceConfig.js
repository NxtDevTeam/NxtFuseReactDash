const AUTH_CONFIG = {
	domain: process.env.REACT_APP_AUTH0_DOMAIN,
	clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
	callbackUrl: `${window.location.origin}/callback`
};

export default AUTH_CONFIG;
