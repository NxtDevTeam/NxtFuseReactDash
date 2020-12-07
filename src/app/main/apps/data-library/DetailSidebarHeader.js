import FuseAnimate from '@fuse/core/FuseAnimate';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Icon,
	IconButton,
	Typography,
} from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDataSource, openEditSourceDialog, selectSelectedDataSource } from './store/dataSourcesSlice';

function DetailSidebarHeader(props) {
	const dispatch = useDispatch();

	const selectedItem = useSelector(selectSelectedDataSource);
	const itemId = selectedItem?.id;

	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

	const openDeleteConfirm = () => setDeleteConfirmOpen(true);
	const closeDeleteConfirm = () => setDeleteConfirmOpen(false);

	const handleDelete = useCallback(() => {
		dispatch(deleteDataSource(itemId));
		closeDeleteConfirm();
	}, [itemId, dispatch]);

	const openEditDialog = () => {
		dispatch(openEditSourceDialog(itemId));
	};

	if (!selectedItem) {
		return null;
	}

	return (
		<div className="flex flex-col justify-between h-full p-4 sm:p-12">
			<div className="toolbar flex align-center justify-end">
				<FuseAnimate animation="transition.expandIn" delay={200}>
					<IconButton onClick={openDeleteConfirm}>
						<Icon>delete</Icon>
					</IconButton>
				</FuseAnimate>
				<FuseAnimate animation="transition.expandIn" delay={200}>
					<IconButton onClick={openEditDialog}>
						<Icon>edit</Icon>
					</IconButton>
				</FuseAnimate>
			</div>

			<div className="p-12">
				<FuseAnimate delay={200}>
					<Typography variant="subtitle1" className="mb-8">
						{selectedItem.name}
					</Typography>
				</FuseAnimate>
				<FuseAnimate delay={300}>
					<Typography variant="caption" className="">
						<span>Edited</span>
						<span>: {selectedItem.modified}</span>
					</Typography>
				</FuseAnimate>
			</div>

			<Dialog open={deleteConfirmOpen} onClose={closeDeleteConfirm}>
				<DialogTitle>Delete data source?</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the data source {selectedItem.name}?
					</Typography>
					<Typography>
						This operation cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteConfirm}>Cancel</Button>
					<Button onClick={handleDelete}>Delete</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default DetailSidebarHeader;
