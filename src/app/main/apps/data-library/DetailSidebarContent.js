import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedDataSource } from './store/dataSourcesSlice';
import { byteSizeToString, getSourceTypeData } from './dataSourceUtils';

const useStyles = makeStyles({
	table: {
		'& th': {
			padding: '16px 0'
		}
	}
});

function DetailSidebarContent(props) {
	const selectedItem = useSelector(selectSelectedDataSource);

	const classes = useStyles();

	if (!selectedItem) {
		return null;
	}

	const { name: typeName, icon } = getSourceTypeData(selectedItem.type);

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={200}>
			<div className="file-details p-16 sm:p-24">
				<div className="preview h-128 sm:h-256 file-icon flex items-center justify-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className={clsx('text-48')}>{icon}</Icon>
					</FuseAnimate>
				</div>

				<Typography variant="subtitle1" className="py-16">
					Info
				</Typography>

				<table className={clsx(classes.table, 'w-full text-justify')}>
					<tbody>
						<tr className="type">
							<th>Type</th>
							<td>{typeName}</td>
						</tr>

						<tr className="size">
							<th>Size</th>
							<td>
								{selectedItem.size === ''
									? '-'
									: byteSizeToString(selectedItem.size)
								}
							</td>
						</tr>

						<tr className="location">
							<th>Location</th>
							<td>{selectedItem.location}</td>
						</tr>

						<tr className="owner">
							<th>Owner</th>
							<td>{selectedItem.owner}</td>
						</tr>

						<tr className="modified">
							<th>Modified</th>
							<td>{selectedItem.modified}</td>
						</tr>

						<tr className="opened">
							<th>Opened</th>
							<td>{selectedItem.opened}</td>
						</tr>

						<tr className="created">
							<th>Created</th>
							<td>{selectedItem.created}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</FuseAnimate>
	);
}

export default DetailSidebarContent;
