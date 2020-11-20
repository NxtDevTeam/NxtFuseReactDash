import { combineReducers } from '@reduxjs/toolkit';
import chat from './chatSlice';
import contacts from './contactsSlice';
import state from './stateSlice';
import chatList from './chatListSlice';

const reducer = combineReducers({
	chatList,
	contacts,
	chat,
	state
});

export default reducer;
