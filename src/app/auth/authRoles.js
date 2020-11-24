/**
 * Authorization Roles
 */
const authRoles = {
	globalAdmin: ['GlobalAdmin'],
	orgAdmin: ['GlobalAdmin', 'OrganizationAdmin'],
	user: ['GlobalAdmin', 'OrganizationAdmin', 'Member'],
	onlyGuest: []
};

export default authRoles;
