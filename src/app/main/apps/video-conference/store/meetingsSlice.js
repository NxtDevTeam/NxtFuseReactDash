import FuseUtils from '@fuse/utils';
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { selectUserData } from 'app/auth/store/userSlice';

import {
	addEvent, getEvents, selectEvents,
} from '../../calendar/store/eventsSlice';

export const getMeetings = createAsyncThunk(
	'conferenceApp/meetings/getMeetings',
	(userId, { dispatch }) => {
		// Just pull in calendar events since meetings are stored there
		dispatch(getEvents(userId));
	});

function combineDateTime(date, time) {
	return new Date(
		date.local().year(),
		date.local().month(),
		date.local().date(),
		time.local().hours(),
		time.local().minutes(),
		time.local().seconds(),
		time.local().milliseconds(),
	);
}

export const addMeeting = createAsyncThunk(
	'conferenceApp/meetings/addMeeting',
	(data, { dispatch, getState }) => {
		// TODO Apply meeting configuration by creating a hidden
		// JitsiMeetExternalApi

		// Use GUID in the room name to avoid being guessable
		const roomId =
			`${encodeURIComponent(data.title)}-${FuseUtils.generateGUID()}`;
		const meetingLink =
			`${window.location.origin}/apps/video-conference/${roomId}`;

		const creatorId = selectUserData(getState())?.id;
		const coorganizerIds = (data.coorganizers ?? []).map((user) => user.id);

		dispatch(addEvent({
			calendar_id: data.calendar_id,
			title: data.title,
			description: meetingLink,
			start: combineDateTime(data.date, data.start_time),
			end: combineDateTime(data.date, data.end_time),
			meeting_config: {
				link: meetingLink,
				audio: data.audio_config,
				organizer_ids: [creatorId, ...coorganizerIds],
				password: data.password,
			},
		}));
	});

/**
 * Selector which filters calendar events for meetings.
 */
export const selectMeetings = createSelector(
	selectEvents,
	(calendarEvents) => calendarEvents.filter((event) => event.meeting_config),
);

const meetingsSlice = createSlice({
	name: 'conferenceApp/meetings',
	// Note: there is no actual state stored in this slice currently
	// It exists for future expansions and for
	initialState: {},
});

export default meetingsSlice.reducer;
