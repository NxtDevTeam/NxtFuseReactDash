/**
 * Wrapper on the backend API for generating Jitsi tokens.
 */

export default class JitsiTokenApi {
	/**
	 * Constructs the wrapper from the base backend API wrapper.
	 *
	 * @param {NxtCoreApi} api API wrapper instance (which abstracts the base
	 * URL and authentication).
	 */
	constructor(api) {
		this.api = api;
	}

	/**
	 * Generate a new Jitsi JWT for meeting access.
	 *
	 * The returned token is based off the Auth0 token used for normal
	 * authentication.
	 */
	getJitsiToken() {
		return this.api.makeRequest({ url: `/conferences/token` });
	}
}
