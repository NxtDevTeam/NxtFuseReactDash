/**
 * Authorization Roles
 */
const authRoles = {
	globalAdmin: ['GlobalAdmin'],
	orgAdmin: ['OrganizationAdmin'],
	user: ['GlobalAdmin', 'OrganizationAdmin', 'Member'],
	onlyGuest: []
};

export default authRoles;
