import { Button, Typography } from '@material-ui/core';
import auth0Service from 'app/services/auth0Service';
import React from 'react';

async function login() {
	await auth0Service.login();
}

function Auth0LoginTab() {
	return (
		<div className="flex flex-col items-center justify-center my-48 w-full">
			<Typography>
				Existing user?
			</Typography>

			<Button
				className="w-full"
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
