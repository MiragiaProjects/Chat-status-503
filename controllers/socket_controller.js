/***
 * 
 * Socket Controller
 */

const debug = require('debug')('game:socket_controller');
let io = null; 

// list of rooms and their connected users
const users = {}
const rooms = [
	{
		id: 'room1',
		name: 'Room one',
		users: {},
	},
	{
		id: 'room2',
		name: 'Room two',
		users: {},
	},
	{
		id: 'room3',
		name: 'Room three',
		users: {},
	},
	{
		id: 'room4',
		name: 'Room four',
		users: {},
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


const handleUserJoined = function(username, room_id, callback) {
	debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);

	this.join(room_id);

	const room = rooms.find(gameRoom => gameRoom.id === room_id)

	room.users[this.id] = username;

	this.broadcast.to(room.id).emit('user:connected', username);

	callback({
		success: true,
		roomName: room.name,
		users: room.users
	});

	this.broadcast.to(room.id).emit('user:list', room.users);
}


const handleUserFire = function(username, room_id, time) {
	
	// debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);
	function randomColumnRow () {
		return Math.ceil(Math.random() * 8)
	}
 
	const row = randomColumnRow();
	const column = randomColumnRow();

	const room = rooms.find(rom => rom.id === room_id)
	/*
	if (!room.points) {
        room.points = []
    }
    const point = { 
		username: username,point: time
    }
	
    room.points.push(point)
    console.log({rooms});

	room.points.forEach(element => {
		console.log(element);
		if (username === element.username) {
			element.point
			console.log(room.points);
		}

		room.users[this.id] = username;

        this.broadcast.to(room.id).emit('room:point', username);

        console.log(point)
	});
	*/

	
		//  { --> Room
		// 	id: 'room1',
		// 	name: 'Room one',
		// 	users: {
		// 		gsg2NtXO0QOuDnPwAAAF: 'Heidi',
		// 		yZk0ubEbX_hP72jmAAAH: 'daniel'
		// 	}
		// }

  
	console.log({room, username, time})
	io.to(room.id).emit('damageDone', username, time, row, column);

		
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
}