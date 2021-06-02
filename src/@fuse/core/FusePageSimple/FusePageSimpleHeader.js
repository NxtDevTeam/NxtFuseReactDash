import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { selectHeaderTheme } from 'app/store/fuse/settingsSlice';

const useStyles = makeStyles((theme) => ({
	header: {
		color: theme.palette.primary.contrastText,
		backgroundSize: 'cover',
		backgroundColor: theme.palette.background.paper,
	}
}));

// Inner header component so that the useStyles can reference the contrast
// theme instead of the outer theme
function InnerHeader(props) {
	const classes = useStyles();
	return <div className={classes.header}>{props.header}</div>;
}

function FusePageSimpleHeader(props) {
	const contrastTheme = useSelector(selectHeaderTheme);

	return (
		<ThemeProvider theme={contrastTheme}>
			<InnerHeader {...props} />
		</ThemeProvider>
	);
}

export default FusePageSimpleHeader;
