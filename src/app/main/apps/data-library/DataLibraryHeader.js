import React from 'react';
import Breadcrumb from './Breadcrumb';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useSelector } from 'react-redux';
import {
	selectDataSources,
	selectSelectedDataSource,
} from './store/dataSourcesSlice';
import DataUsageTreemapGraph from './DataUsageTreemapGraph';

function DataLibraryHeader({ pageLayout }) {
	const dataSources = useSelector(selectDataSources);
	const selectedItem = useSelector(selectSelectedDataSource);

	return (
		<div className="flex flex-col flex-1 p-8 sm:p-12 relative">
			<div className="flex items-start justify-between">
				<IconButton
					onClick={ev => {
						pageLayout.current.toggleLeftSidebar();
					}}
					aria-label="open left sidebar"
				>
					<Icon>menu</Icon>
				</IconButton>
				{/* <FuseAnimate animation="transition.expandIn" delay={200}>
					<IconButton aria-label="search">
						<Icon>search</Icon>
					</IconButton>
				</FuseAnimate> */}

				<DataUsageTreemapGraph data={dataSources} />
			</div>

			<div className="flex flex-1 items-end">
				<FuseAnimate animation="transition.expandIn" delay={600}>
					<Fab
						color="secondary"
						aria-label="add"
						className="absolute bottom-0 ltr:left-0 rtl:right-0 mx-16 -mb-28 z-999"
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
