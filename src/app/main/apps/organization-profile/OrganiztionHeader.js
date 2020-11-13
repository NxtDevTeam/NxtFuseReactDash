import React from 'react';
import { Business } from '@material-ui/icons';
import {
	makeStyles,
	Avatar,
	Typography,
} from '@material-ui/core';
import FuseAnimate from '@fuse/core/FuseAnimate';

const useStyles = makeStyles(theme => ({
	orgLogo: {
		width: 72,
		height: 72,
	},
}));

function OrgLogoOrDefault({ picture, name }) {
	const classes = useStyles();

	if (picture) {
		return (
			<Avatar
				className={classes.orgLogo}
				alt={name}
				src={picture}
			/>
		);
	} else {
		return (
			<Business className={classes.orgLogo} />
		);
	}
}

function OrganizationHeader(props) {
	return (
		<div className="flex flex-col flex-shrink-0 items-start justify-between p-4 sm:p-24">
			<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<OrgLogoOrDefault
						name={props.organization.name}
						picture={props.organization.picture}
					/>
				</FuseAnimate>
				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography variant="h6" className="mx-12 hidden sm:flex">
						{props.organization.name}
					</Typography>
				</FuseAnimate>
			</div>
			<Typography>
				{props.organization.description}
			</Typography>
		</div>
	);
}

export default OrganizationHeader;
