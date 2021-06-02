import { ThemeProvider } from '@material-ui/core/styles';
import { selectHeaderTheme } from 'app/store/fuse/settingsSlice';
import React from 'react';
import { useSelector } from 'react-redux';

function FusePageCardedHeader(props) {
	const contrastTheme = useSelector(selectHeaderTheme);

	return (
		<div className={props.classes.header}>
			{props.header && <ThemeProvider theme={contrastTheme}>{props.header}</ThemeProvider>}
		</div>
	);
}

export default FusePageCardedHeader;
