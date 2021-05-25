import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		'& .logo-icon': {
			height: 32,
			transition: theme.transitions.create(['width', 'height'], {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		},
		'& .logo-text': {
			transition: theme.transitions.create('opacity', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		}
	},
}));

export function Logo({ className }) {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex items-center', className)}>
			<img className="logo-icon" src="assets/images/logos/skycomm-logo.svg" alt="logo" />
		</div>
	);
}

export function Tagline({ className }) {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex items-center', className)}>
			<img className="logo-icon" src="assets/images/logos/skycomm-tagline.svg" alt="tagline" />
		</div>
	);
}

export function IconLogo({ className }) {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex items-center', className)}>
			<img className="logo-icon" src="assets/images/logos/skycomm-icon.svg" alt="icon" />
		</div>
	);
}
