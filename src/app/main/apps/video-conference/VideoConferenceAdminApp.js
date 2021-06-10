import React, { useEffect, useState } from 'react';
import {
	makeStyles,
	IconButton,
	Badge,
	Icon,
	Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from 'app/auth/store/userSlice';
import calendarReducer from '../calendar/store/index';
import reducer from './store/index';
import {
	selectMeetings,
	getMeetings,
	addMeeting,
} from './store/meetingsSlice';
import MeetingsList from './MeetingsList';
import NewMeetingForm from './NewMeetingForm';
import clsx from 'clsx';
import withReducer from 'app/store/withReducer';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { buildCalendarId } from 'app/nxt-api/CalendarApi';

const useIconStyles = makeStyles((theme) => ({
	button: {
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
		'&:active': {
			backgroundColor: theme.palette.primary.dark,
		},
		'&:focus': {
			backgroundColor: theme.palette.primary.dark,
		},
		'&:disabled': {
			backgroundColor: theme.palette.primary.light,
		},
	},
	icon: {
		color: theme.palette.primary.contrastText,
		fontSize: 128,
	},
	badgeIcon: {
		// backgroundColor: theme.palette.text,
		// color: theme.palette.primary.contrastText,
		fontSize: 48,
	},
}));

function MeetingIconButton({ label, badgeIcon, disabled, onClick }) {
	const classes = useIconStyles();
	return (
		<div className="m-16">
			<IconButton
				className={classes.button}
				disabled={disabled}
				onClick={onClick}
			>
				<Badge
					badgeContent={
						<Icon className={classes.badgeIcon}>{badgeIcon}</Icon>
					}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
				>
					<Icon color="primary" className={classes.icon}>people</Icon>
				</Badge>
			</IconButton>

			<Typography className={classes.label} variant="h5" align="center">
				{label}
			</Typography>
		</div>
	);
}

/**
 * Custom React hook for fetching and filtering calendar events for ones that
 * look like meetings (i.e. have meeting links in them).
 */
function useScheduledMeetings() {
	const dispatch = useDispatch();

	const userData = useSelector(selectUserData);
	const userId = userData?.id;

	useEffect(() => {
		if (userId) {
			dispatch(getMeetings(userId));
		}
	}, [userId, dispatch]);

	return useSelector(selectMeetings);
}

function NewConferenceHeader({
	className,
	onCreateClick,
}) {
	const [selectedMeeting, setSelectedMeeting] = useState(null);

	const history = useHistory();

	function handleJoinMeeting() {
		// If at the same origin, use the React Router history API (and so strip
		// the origin off). Otherwise, use the "normal" window history API with the
		// full URL
		const url = new URL(selectedMeeting.meeting_config.link);
		if (url.origin === window.location.origin) {
			history.push(`${url.pathname}${url.search}`);
		} else {
			window.history.push(url.toString());
		}
	}

	const meetings = useScheduledMeetings();

	return (
		<div className={clsx(className, "flex flex-row")}>
			<MeetingIconButton
				label={<>Schedule <br /> Meeting</>}
				badgeIcon="add"
				onClick={onCreateClick}
			/>

			<MeetingIconButton
				label={<>Join <br /> Meeting</>}
				badgeIcon="link"
				disabled={!selectedMeeting}
				onClick={handleJoinMeeting}
			/>

			<MeetingsList
				className="h-400 m-16"
				selectedMeeting={selectedMeeting}
				onSelectMeeting={setSelectedMeeting}
				meetings={meetings}
			/>
		</div>
	);
}

const useStyles = makeStyles((theme) => ({
	header: {
		backgroundColor: theme.palette.background.default,
	},
	form: {
		backgroundColor: theme.palette.background.paper,
	},
}));

function VideoConferenceAdminApp() {
	const classes = useStyles();

	const [formOpen, setFormOpen] = useState(false);

	const userData = useSelector(selectUserData);
	const orgId = userData?.organizationId;

	const dispatch = useDispatch();

	function handleCreateMeeting(data) {
		dispatch(addMeeting({
			...data,
			calendar_id: buildCalendarId('organization', orgId),
		}));
	}

	return (
		<div className={"flex flex-col w-full h-full"}>
			<NewConferenceHeader
				className={clsx(classes.header, "h-300")}
				onCreateClick={() => setFormOpen(true)}
			/>

			<FuseAnimateGroup
				enter={{ animation: 'transition.slideDownIn' }}
				leave={{ animation: 'transition.slideUpOut' }}
				duration={300}
			>
				{formOpen
					? <NewMeetingForm
						className={clsx(classes.form, "p-16")}
						onCancel={() => setFormOpen(false)}
						onSubmit={handleCreateMeeting}
					/>
					: null
				}
			</FuseAnimateGroup>
		</div>
	);
}

export default
	withReducer('calendarApp', calendarReducer)(
		withReducer('conferenceApp', reducer)(
			VideoConferenceAdminApp));
