import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import DetailSidebarContent from './DetailSidebarContent';
import DetailSidebarHeader from './DetailSidebarHeader';
import FileList from './FileList';
import MainSidebarContent from './MainSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import reducer from './store';
import {
	closeDialog,
	createDataSource,
	getDataSources,
	selectDialogState,
	updateDataSource,
} from './store/dataSourcesSlice';
import DataLibraryHeader from './DataLibraryHeader';
import DataSourceEditDialog from './DataSourceEditDialog';

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

	const {
		open: dialogOpen,
		initialValue: initialDialogValue,
	} = useSelector(selectDialogState);

	const handleCloseDialog = useCallback(
		() => dispatch(closeDialog()),
		[dispatch]);

	const handleDialogSave = useCallback((data) => {
		if (initialDialogValue) {
			dispatch(updateDataSource({
				id: initialDialogValue.id,
				data,
			}));
		} else {
			dispatch(createDataSource(data));
		}
	}, [initialDialogValue, dispatch]);

	const classes = useStyles();

	return (
		<>
			<FusePageSimple
				classes={{
					root: 'bg-red',
					header: classes.header,
					sidebarHeader: 'min-h-96 sm:min-h-160',
					rightSidebar: 'w-320'
				}}
				header={
					<DataLibraryHeader pageLayout={pageLayout} />
				}
				content={<FileList pageLayout={pageLayout} />}
				leftSidebarVariant="temporary"
				leftSidebarHeader={<MainSidebarHeader />}
				leftSidebarContent={<MainSidebarContent />}
				rightSidebarHeader={<DetailSidebarHeader />}
				rightSidebarContent={<DetailSidebarContent />}
				ref={pageLayout}
				innerScroll
			/>

			<DataSourceEditDialog
				open={dialogOpen}
				onClose={handleCloseDialog}
				initialValue={initialDialogValue}
				onSave={handleDialogSave}
			/>
		</>
	);
}

export default withReducer('dataLibrary', reducer)(DataLibraryApp);
