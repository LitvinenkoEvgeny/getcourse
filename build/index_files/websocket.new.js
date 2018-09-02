'use strict';
(function () {
	window.WebSocket = window.WebSocket || window.MozWebSocket;

	var ConnectionWrapper = function (serverLocation, useLocation) {
		var that = this
			, channels = {}
			, connected = false
			, connection
			, openedChannels = {}
			;

		this.pageKey = encodeURI(location.pathname.replace(/\//gm, '_').replace(/_$/gm, ''));

		this.send = function (message) {
			if (connected) {
				connection.send(message);
				return true;
			}
			return false;
		};

		var join = function (channel, handler) {
			if (undefined === openedChannels[channel]) {
				var result = that.send(JSON.stringify({
					type: 'join'
					, data: channel
				}));
				if (result) {
					openedChannels[channel] = true;
				}
			}
			channels[channel] = handler;
		};

		var leave = function (channel) {
			that.send(JSON.stringify({
				type: 'leave'
				, data: channel
			}));
			delete channels[channel];
		};

		this.subscribeChannel = function (channel, handler) {
			try {
				join(channel, handler);
			}
			catch (e) {
				var interval = setInterval(function () {
					try {
						join(channel, handler);
						clearInterval(interval);
					}
					catch (e) {
						// todo
					}
				}, 1000);
			}
		};

		this.unsubscribeChannel = function (channel) {
			try {
				leave(channel);
			}
			catch (e) {
				var interval = setInterval(function () {
					try {
						leave(channel);
						clearInterval(interval);
					}
					catch (e) {
						// todo
					}
				}, 1000);
			}
		};

		var getConnectionString = function () {
			return useLocation ? serverLocation : [
				serverLocation
				, '?'
				, 'accountId=' + window.accountId
				, '&'
				, 'accountUserId=' + window.accountUserId
				, '&'
				, 'gcSessionId=' + window.gcSessionId
			].join('');
		};

		this.connect = function () {
			if (connected) {
				return;
			}

			connection = new WebSocket(getConnectionString());

			connection.onclose = function () {
				connected = false;
				setTimeout(function () {
					openedChannels = {};
					that.connect(getConnectionString())
				}, 2000);
			};

			connection.onopen = function () {
				connected = true;
				for (var channel in channels) {
					that.subscribeChannel(channel, channels[channel]);
				}
			};

			connection.onerror = function (error) {
				// an error occurred when sending/receiving data
			};

			connection.onmessage = function (message) {
				// try to decode json (I assume that each message from server is json)
				try {
					var json = JSON.parse(message.data);
					var channel = json.channel;
					if (undefined !== channels[channel]) {
						channels[channel](message, json.data);
					}
				} catch (e) {
					console.log(e, message.data);
				}
				// handle incoming message
			};
		};

		this.reconnect = function () {
			connection.close();
			this.connect();
		};
	};
	var isHttps = undefined !== document
		? (undefined !== document.location
		? (undefined !== document.location.protocol
		? 'https:' == document.location.protocol
		: false)
		: false)
		: false;
	var connectionStr;
	if (!isHttps) {
		connectionStr = 'ws://' + window.websocketHost + ':'+window.websocketHttpPort;
	}
	else {
		connectionStr = 'wss://' + window.websocketHost + ':'+window.websocketHttpsPort;
	}

	window.gcWebSocketConnection = ConnectionWrapper;
	window.accountUserWebSocketConnection = new ConnectionWrapper(connectionStr);
	window.accountUserWebSocketConnection.connect();
	if (undefined !== window.statWebSocketConnectionUrl && undefined !== window.gcUniqId) {
		window.statWebSocketConnection = new ConnectionWrapper(window.statWebSocketConnectionUrl+'?gcUniqId='+window.gcUniqId, true);
		window.statWebSocketConnection.connect();
	}
	if ( ! window.gcSessionId && undefined !== window.csrfToken && window.csrfToken ) {
		window.accountUserWebSocketConnection.subscribeChannel( window.csrfToken,
			function(message, json){
				var that = window.accountUserWebSocketConnection;
				that.unsubscribeChannel( window.csrfToken );
				if ( json.session_id ) {
					window.gcSessionId = json.session_id;
					that.reconnect();
				}
			}
		);
	}
})();