import { makeStyles } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import DetailSidebarContent from './DetailSidebarContent';
import DetailSidebarHeader from './DetailSidebarHeader';
import FileList from './FileList';
import MainSidebarContent from './MainSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import reducer from './store';
import { getDataSources } from './store/dataSourcesSlice';
import DataLibraryHeader from './DataLibraryHeader';
import NewDataSourceDialog from './NewDataSourceDialog';

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

	const [newSourceDialogOpen, setNewSourceDialogOpen] = useState(false);

	const openNewSourceDialog = useCallback(
		() => setNewSourceDialogOpen(true),
		[setNewSourceDialogOpen]);

	const closeNewSourceDialog = useCallback(
		() => setNewSourceDialogOpen(false),
		[setNewSourceDialogOpen]);

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
					<DataLibraryHeader
						pageLayout={pageLayout}
						onAddDataSource={openNewSourceDialog}
					/>
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

			<NewDataSourceDialog
				open={newSourceDialogOpen}
				onClose={closeNewSourceDialog}
			/>
		</>
	);
}

export default withReducer('dataLibrary', reducer)(DataLibraryApp);
