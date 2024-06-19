chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'authorizeGoogleKeep') {
		chrome.identity.getAuthToken({ interactive: true }, (token) => {
			sendResponse({ token });
		});
		return true;
	}
});
