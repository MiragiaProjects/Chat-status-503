/**
 * Socket Controller
 */

const debug = require('debug')('game:socket_controller');

let io = null;

// Empty array with rooms
const rooms = [];

// Existing rooms
let roomsToJoin = 0;

// How many are in the rooms
let joinRooms = 0;

// Handle when a user join the room
const handleUserJoined = function(username, callback) {
	// Can the game start?
	let startGame = false;

	// How many has joined the room?
	if (joinRooms === 0) {
		rooms.push({
			// the room id and add one when a user joins
			room_id: roomsToJoin++,

			// How many users is in the current room
			currentPlayers: 0,

			// Object property to hold info about the users that is in the room
			players: {},
		});
	}

	// Add players to the room
	const currentRoom = rooms[rooms.length - 1];
	currentRoom.currentPlayers++;

	// Have the socket client to join the current room
	this.join(currentRoom);

	// Each player object in a room holds info aboiut their name, current score and their previous reaction time
	currentRoom.players[this.id] = {
		username,
	};

	// Add a player
	joinRooms++;
	// If they are two => start the game
	if (joinRooms === 2) {
		// Set the rooms to 0 so other can make a room with two players
		joinRooms = 0;

		// Start the game
		startGame = true;

		// Print the names to socket
		io.in(currentRoom).emit('users:names', currentRoom.players);
		// broadcast that the game starts

		this.broadcast.to(currentRoom).emit('start:game');
	} 

	// Callback to client
	callback({
		success: true,
		startGame,
	});
}

// When a user disconnects
const handleDisconnect = function() {

	// Find the sockets room
	const room = rooms.find(lobby => lobby.players.hasOwnProperty(this.id));

	// If socket is not in a room, do nothing and return
	if(!room) {
		return;
	}
}


// Exporting functions
module.exports = function(socket, _io) {
	io = _io;
	debug('a new client has connected', socket.id);

	// handle user disconnect
	socket.on('disconnect', handleDisconnect);

	// handle user joined
	socket.on('user:joined', handleUserJoined);

}