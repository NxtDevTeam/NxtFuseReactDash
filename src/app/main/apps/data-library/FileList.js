import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setSelectedItem,
	selectSelectedItemId,
	selectDataSources,
} from './store/dataSourcesSlice';
import { byteSizeToString, getSourceTypeData } from './dataSourceUtils';

function FileList(props) {
	const dispatch = useDispatch();
	const files = useSelector(selectDataSources);
	const selectedItemId = useSelector(selectSelectedItemId);

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
						<TableCell>Name</TableCell>
						<TableCell className="hidden sm:table-cell">Type</TableCell>
						<TableCell className="hidden sm:table-cell">Owner</TableCell>
						<TableCell className="text-center hidden sm:table-cell">Size</TableCell>
						<TableCell className="hidden sm:table-cell">Modified</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{files.map(item => {
						const { name: typeName, icon } = getSourceTypeData(item.type);

						return (
							<TableRow
								key={item.id}
								hover
								onClick={event => dispatch(setSelectedItem(item.id))}
								selected={item.id === selectedItemId}
								className="cursor-pointer"
							>
								<TableCell className="max-w-64 w-64 p-0 text-center">
									<Icon>{icon}</Icon>
								</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell className="hidden sm:table-cell">{typeName}</TableCell>
								<TableCell className="hidden sm:table-cell">{item.owner}</TableCell>
								<TableCell className="text-center hidden sm:table-cell">
									{item.size === '' ? '-' : byteSizeToString(item.size)}
								</TableCell>
								<TableCell className="hidden sm:table-cell">{item.modified}</TableCell>
								<Hidden lgUp>
									<TableCell>
										<IconButton
											onClick={ev => props.pageLayout.current.toggleRightSidebar()}
											aria-label="open right sidebar"
										>
											<Icon>info</Icon>
										</IconButton>
									</TableCell>
								</Hidden>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</FuseAnimate>
	);
}

export default FileList;
