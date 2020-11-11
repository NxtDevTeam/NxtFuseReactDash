const AUTH_CONFIG = {
	domain: process.env.REACT_APP_AUTH0_DOMAIN,
	clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
	callbackUrl: `${window.location.origin}/callback`,

	idTokenNamespace: process.env.REACT_APP_AUTH0_ID_TOKEN_NAMESPACE,
};

export default AUTH_CONFIG;
