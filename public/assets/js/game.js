/**
 * 
 * Game js
 */

// Socket variable
const socket = io();

// Before you enter the game
const frontPage = document.querySelector('#frontPage');
const userForm = document.querySelector('#userForm');
const waitForOpponent = document.querySelector('#waitForOpponent');

// When you enter the game
const game = document.querySelector('#game');
const playingFieldEl = document.querySelector('#gameAria');
const areYouReady = document.querySelector('#areYouReady');

// div boxes to use as a position for virus
const boxes = document.querySelectorAll('.box');


// To identify the username and the opponent.
let username = null;
let opponent = null;


// Event listener for when a user submits the name form
userForm.addEventListener('submit', (e) => {
	e.preventDefault();
 
	// Take the value(name) when a user submits
	username = userForm.username.value;
	
	// Let socket know that a user joined
	socket.emit('user:joined', username, (status) => {
		
		if (status.success) {

			// Hide frontPage
			frontPage.classList.add('hide');

			// Show gameAria
			waitForOpponent.classList.remove('hide');

			// If the status is true start the game
			if (status.startGame) {
				waitForOpponent.classList.add('hide');
				game.classList.remove('hide');
			}
		}

	})
});

// users out both users name on the field
socket.on('users:names', (players) => {

	// The users own name
	username = userForm.username.value;

	// Make users to an object and put them into an emty array
	const users = Object.values(players);
	const playerNames = [];

	// For each user put them into the array
	users.forEach( (player) => {
		playerNames.push(player.username);
	} );

	// Take out your ownname (playerOne) from the array, so only the opponent name is left
	const playerOne = playerNames.indexOf(username);
	// used splice to cut it out
	playerNames.splice(playerOne, 1);
	opponent = playerNames;

});

// To thart the game
socket.on('start:game', () => {

	// When a opponent connect and show game
	waitForOpponent.classList.add('hide');
	game.classList.remove('hide');

});
