import Button from '@material-ui/core/Button';
import auth0Service from 'app/services/auth0Service';
import React from 'react';

async function login() {
	const queryParams = new URLSearchParams(window.location.search);
	const orgId = queryParams.get('organization_id');
	await auth0Service.login(orgId);
}

function Auth0LoginTab() {
	return (
		<div className="w-full">
			<Button className="w-full my-48" color="primary" variant="contained" onClick={login}>
				Login/Register
			</Button>
		</div>
	);
}

export default Auth0LoginTab;
