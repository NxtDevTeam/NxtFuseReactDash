/**
 * Exception wrapper around errors returned from APIs.
 */
export class ApiError extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
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
