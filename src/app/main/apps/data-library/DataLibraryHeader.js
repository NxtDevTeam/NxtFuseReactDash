import React from 'react';
import Breadcrumb from './Breadcrumb';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FuseAnimate from '@fuse/core/FuseAnimate';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import {
	openNewSourceDialog,
	selectDataSources,
	selectSelectedDataSource,
} from './store/dataSourcesSlice';
import DataUsageTreemapGraph from './DataUsageTreemapGraph';
import DataSourceGrid from './DataSourceGrid';

function DataLibraryHeader({ pageLayout }) {
	const dispatch = useDispatch();

	const handleOpenAddDialog = () => dispatch(openNewSourceDialog());

	const dataSources = useSelector(selectDataSources);
	const selectedItem = useSelector(selectSelectedDataSource);

	return (
		<div className="flex flex-col flex-1 p-8 sm:p-12 relative">
			<div
				className={clsx(
					"flex flex-col items-stretch justify-between",
					"xl:flex-row xl:items-start",
				)}
			>
				<IconButton
					className="self-start"
					onClick={ev => {
						pageLayout.current.toggleLeftSidebar();
					}}
					aria-label="open left sidebar"
				>
					<Icon>menu</Icon>
				</IconButton>

				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<DataSourceGrid className="p-8" dataSources={dataSources} />
				</FuseAnimate>

				<FuseAnimate animation="transition.expandIn" delay={300}>
					<DataUsageTreemapGraph className="px-8" data={dataSources} />
				</FuseAnimate>
			</div>

			<div className="flex flex-1 items-end">
				<FuseAnimate animation="transition.expandIn" delay={600}>
					<Fab
						color="secondary"
						aria-label="add"
						className="absolute bottom-0 ltr:left-0 rtl:right-0 mx-16 -mb-28 z-999"
						onClick={handleOpenAddDialog}
					>
						<Icon>add</Icon>
					</Fab>
				</FuseAnimate>
				<FuseAnimate delay={200}>
					<div>
						{selectedItem && (
							<Breadcrumb
								selected={selectedItem}
								className="flex flex-1 ltr:pl-72 rtl:pr-72 pb-12 text-16 sm:text-24"
							/>
						)}
					</div>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default DataLibraryHeader;
