/**
 * Wrapper on the calendar backend API.
 */

export function buildCalendarId(type, id) {
	return `${type}:${id}`;
}

/**
 * Parse event ID to extract the calendar type.
 *
 * @return {'user'|'team'|'organization'}
 */
export function getCalendarType(eventId) {
	for (let type of ['user', 'team', 'organization']) {
		if (eventId.startsWith(type + ':')) {
			return type;
		}
	}
}

export default class CalendarApi {
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
	 * Fetch user calendar events.
	 *
	 * @param {Boolean} query.full Whether to include events from the user's
	 * organization and team (defaults to `true`)
	 * @param {Date} query.before Start of the range of events to request.
	 * @param {Date} query.after End of the range of events to request. Must not
	 * be before `query.before` if provided.
	 */
	getUserCalendar(userId, query = {}) {
		return this.api.makeRequest({
			url: `/users/${userId}/calendar`,
			params: query,
		});
	}

	updateEvent(eventId, update) {
		return this.api.makeRequest({
			method: 'put',
			url: `/calendar/${eventId}`,
			data: update,
		});
	}

	createEvent(data) {
		return this.api.makeRequest({
			method: 'post',
			url: `/calendar`,
			data,
		});
	}

	deleteEvent(eventId) {
		return this.api.makeRequest({
			method: 'delete',
			url: `/calendar/${eventId}`,
		});
	}
}

export class InvalidEventId extends Error {
	constructor(eventId, message) {
		super(message);
		this.eventId = eventId;
	}
}
