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

		const state = getState();
		const chatId = selectChatId(state);
		if (!chatId) {
			throw new Error('No chat for which to fetch messages');
		}

		const lastMessage = selectLastMessage(state);

		// Build query for messages after the ones already cached
		const query = {};
		if (lastMessage) {
			query.after = lastMessage.timestamp;
		}

		const api = new NxtBackendApi(token);
		const messages = await api.getChatMessages(chatId, query);

		// dispatch(updateUserChatList(userChatList));

		fetchMessageSenders(messages, dispatch);

		return {
			chatId,
			messages,
		};
	});

export const sendMessage = createAsyncThunk(
	'chatPanel/chat/sendMessage',
	async ({ chatId, messageText }) => {
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

const selectSlice = (state) => state.chatPanel.chat;

const {
	selectIds: selectMessageIds,
	selectById: selectMessage,
	selectAll: selectMessages,
} = messagesAdapter.getSelectors(selectSlice);

export { selectMessages };

const selectLastMessageId = (state) => {
	const ids = selectMessageIds(state);
	return ids.length > 0 ? ids[ids.length - 1] : undefined;
};

const selectLastMessage = (state) => {
	const lastId = selectLastMessageId(state);
	return selectMessage(state, lastId);
};

export const selectChatId = (state) => selectSlice(state).chatId;

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
			const { chatId, messages } = action.payload;
			if (chatId === state.chatId) {
				// Only take in messages for the current chat (in case a response comes
				// in after switching to a new chat).
				messagesAdapter.upsertMany(state, messages);
			}
		},
		[sendMessage.fulfilled]: messagesAdapter.upsertOne,

		[closeChatPanel]: (state) => {
			state.chatId = null;
			messagesAdapter.setAll(state, []);
		}
	}
});

export const { removeChat } = chatSlice.actions;

export default chatSlice.reducer;
