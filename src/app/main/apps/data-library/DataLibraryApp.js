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
import { getFiles } from './store/filesSlice';
import DataLibraryHeader from './DataLibraryHeader';

const dataSources = [
	{
		type: 'PHP/SQL',
		name: 'SQL_12345_ZXY',
		size: 1.2,
	},
	{
		type: 'PHP/SQL',
		name: 'SQL_54321_ZYX',
		size: 1.0,
	},
	{
		type: 'MongoDB',
		name: 'DB_JASPE6',
		size: 0.7,
	},
	{
		type: 'MongoDB',
		name: 'DB_JASPE7',
		size: 0.4,
	},
	{
		type: 'MongoDB',
		name: 'DB_JASPE8',
		size: 0.11,
	},
	{
		type: 'MongoDB',
		name: 'DB_JASPE9',
		size: 0.2,
	},
	{
		type: 'MySQL',
		name: 'DB_JASPE3',
		size: 0.2,
	},
	{
		type: 'MySQL',
		name: 'DB_JASPE4',
		size: 1.0,
	},
	{
		type: 'REST API',
		name: 'REST_12QA',
		size: 0.12,
	},
	{
		type: 'REST API',
		name: 'REST_98WD',
		size: 0.25,
	},
	{
		type: 'Local',
		name: 'LOCAL_DB_781',
		size: 0.08,
	},
];

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
		dispatch(getFiles());
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
			header={<DataLibraryHeader data={dataSources} pageLayout={pageLayout} />}
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
