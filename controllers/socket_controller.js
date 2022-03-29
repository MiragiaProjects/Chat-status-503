/***
 * 
 * Socket Controller
 */

const debug = require('debug')('game:socket_controller');
let io = null; 

// list of rooms and their connected users
const users = {
}
const rooms = [
	{
		id: 'room1',
		name: 'Room one',
		users: {},
		player1:[],
		player2:[],
		player1Time:[],
		player2Time:[],
		player1Score:[],
		player2Score:[],
	},
	{
		id: 'room2',
		name: 'Room two',
		users: {},
		player1:[],
		player2:[],
		player1Time:[],
		player2Time:[],
		player1Score:[],
		player2Score:[],
	},
	{
		id: 'room3',
		name: 'Room three',
		users: {},
		player1:[],
		player2:[],
		player1Time:[],
		player2Time:[],
		player1Score:[],
		player2Score:[],
	},
	{
		id: 'room4',
		name: 'Room four',
		users: {},
		player1:[],
		player2:[],
		player1Time:[],
		player2Time:[],
		player1Score:[],
		player2Score:[],
	},
];



const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);

	const room = rooms.find(gameRoom => gameRoom.users.hasOwnProperty(this.id));

	if (!room) {
		return;
	}

	this.broadcast.to(room.id).emit('user:disconnected', room.users[this.id]);

	delete room.users[this.id];

	this.broadcast.to(room.id).emit('user:list', room.users);
}


// do when a user joins the game
const handleUserJoined = function(username, room_id, callback) {
	debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);

	// const room = rooms.find(gameRoom => gameRoom.id === room_id);

	// if (room.player2 == 0) {
	// 	return;
	// } else {
	
	this.join(room_id);

	const room = rooms.find(gameRoom => gameRoom.id === room_id);

	
	// ge en socket till room's `users` object
	room.users[this.id] = username;
	// låt den andra veta att någon annan gått med i gamet
	

	if (room.player1 == 0) {
		room.player1.push(room.users[this.id])
	}	else {
		room.player2.push(room.users[this.id])
	}

	debug(`${room.player1}player1`);
	debug(`${room.player2}player2`);


	callback({
		success: true,
		roomName: room.name,
		users: room.users
	});
	this.broadcast.to(room.id).emit('user:connected', username, room.player1, room.player2);

	this.broadcast.to(room.id).emit('playerslist', room.player1, room.player2, username);

	this.broadcast.to(room.id).emit('user:list', room.users);
//}
}

// Handle killing the virus
const handleUserFire = function(username, room_id, time) {
	let clickedTime, createdTime, reactionTime;
	 debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);
	function randomColumnRow () {
		return Math.ceil(Math.random() * 8)
	}


	const row = randomColumnRow();
	const column = randomColumnRow();

	const room = rooms.find(gameRoom => gameRoom.id === room_id)


	clickedTime = Date.now();
	reactionTime = (clickedTime-createdTime)/1000;

	
	if (username == room.player1 ) {
		room.player1Time.push(time);
	
	} else {
		room.player2Time.push(time);
	}
	debug(`${room.player1Time} ; ${room.player2Time}`)


	if (room.player1Time.length+1 < room.player2Time.length+1) {
		room.player1Score ++;
	} else {
		room.player2Score ++;
	}
	
	debug(`${room.player1Score} player1Score ; ${room.player2Score} player2Score`)


	io.to(room.id).emit('playerScore', room.player1Score, room.player2Score)
	io.to(room.id).emit('damageDone', username, time, row, column);
	//io.to(room.id).emit('room:point', username, userpoint);
	debug(`User ${username} time ${time}`);

}

const handleTime = function(time) {
	debug(`${time}`)

	const room = rooms.find(gameRoom => gameRoom.id === room_id)

	io.to(room.id).emit('user:time', time);
}


module.exports = function(socket, _io) {
	io = _io;

	debug('a new client has connected', socket.id);

	io.emit("new-connection", "A new user connected");

	io.emit("new-connection", "A new user connected");

	// io.to(room).emit();
	socket.on('user:fire', handleUserFire);

	// handle user disconnect
	socket.on('disconnect', handleDisconnect);

	// handle user joined
	socket.on('user:joined', handleUserJoined);

	//
	socket.on('user:time', handleTime);
}