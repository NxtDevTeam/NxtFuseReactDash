import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@material-ui/core';
import { showMessage } from 'app/store/fuse/messageSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

function InviteDialog({ open, onClose, orgId, orgName }) {
	const queryParams = new URLSearchParams({
		organization_id: orgId,
		organization_name: orgName,
	});
	const inviteLink = `${window.location.origin}/register?${queryParams}`

	const dispatch = useDispatch();

	async function handleLinkCopy() {
		try {
			await navigator.clipboard.writeText(inviteLink);
			dispatch(showMessage({ message: 'Link copied' }));
		} catch {
			dispatch(showMessage({
				message: 'Could not copy link',
				variant: 'error',
			}));
		}
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<DialogTitle>Invite Members</DialogTitle>

			<DialogContent>
				<DialogContentText>
					Share this link with those who you want to join your organization.
				</DialogContentText>
				<div className="flex items-center">
					<TextField
						className="flex-1 px-8"
						variant="outlined"
						value={inviteLink}
						onChange={
							// No-op on change so that it isn't editable but still selectable
							// inside (unlike when properly disabled)
							() => { }
						}
					/>

					<Button
						className="px-8"
						variant="contained"
						color="primary"
						onClick={handleLinkCopy}
					>
						Copy</Button>
				</div>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Done</Button>
			</DialogActions>
		</Dialog>
	);
}

export default InviteDialog;
