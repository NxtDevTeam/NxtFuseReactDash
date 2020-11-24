import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buildCalendarId } from 'app/nxt-api/CalendarApi';
import { authRoles } from 'app/auth';
import { selectUserData, selectUserRole } from 'app/auth/store/userSlice';
import {
	selectOwnOrganization,
} from 'app/store/organization/organizationsSlice';
import {
	fetchTeamList,
	selectOwnOrgTeams,
} from 'app/store/organization/teamsSlice';
import {
	removeEvent,
	updateEvent,
	addEvent,
	closeNewEventDialog,
	closeEditEventDialog,
} from './store/eventsSlice';

const defaultFormState = {
	calendar_id: '',
	title: '',
	all_day: false,
	start: moment(new Date(), 'MM/DD/YYYY'),
	end: moment(new Date(), 'MM/DD/YYYY'),
	description: '',
};

function EventDialog(props) {
	const dispatch = useDispatch();
	const eventDialog =
		useSelector(({ calendarApp }) => calendarApp.events.eventDialog);
	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const userData = useSelector(selectUserData);
	const userId = userData.id;

	const userRole = useSelector(selectUserRole);
	const isAdmin = FuseUtils.hasPermission(authRoles.orgAdmin, userRole);
	const canChangeEventCalendar =
		isAdmin
		|| !form.calendar_id
		|| form.calendar_id === buildCalendarId('user', userId);

	// Fetch list of teams for making the calendar list
	const orgId = userData.organizationId;
	useEffect(() => {
		if (orgId) {
			dispatch(fetchTeamList(orgId));
		}
	}, [orgId, dispatch]);

	const ownOrg = useSelector(selectOwnOrganization)?.data;
	let ownOrgTeams = useSelector(selectOwnOrgTeams)?.data;

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (eventDialog.type === 'edit' && eventDialog.data) {
			setForm({ ...eventDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (eventDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...eventDialog.data,
			});
		}
	}, [eventDialog.data, eventDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (eventDialog.props.open) {
			initDialog();
		}
	}, [eventDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return eventDialog.type === 'edit' ? dispatch(closeEditEventDialog()) : dispatch(closeNewEventDialog());
	}

	function canBeSubmitted() {
		return form.title.length > 0;
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (eventDialog.type === 'new') {
			dispatch(addEvent(form));
		} else {
			dispatch(updateEvent({
				eventId: form.id,
				data: {
					calendar_id: form.calendar_id,
					title: form.title,
					description: form.description,
					all_day: form.all_day,
					start: form.start,
					end: form.end,
				},
			}));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeEvent(form.id));
		closeComposeDialog();
	}

	return (
		<Dialog
			{...eventDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
			component="form"
			classes={{
				paper: 'rounded-8'
			}}
		>
			<AppBar position="static">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{eventDialog.type === 'new'
							? 'New Event'
							: canChangeEventCalendar ? 'Edit Event' : 'Event Details'}
					</Typography>
				</Toolbar>
			</AppBar>

			<form noValidate onSubmit={handleSubmit}>
				<DialogContent
					classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}
					className="flex flex-col"
				>
					<TextField
						disabled={!canChangeEventCalendar}
						id="title"
						label="Title"
						className="mt-8 mb-16"
						InputLabelProps={{
							shrink: true
						}}
						name="title"
						value={form.title}
						onChange={handleChange}
						variant="outlined"
						autoFocus
						required
						fullWidth
					/>

					<FormControlLabel
						className="mt-8 mb-16"
						label="All Day"
						control={
							<Switch
								disabled={!canChangeEventCalendar}
								checked={form.all_day}
								id="all_day"
								name="all_day"
								onChange={handleChange}
							/>
						}
					/>

					<FormControl variant="outlined">
						<InputLabel id="calendar-id-label">Calendar</InputLabel>
						<Select
							required
							disabled={!canChangeEventCalendar}
							value={form.calendar_id}
							id="calendar_id"
							labelId="calendar-id-label"
							label="Calendar"
							name="calendar_id"
							onChange={handleChange}
						>
							<MenuItem value={buildCalendarId('user', userId)}>
								Personal
							</MenuItem>

							{ownOrg &&
								<MenuItem
									value={buildCalendarId('organization', ownOrg.id)}
									disabled={!isAdmin}
								>
									{ownOrg.name}
								</MenuItem>
							}

							{ownOrgTeams &&
								ownOrgTeams.map((team) => (
									<MenuItem
										key={team.id}
										value={buildCalendarId('team', team.id)}
										disabled={!isAdmin}
									>
										{team.name}
									</MenuItem>
								))
							}
						</Select>
					</FormControl>

					<DateTimePicker
						disabled={!canChangeEventCalendar}
						label="Start"
						inputVariant="outlined"
						value={form.start}
						onChange={date => setInForm('start', date)}
						className="mt-8 mb-16 w-full"
						maxDate={form.end}
					/>

					<DateTimePicker
						disabled={!canChangeEventCalendar}
						label="End"
						inputVariant="outlined"
						value={form.end}
						onChange={date => setInForm('end', date)}
						className="mt-8 mb-16 w-full"
						minDate={form.start}
					/>

					<TextField
						disabled={!canChangeEventCalendar}
						className="mt-8 mb-16"
						id="description"
						label="Description"
						type="text"
						name="description"
						value={form.description}
						onChange={handleChange}
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/>
				</DialogContent>

				{eventDialog.type === 'new' ? (
					<DialogActions className="justify-between px-8 sm:px-16">
						<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted()}>
							Add
						</Button>
					</DialogActions>
				) : (
						canChangeEventCalendar
							?
							<DialogActions className="justify-between px-8 sm:px-16">
								<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted()}>
									Save
								</Button>
								<IconButton onClick={handleRemove}>
									<Icon>delete</Icon>
								</IconButton>
							</DialogActions>
							: null
					)}
			</form>
		</Dialog>
	);
}

export default EventDialog;
