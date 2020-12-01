/**
 * @file Wrapper around NxtAI REST API to handle errors and authentication.
 */

import globalAxios from 'axios';

import CalendarApi from './CalendarApi';

export * from './CalendarApi';

/**
 * NxtAI backend API client.
 */
export default class NxtBackendApi {
	/**
	 * Construct an API client.
	 *
	 * @param {string} accessToken Auth0 access token for the API.
	 * @param {string?} baseUrl Base URL of the API. If not provided, a default
	 * will be taken from the environment variable REACT_APP_NXT_API_BASE_URL.
	 */
	constructor(accessToken, baseUrl) {
		baseUrl = baseUrl || process.env.REACT_APP_NXT_API_BASE_URL;
		this.axios = globalAxios.create({
			baseURL: baseUrl,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	get calendar() {
		// TODO Store this as a field? Lazily evaluate?
		return new CalendarApi(this);
	}

	/**
	 * Make a request and handle errors.
	 *
	 * @param {object} config axios request config.
	 */
	async makeRequest(config) {
		try {
			const response = await this.axios(config);
			return response.data;
		} catch (error) {
			this.handleApiError(error);
		}
	}

	/**
	 * Extract and rethrow an API error from an axios error object.
	 *
	 * @param {any} error axios error object.
	 */
	handleApiError(error) {
		if (error.response) {
			throw error.response.data;
		} else if (error.request) {
			// No response was received
			throw new NoApiResponse(error.message);
		} else {
			// Issue in building the request
			throw new InvalidApiRequest(error.message);
		}
	}

	getAllUsers() {
		return this.makeRequest({ url: '/users' });
	}

	getUser(userId) {
		return this.makeRequest({ url: `/users/${userId}` });
	}

	updateUser(userId, data) {
		return this.makeRequest({ method: 'put', url: `/users/${userId}`, data });
	}

	getAllOrganizations() {
		return this.makeRequest({ url: '/organizations' });
	}

	getOrganization(orgId) {
		return this.makeRequest({ url: `/organizations/${orgId}` });
	}

	updateOrganization(orgId, data) {
		return this.makeRequest({
			method: 'put',
			url: `/organizations/${orgId}`,
			data,
		});
	}

	createOrganization(data) {
		return this.makeRequest({
			method: 'post',
			url: `/organizations`,
			data,
		});
	}

	deleteOrganization(orgId) {
		return this.makeRequest({
			method: 'delete',
			url: `/organizations/${orgId}`,
		});
	}

	getOrganizationMembers(orgId) {
		return this.makeRequest({ url: `/organizations/${orgId}/members` });
	}

	addOrganizationAdmin(orgId, userId) {
		return this.makeRequest({
			method: 'post',
			url: `/organizations/${orgId}/admins`,
			data: {
				id: userId,
			},
		});
	}

	removeOrganizationAdmin(orgId, userId) {
		return this.makeRequest({
			method: 'delete',
			url: `/organizations/${orgId}/admins/${userId}`,
		});
	}

	getAllTeams(orgId) {
		return this.makeRequest({ url: `/organizations/${orgId}/teams` });
	}

	getTeam(orgId, teamId) {
		return this.makeRequest({ url: `/organizations/${orgId}/teams/${teamId}` });
	}

	updateTeam(orgId, teamId, data) {
		return this.makeRequest({
			method: 'put',
			url: `/organizations/${orgId}/teams/${teamId}`,
			data,
		});
	}

	createTeam(orgId, data) {
		return this.makeRequest({
			method: 'post',
			url: `/organizations/${orgId}/teams`,
			data,
		});
	}

	deleteTeam(orgId, teamId) {
		return this.makeRequest({
			method: 'delete',
			url: `/organizations/${orgId}/teams/${teamId}`,
		});
	}

	getTeamMembers(orgId, teamId) {
		return this.makeRequest({
			url: `/organizations/${orgId}/teams/${teamId}/members`,
		});
	}

	getAllDataSources(orgId) {
		return this.makeRequest({ url: `/organizations/${orgId}/data-sources` });
	}

	getDataSource(orgId, sourceId) {
		return this.makeRequest({
			url: `/organizations/${orgId}/data-sources/${sourceId}`,
		});
	}

	updateDataSource(orgId, sourceId, data) {
		return this.makeRequest({
			method: 'put',
			url: `/organizations/${orgId}/data-sources/${sourceId}`,
			data,
		});
	}

	createDataSource(orgId, data) {
		return this.makeRequest({
			method: 'post',
			url: `/organizations/${orgId}/data-sources`,
			data,
		});
	}

	deleteDataSource(orgId, sourceId) {
		return this.makeRequest({
			method: 'delete',
			url: `/organizations/${orgId}/data-sources/${sourceId}`,
		});
	}
}

/**
 * Error when building the API request.
 */
export class InvalidApiRequest extends Error { }

/**
 * API did not respond back after request (so the API is inaccessible or down).
 */
export class NoApiResponse extends Error { }
