import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';

const useStyles = makeStyles((theme) => ({
	header: {
		background: `linear-gradient(
			to left,
			${theme.palette.primary.main} 0%,
			${theme.palette.background.default} 100%)
		`,
		color: theme.palette.primary.contrastText,
		backgroundSize: 'cover',
		backgroundColor: theme.palette.background.default
	}
}));

// Inner header component so that the useStyles can reference the contrast
// theme instead of the outer theme
function InnerHeader(props) {
	const classes = useStyles();
	return <div className={classes.header}>{props.header}</div>;
}

function FusePageSimpleHeader(props) {
	const theme = useTheme();
	const contrastTheme = useSelector(
		selectContrastMainTheme(theme.palette.background.default));

	return (
		<ThemeProvider theme={contrastTheme}>
			<InnerHeader {...props} />
		</ThemeProvider>
	);
}

export default FusePageSimpleHeader;
