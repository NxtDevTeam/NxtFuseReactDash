import globalAxios from 'axios';

import { ApiError, InvalidApiRequest, NoApiResponse } from './errors';

/**
 * Abstract class for making an API wrapper.
 */
export default class ApiWrapper {
	/**
	 * Construct an API client.
	 *
	 * @param {string} accessToken Auth0 access token for the API.
	 * @param {string?} baseUrl Base URL of the API. If not provided, full URLs
	 * will have to be passed to `makeRequest`.
	 */
	constructor(accessToken, baseUrl) {
		this.axios = globalAxios.create({
			baseURL: baseUrl,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
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
			throw new ApiError(error.response.data);
		} else if (error.request) {
			// No response was received
			throw new NoApiResponse(error.message);
		} else {
			// Issue in building the request
			throw new InvalidApiRequest(error.message);
		}
	}
}
