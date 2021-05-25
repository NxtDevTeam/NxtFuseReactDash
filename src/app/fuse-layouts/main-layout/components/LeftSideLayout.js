import React from 'react';
import { Icon, IconButton, Tooltip } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import FuseSidePanel from '@fuse/core/FuseSidePanel';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectNavbarTheme } from 'app/store/fuse/settingsSlice';
import { selectFlatNavigation } from 'app/store/fuse/navigationSlice';
import { IconLogo } from 'app/fuse-layouts/shared-components/Logo';

const useStyles = makeStyles((theme) => ({
	logoBox: {
		background: theme.palette.primary.dark,
	}
}));

function LeftSideLayout() {
	const classes = useStyles();

	const navbarTheme = useSelector(selectNavbarTheme);

	const navigationItems = useSelector(selectFlatNavigation);

	return (
		<>
			<ThemeProvider theme={navbarTheme}>
				<FuseSidePanel>
					<div className={clsx(classes.logoBox, "flex items-center justify-center h-64")}>
						<IconLogo />
					</div>
					<div className="flex flex-col items-center py-16 px-8">

						{navigationItems.map(
							item =>
								item && (
									<Link to={item.url} key={item.id} role="button">
										<Tooltip title={item.title} placement="left">
											<IconButton className="w-40 h-40 p-0">
												{item.icon ? (
													<Icon>{item.icon}</Icon>
												) : (
													<span className="text-20 font-bold uppercase">{item.title[0]}</span>
												)}
											</IconButton>
										</Tooltip>
									</Link>
								)
						)}

					</div>
				</FuseSidePanel>
			</ThemeProvider>
		</>
	);
}

export default React.memo(LeftSideLayout);
