import React from 'react';
import {
	AppBar,
	Card,
	CardContent,
	Toolbar,
	Typography,
} from '@material-ui/core';

function OrganizationOverview(props) {
	const description = props.organization.description;

	return (
		<Card className="w-full mb-16 rounded-8">
			<AppBar position="static" elevation={0}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Overview
				</Typography>
				</Toolbar>
			</AppBar>

			<CardContent>
				<div className="mb-24">
					<Typography>{description}</Typography>
				</div>

				{/* <div className="mb-24">
					<Typography className="font-bold mb-4 text-15">Birthday</Typography>
					<Typography>{general.birthday}</Typography>
				</div> */}
			</CardContent>
		</Card>
	);
}

export default OrganizationOverview;
