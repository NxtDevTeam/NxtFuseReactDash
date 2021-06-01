import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
} from '@material-ui/core';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse/core/formsy';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import clsx from 'clsx';
import React, { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NxtCoreApi } from 'app/nxt-api';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useHistory } from 'react-router';
import { buildInvitePath } from '../apps/organization-profile/InviteDialog';

function phoneNumberValidator(_values, value) {
	return isPossiblePhoneNumber(value || '', 'US');
}

const useStyles = makeStyles({
	column: {
		marginLeft: 8,
		marginRight: 8,
	},
	formInput: {
		marginTop: 8,
		marginBottom: 16,
	},
});

function RegisterOrgDialog({ open, onClose }) {
	const classes = useStyles();

	const dispatch = useDispatch();

	const history = useHistory();

	const [submitEnabled, setSubmitEnabled] = useState(false);

	const enableSubmit = useCallback(
		() => setSubmitEnabled(true),
		[setSubmitEnabled]);

	const disableSubmit = useCallback(
		() => setSubmitEnabled(false),
		[setSubmitEnabled]);

	const [submitting, setSubmitting] = useState(false);

	// Since the button is in the <DialogActions> container, it cannot be inside
	// the <Formsy> wrapper, so we need a ref to the formsy instance in order to
	// pull the data from it
	const formRef = useRef(null);

	async function handleSubmit() {
		// Set this flag so that submits while this is processing are blocked
		setSubmitting(true);

		try {
			const api = new NxtCoreApi();
			const organization = await api.registerOrganization(
				formRef.current.getModel());

			dispatch(showMessage({
				message: `Organization ${organization.name} registered successfully`,
			}));

			// Redirect to register the user with the organization
			const registerLink = buildInvitePath(organization.id, organization.name);
			history.push(registerLink);
		} catch {
			dispatch(showMessage({
				message: 'Could not register organization',
				variant: 'error',
			}));

			setSubmitting(false);
		}
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xl"
		>
			<DialogTitle>Register Organization</DialogTitle>

			<DialogContent>
				<Formsy
					ref={formRef}
					onValid={enableSubmit}
					onInvalid={disableSubmit}
					className="flex flex-row"
				>
					<div className={clsx(classes.column, "flex flex-col")}>
						<TextFieldFormsy
							variant="outlined"
							className={classes.formInput}
							required
							name="name"
							label="Organization Name"
						/>

						<TextFieldFormsy
							variant="outlined"
							multiline
							className={classes.formInput}
							name="description"
							label="Brief Organization Overview"
						/>
					</div>

					<div className={clsx(classes.column, "flex flex-col")}>
						<TextFieldFormsy
							variant="outlined"
							className={classes.formInput}
							required
							name="contact_name"
							label="Contact Name"
						/>

						<TextFieldFormsy
							variant="outlined"
							type="tel"
							className={classes.formInput}
							required
							validations={{ isPhoneNumber: phoneNumberValidator }}
							validationError="Invalid phone number"
							name="contact_phone"
							label="Contact Phone"
						/>

						<TextFieldFormsy
							variant="outlined"
							className={classes.formInput}
							type="email"
							validations="isEmail"
							validationError="Invalid email"
							required
							name="contact_email"
							label="Contact Email"
						/>
					</div>
				</Formsy>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>

				<Button
					variant="contained"
					disabled={!submitEnabled || submitting}
					onClick={handleSubmit}
				>
					Register
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default RegisterOrgDialog;
