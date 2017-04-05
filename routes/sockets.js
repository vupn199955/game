var io = require('socket.io');
var sockets = [];
var count = 0;

exports.initialize = function (server) {
	io = io.listen(server);
	io.sockets.on("connection", function (socket) {
		if (count < 2) {
			sockets[count] = socket;
			var data = {};
			data.mySign = (count == 1) ? 'blue' : 'red';
			data.myTurn = (count == 1) ? true : false;
			socket.emit("initialize", data);
			count++;
		}
		if (count == 2) {
			socket.on("clientPush", function (data) {
				socket.broadcast.emit("serverPush", data);
			});
		}

		socket.on("disconnect", function () {
			for (var i = 0; i < 2; i++) {
				if (sockets[i] == socket) {
					sockets[i] = undefined;
					count--;
					break;
				}
			}
		});
	});
}
