import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { InvertColors } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import FuseSidePanel from '@fuse/core/FuseSidePanel';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSettings } from 'app/auth/store/userSlice';
import { setDefaultSettings } from 'app/store/fuse/settingsSlice';

const useStyles = makeStyles({
	content: {
		height: '100%',
	},
});

function ThemeInvertButton() {
	const dispatch = useDispatch();

	const user = useSelector(({ auth }) => auth.user);
	const currentSettings = useSelector(({ fuse }) => fuse.settings.current);
	const currentTheme = currentSettings.theme.main;
	const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

	function handleChangeTheme() {
		const newSettings = {
			...currentSettings,
			theme: {
				main: newTheme,
				navbar: newTheme,
				toolbar: newTheme,
				footer: newTheme,
			},
		};

		if (user.role === 'guest') {
			dispatch(setDefaultSettings(newSettings));
		} else {
			dispatch(updateUserSettings(newSettings));
		}
	}

	return (
		<Tooltip title={`Switch to ${newTheme} theme`} placement="left">
			<IconButton className="w-40 h-40 p-0" onClick={handleChangeTheme}>
				<InvertColors />
			</IconButton>
		</Tooltip>
	);
}

function LeftSideLayout() {
	const classes = useStyles();

	return (
		<>
			<FuseSidePanel>
				<div className={clsx(
					'flex', 'flex-col', 'items-center', classes.content,
				)}>
					<FuseShortcuts className="py-16 px-8" variant="vertical" />

					<div className={clsx(
						'flex',
						'flex-1',
						'flex-col',
						'items-center',
						'justify-end',
					)}>
						<ThemeInvertButton />
					</div>
				</div>
			</FuseSidePanel>
		</>
	);
}

export default React.memo(LeftSideLayout);
