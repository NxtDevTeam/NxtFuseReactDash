import Button from '@material-ui/core/Button';
import auth0Service from 'app/services/auth0Service';
import React from 'react';

async function login() {
	await auth0Service.login();
}

function Auth0LoginTab() {
	return (
		<div className="w-full">
			<Button
				className="w-full my-48"
				color="primary"
				variant="contained"
				onClick={login}
			>
				Login
			</Button>
		</div>
	);
}

export default Auth0LoginTab;
