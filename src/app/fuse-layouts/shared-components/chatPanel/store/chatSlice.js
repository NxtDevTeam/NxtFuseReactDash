import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

import auth0Service from 'app/services/auth0Service';
import NxtBackendApi from 'app/nxt-api';
import { fetchUser } from 'app/store/usersSlice';
import { setSelectedContactId } from './contactsSlice';
import { closeChatPanel } from './stateSlice';
// import { updateUserChatList } from './chatListSlice';

function fetchMessageSenders(messages, dispatch) {
	// Collect all of the senders to fetch their info
	// (Use an array instead of a set since there will not generally be very
	// many senders)
	let senderIds = [];
	for (let message of messages) {
		let sender = message.sender_id;
		if (!senderIds.includes(sender)) {
			senderIds.push(sender);
			dispatch(fetchUser(sender));
		}
	}
}

export const getChat = createAsyncThunk(
	'chatPanel/chat/getChat',
	async (chatId, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		const messages = await api.getChatMessages(chatId);

		dispatch(setSelectedContactId(chatId));
		// dispatch(updateUserChatList(userChatList));

		fetchMessageSenders(messages, dispatch);

		return {
			chatId,
			messages,
		};
	});

export const getNewMessages = createAsyncThunk(
	'chatPanel/chat/getNewMessages',
	async (_, { dispatch, getState }) => {
		const token = await auth0Service.getNxtBackendToken();

		const state = getState().chatPanel.chat;
		const chatId = state.chatId;
		if (!chatId) {
			throw new Error('No chat for which to fetch messages');
		}

		const loadedMessages = state.messages || [];
		const lastMessage = loadedMessages[loadedMessages.length - 1];

		// Build query for messages after the ones already cached
		const query = {};
		if (lastMessage) {
			query.after = lastMessage.timestamp;
		}

		const api = new NxtBackendApi(token);
		const messages = await api.getChatMessages(chatId, query);

		// dispatch(updateUserChatList(userChatList));

		fetchMessageSenders(messages, dispatch);

		return messages;
	});

export const sendMessage = createAsyncThunk(
	'chatPanel/chat/sendMessage',
	async ({ messageText, chatId }, { dispatch, getState }) => {
		const token = await auth0Service.getNxtBackendToken();

		const api = new NxtBackendApi(token);
		const message = api.sendChatMessage(chatId, messageText);

		// dispatch(updateUserChatList(userChatList));

		return message;
	}
);

const messagesAdapter = createEntityAdapter({
	// Sort by time with older messages first
	sortComparer: (a, b) => a.timestamp >= b.timestamp,
});

export const {
	selectAll: selectMessages,
} = messagesAdapter.getSelectors(state => state.chatPanel.chat);

const chatSlice = createSlice({
	name: 'chatPanel/chat',
	initialState: messagesAdapter.getInitialState({
		chatId: null,
	}),
	reducers: {},
	extraReducers: {
		[getChat.fulfilled]: (state, action) => {
			const { chatId, messages } = action.payload
			state.chatId = chatId;
			messagesAdapter.setAll(state, messages);
		},
		[getNewMessages.fulfilled]: (state, action) => {
			messagesAdapter.upsertMany(state, action.payload);
		},
		[sendMessage.fulfilled]: (state, action) => {
			messagesAdapter.upsertOne(state, action.payload);
		},

		[closeChatPanel]: (state, action) => {
			state.chatId = null;
			messagesAdapter.setAll(state, []);
		}
	}
});

export const { removeChat } = chatSlice.actions;

export default chatSlice.reducer;
