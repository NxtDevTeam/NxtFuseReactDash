import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';

import { showMessage } from 'app/store/fuse/messageSlice'
import auth0Service from 'app/services/auth0Service';
import NxtBackendApi from 'app/nxt-api';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk(
	'calendarApp/events/getEvents',
	async (userId, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtBackendApi(token).calendar;

		try {
			return await api.getUserCalendar(userId);
		} catch (e) {
			dispatch(showMessage({ message: 'Failed to fetch calendar events' }));
			throw e;
		}
	});

export const addEvent = createAsyncThunk(
	'calendarApp/events/addEvent',
	async (data, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtBackendApi(token).calendar;

		try {
			return await api.createEvent(data);
		} catch (e) {
			dispatch(showMessage({ message: 'Could not add calendar event' }));
			throw e;
		}
	});

export const updateEvent = createAsyncThunk(
	'calendarApp/events/updateEvent',
	async ({ eventId, data }, { dispatch, getState }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtBackendApi(token).calendar;

		try {
			return await api.updateEvent(eventId, data);
		} catch (e) {
			dispatch(showMessage({ message: 'Could not update calendar event' }));
			throw e;
		}
	});

export const removeEvent = createAsyncThunk(
	'calendarApp/events/removeEvent',
	async (eventId, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtBackendApi(token).calendar;

		try {
			await api.deleteEvent(eventId);
			return eventId;
		} catch (e) {
			dispatch(showMessage({ message: 'Could not remove calendar event' }));
			throw e;
		}
	});

const eventsAdapter = createEntityAdapter({});

export const {
	selectAll: selectEvents,
	selectIds: selectEventIds,
	selectById: selectEventById
} = eventsAdapter.getSelectors(state => state.calendarApp.events);

const eventsSlice = createSlice({
	name: 'calendarApp/events',
	initialState: eventsAdapter.getInitialState({
		eventDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewEventDialog: {
			prepare: event => {
				const payload = {
					type: 'new',
					props: {
						open: true
					},
					data: {
						start: moment(event.start).format(dateFormat).toString(),
						end: moment(event.end).format(dateFormat).toString()
					}
				};
				return { payload };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload;
			}
		},
		openEditEventDialog: {
			prepare: event => {
				const payload = {
					type: 'edit',
					props: {
						open: true
					},
					data: {
						...event,
						start: moment(event.start).format(dateFormat).toString(),
						end: moment(event.end).format(dateFormat).toString()
					}
				};
				return { payload };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload;
			}
		},
		closeNewEventDialog: (state, action) => {
			state.eventDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		closeEditEventDialog: (state, action) => {
			state.eventDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[getEvents.fulfilled]: eventsAdapter.setAll,
		[addEvent.fulfilled]: eventsAdapter.addOne,

		// Optimisticly update the local state when modifying an event (to avoid
		// flickering back to the original event time when an event is dragged to
		// a new time)
		[updateEvent.pending]: (state, action) => {
			const { eventId, data } = action.meta.arg;

			// Use the raw selectors since the state value here is local to this slice
			const original = eventsAdapter.getSelectors().selectById(state, eventId);
			eventsAdapter.updateOne(state, {
				id: eventId,
				changes: {
					...data,
					undoState: original,
				},
			});
		},
		[updateEvent.fulfilled]: (state, action) => {
			eventsAdapter.upsertOne(state, {
				...action.payload,
				undoState: undefined,
			});
		},
		[updateEvent.rejected]: (state, action) => {
			// Restore the state
			const { eventId } = action.meta.arg;
			const current = eventsAdapter.getSelectors().selectById(state, eventId);
			eventsAdapter.updateOne(state, {
				id: eventId,
				changes: {
					...current.undoState,
					undoState: undefined,
				},
			});
		},

		[removeEvent.fulfilled]: eventsAdapter.removeOne
	}
});

export const {
	openNewEventDialog,
	closeNewEventDialog,
	openEditEventDialog,
	closeEditEventDialog
} = eventsSlice.actions;

export default eventsSlice.reducer;
