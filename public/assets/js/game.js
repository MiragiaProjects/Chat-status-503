const socket = io();

const startEl = document.querySelector('#start');
const chatWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const messagesEl = document.querySelector('#messages'); // ul element containing all messages
const messageForm = document.querySelector('#message-form');
const messageEl = document.querySelector('#message');


let room = null;
let username = null;

const addMessageToChat = (message, ownMsg = false) => {
	// create new `li` element
	const liEl = document.createElement('li');

	// set class of `li` to `message`
	liEl.classList.add('message');

	if (ownMsg) {
		liEl.classList.add('you');
	}

	// get human readable time
	const time = moment(message.timestamp).format('HH:mm:ss');

	// set content of `li` element
	liEl.innerHTML = ownMsg
		? message.content
		: `<span class="user">${message.username}</span><span class="content">${message.content}</span><span class="time">${time}</span>`;

	// append `li` element to `#messages`
	messagesEl.appendChild(liEl);

	// scroll `li` element into view
	liEl.scrollIntoView();
}

const addNoticeToChat = notice => {
	const liEl = document.createElement('li');
	liEl.classList.add('notice');

	liEl.innerText = notice;

	messagesEl.appendChild(liEl);
	liEl.scrollIntoView();
}

// update user list
const updateUserList = users => {
	document.querySelector('#online-users').innerHTML =
		Object.values(users).map(username => `<li><span class="fa-solid fa-user-astronaut"></span> ${username}</li>`).join("");
}

// listen for when a new user connects
socket.on('user:connected', (username) => {
	addNoticeToChat(`${username} connected 🥳`);
});

// listen for when a user disconnects
socket.on('user:disconnected', (username) => {
	addNoticeToChat(`${username} disconnected 😢`);
});

// listen for when we receive an updated list of online users (in this room)
socket.on('user:list', users => {
	updateUserList(users);
})

// listen for when we're disconnected
socket.on('disconnect', (reason) => {
	if (reason === 'io server disconnect') {
		// reconnect to the server
		socket.connect();
	}
	addNoticeToChat(`You were disconnected. Reason: ${reason} 😳`);
});

// listen for when we're reconnected
socket.on('reconnect', () => {
	// join room? but only if we were in the chat previously
	if (username) {
		socket.emit('user:joined', username, room, (status) => {
			addNoticeToChat(`You reconnected 🥳`);
		});
	}
});

socket.on('damageDone', (username, time, row, column) => {
	addNoticeToChat(`Damage done from ${username} in ${time}`);
	makeVirus(row, column);
})

// listen for incoming messages
socket.on('chat:message', message => {
	console.log("Someone said something:", message);

	addMessageToChat(message);
});

// get username and room from form and emit `user:joined` and then show chat
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	room = usernameForm.room.value;
	username = usernameForm.username.value;

	console.log(`User ${username} wants to join room '${room}'s`);

	// emit `user:joined` event and when we get acknowledgement, THEN show the chat
	socket.emit('user:joined', username, room, (status) => {
		// we've received acknowledgement from the server
		console.log("Server acknowledged that user joined", status);

		if (status.success) {
			// hide start view
			startEl.classList.add('hide');

			// show chat view
			chatWrapperEl.classList.remove('hide');

			// set room name as chat title chat-title
			document.querySelector('#room').innerText = status.roomName;

			// focus on inputMessage
			messageEl.focus();

			// update list of users in room
			updateUserList(status.users);
		}
	});
});

// send message to server
messageForm.addEventListener('submit', e => {
	e.preventDefault();

	if (!messageEl.value) {
		return;
	}

	const msg = {
		username,
		room,
		content: messageEl.value,
		timestamp: Date.now(),
	}

	// send message to server
	socket.emit('chat:message', msg);

	// add message to chat
	addMessageToChat(msg, true);

	// clear message input element and focus
	messageEl.value = '';
	messageEl.focus();
});

/**
 * 
 * Heidi och Malin
 */

 "use strict";  
 //const socket = io();
 const container = document.querySelector(".container");
 const users = document.querySelector(".users");
 // const usersScore = document.querySelector(".usersCore")

 const virus = document.createElement("img");
 virus.setAttribute("id", "virus-icon");
 virus.setAttribute('style', `grid-column-start: ${8}; grid-row-start: ${8}`)
 virus.setAttribute("src", "assets/icons/corona-virus.svg");
 container.appendChild(virus);



const changeVirusPosition = (row, column) => {
	 virus.style.gridColumnStart = column;
	 virus.style.gridRowStart = row;
   }

 
 
 let clickedTime, createdTime, reactionTime;
 
 makeVirus = (row, column) => {
   let time = Math.random();
   time=time*5000;
   
   setTimeout(function() {
	 if (Math.random() > 0.5) {
	   document.getElementById("virus-icon").style.borderRadius="100px";
	 } else {
	   document.getElementById("virus-icon").style.borderRadius="0";
	 }
	 
	 let top=Math.random();
	 top=top*300;
	 
	 let left=Math.random();
	 left=left*500;
	 
	 changeVirusPosition(row, column);
	 
	 document.getElementById("virus-icon").style.display = "block";
	 createdTime = Date.now();
   }, time);
 }

 document.getElementById("virus-icon").onclick = function() {
   clickedTime = Date.now();
   reactionTime = (clickedTime-createdTime)/1000;
   document.getElementById("time").innerHTML = reactionTime;
	 this.style.display = "none";
	 socket.emit('user:fire', username, room, reactionTime);
 }


 
 
 makeVirus(2,2);
