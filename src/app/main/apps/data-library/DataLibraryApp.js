import { makeStyles } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import DetailSidebarContent from './DetailSidebarContent';
import DetailSidebarHeader from './DetailSidebarHeader';
import FileList from './FileList';
import MainSidebarContent from './MainSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import reducer from './store';
import { getDataSources } from './store/dataSourcesSlice';
import DataLibraryHeader from './DataLibraryHeader';

const useStyles = makeStyles({
	header: {
		// Override the height settings from FusePageSimple to allow the header to
		// grow larger
		height: 'auto !important',
		minHeight: 'auto !important',
	}
});

function DataLibraryApp() {
	const dispatch = useDispatch();

	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(getDataSources());
	}, [dispatch]);

	const classes = useStyles();

	return (
		<FusePageSimple
			classes={{
				root: 'bg-red',
				header: classes.header,
				sidebarHeader: 'min-h-96 sm:min-h-160',
				rightSidebar: 'w-320'
			}}
			header={<DataLibraryHeader pageLayout={pageLayout} />}
			content={<FileList pageLayout={pageLayout} />}
			leftSidebarVariant="temporary"
			leftSidebarHeader={<MainSidebarHeader />}
			leftSidebarContent={<MainSidebarContent />}
			rightSidebarHeader={<DetailSidebarHeader />}
			rightSidebarContent={<DetailSidebarContent />}
			ref={pageLayout}
			innerScroll
		/>
	);
}

export default withReducer('dataLibrary', reducer)(DataLibraryApp);
