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

/**
 * Builds an invitation link URI (excludes the origin)
 */
export function buildInvitePath(orgId, orgName = '') {
	const queryParams = new URLSearchParams({
		organization_id: orgId,
		organization_name: orgName,
	});

	return `/register?${queryParams}`;
}

/**
 * Builds a full invitiation link URL for external use (includes the origin)
 */
export function buildInviteLink(orgId, orgName = '') {
	return `${window.location.origin}${buildInvitePath(orgId, orgName)}`;
}

function InviteDialog({ open, onClose, orgId, orgName }) {
	const inviteLink = buildInviteLink(orgId, orgName);

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
