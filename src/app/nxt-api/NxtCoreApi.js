import ApiWrapper from './ApiWrapper';
import CalendarApi from './CalendarApi';
import MarketplaceApi from './MarketplaceApi';

export default class NxtCoreApi extends ApiWrapper {
	constructor(accessToken, baseUrl) {
		baseUrl = baseUrl || process.env.REACT_APP_NXT_API_BASE_URL;
		super(accessToken, baseUrl);
	}

	get calendar() {
		return new CalendarApi(this);
	}

	get marketplace() {
		return new MarketplaceApi(this);
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

	/**
	 * Like createOrganization(), but does not reuqire admin permissions and
	 * can only create un-paid organizations.
	 */
	registerOrganization(data) {
		return this.makeRequest({
			method: 'post',
			url: '/organization-registrations',
			data,
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
