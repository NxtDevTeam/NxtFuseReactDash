import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import auth0Service from 'app/services/auth0Service';
import NxtBackendApi from 'app/nxt-api';
import { closeChatPanel } from './stateSlice';

export const getContacts = createAsyncThunk('chatPanel/contacts/getContacts', async params => {
	const token = await auth0Service.getNxtBackendToken();

	const api = new NxtBackendApi(token);
	return await api.getChatContacts();
});

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactById } = contactsAdapter.getSelectors(
	state => state.chatPanel.contacts
);

const contactsSlice = createSlice({
	name: 'chatPanel/contacts',
	initialState: contactsAdapter.getInitialState({
		selectedContactId: null
	}),
	reducers: {
		setSelectedContactId: (state, action) => {
			state.selectedContactId = action.payload;
		},
		removeSelectedContactId: (state, action) => (state, action) => {
			state.selectedContactId = null;
		}
	},
	extraReducers: {
		[getContacts.fulfilled]: contactsAdapter.setAll,
		[closeChatPanel]: (state, action) => {
			state.selectedContactId = null;
		}
	}
});

export const { setSelectedContactId, removeSelectedContactId } = contactsSlice.actions;

export default contactsSlice.reducer;
