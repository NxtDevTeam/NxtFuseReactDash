import { Management } from 'auth0-js';
import createAuth0Client from '@auth0/auth0-spa-js';
import AUTH_CONFIG from './auth0ServiceConfig';

class Auth0Service {
	constructor() {
		if (Object.entries(AUTH_CONFIG).length === 0 && AUTH_CONFIG.constructor === Object) {
			const message = 'Missing Auth0 configuration at src/app/services/auth0Service/auth0ServiceConfig.js';
			if (process.env.NODE_ENV === 'development') {
				console.warn(message);
			}
			throw new Error(message);
		}

		// Store the promise so that the client initialization can start immediately
		// without blocking. All methods using it have to `await` first, but since
		// there is a single object, the promise acts like a lazy evaluator.
		this.auth0ClientPromise = createAuth0Client({
			domain: AUTH_CONFIG.domain,
			client_id: AUTH_CONFIG.clientId,
			redirect_uri: AUTH_CONFIG.callbackUrl,
		});
	}

	async getClient() {
		return await this.auth0ClientPromise;
	}

	async login(orgId) {
		const auth0 = await this.getClient();
		let url = await auth0.buildAuthorizeUrl();
		// Append organization ID if provided
		if (orgId) {
			url = url + `&organization_id=${orgId}`;
		}

		window.location.assign(url);
	};

	async handleRedirectCallback() {
		const auth0 = await this.getClient();
		await auth0.handleRedirectCallback();
	}

	async logout() {
		const auth0 = await this.getClient();
		auth0.logout({ returnTo: window.location.origin });
	};

	async isAuthenticated() {
		const auth0 = await this.getClient();
		return await auth0.isAuthenticated();
	}

	async getUserData() {
		// Use data is all returned in the ID token
		const auth0 = await this.getClient();
		return await auth0.getIdTokenClaims();
	};

	async updateUserData(userMetadata) {
		const idToken = await this.getUserData();
		const managementClient = new Management({
			domain: AUTH_CONFIG.domain,
			token: idToken,
		});

		await managementClient.updateUserMetadata(
			{ id: idToken.sub_jwk }, userMetadata);
	};

	async getApiToken(options) {
		const auth0 = await this.getClient();
		return await auth0.getTokenSilently(options);
	}

	async getManagementToken() {
		return await this.getApiToken();
	}

	async getNxtBackendToken() {
		return await this.getApiToken({
			audience: AUTH_CONFIG.nxtApiAudience,
		});
	}

	extractUserMetadata(tokenData) {
		return tokenData[AUTH_CONFIG.idTokenNamespace + 'user_metadata'] || {};
	}

	extractAppMetadata(tokenData) {
		return tokenData[AUTH_CONFIG.idTokenNamespace + 'app_metadata'] || {};
	}

	extractRoles(tokenData) {
		return tokenData[AUTH_CONFIG.idTokenNamespace + 'roles'] || [];
	}
}

const instance = new Auth0Service();

export default instance;
