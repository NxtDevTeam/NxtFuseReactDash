import ApiWrapper from "./ApiWrapper";

export default class NxtChatApi extends ApiWrapper {
	constructor(accessToken, baseUrl) {
		baseUrl = baseUrl || process.env.REACT_APP_NXT_CHAT_API_BASE_URL;
		super(accessToken, baseUrl);
	}

	getChatContacts() {
		return this.makeRequest({ url: '/contacts' });
	}

	getChatMessages(chatId, query = {}) {
		return this.makeRequest({
			url: `/chats/${chatId}/messages`,
			params: query,
		});
	}

	sendChatMessage(chatId, message) {
		return this.makeRequest({
			method: 'post',
			url: `/chats/${chatId}/messages`,
			data: {
				message,
			},
		});
	}
}
