import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchChatList = createAsyncThunk('chatPanel/chatList/fetch', async () => {
	// TODO Implement this on the back end so it can be pulled here
	return [];
});

const chatListSlice = createSlice({
	name: 'chatPanel/chatList',
	initialState: null,
	reducers: {
		updateUserChatList: (state, action) => {
			state.chatList = action.payload;
		}
	},
	extraReducers: {
		[fetchChatList.fulfilled]: (state, action) => action.payload,
	}
});

export const { updateUserChatList } = chatListSlice.actions;

export default chatListSlice.reducer;
