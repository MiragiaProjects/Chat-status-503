const socket = io();

const startEl = document.querySelector('#start');
const chatWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const messagesEl = document.querySelector('#messages'); // ul element containing all messages
const messageForm = document.querySelector('#message-form');
const messageEl = document.querySelector('#message');

//const opponentEl = document.querySelector('#opponent');

let username = null;

const addMessageToChat = (message, ownMsg = false) => {
	// create new `li` element
	const liEl = document.createElement('li');

	// set class of `li` to `message`
	liEl.classList.add('message');

	if (ownMsg) {
		liEl.classList.add('you');
	}

	// set content of `li` element
	liEl.innerHTML = ownMsg
		? message.content
		: `<span class="user">${message.username}</span>: ${message.content}`;

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

// listen for when a new user connects
socket.on('user:connected', (username) => {
	addNoticeToChat(`${username} connected 🥳`);
});

// listen for when a user disconnects
socket.on('user:disconnected', (username) => {
	addNoticeToChat(`${username} disconnected 😢`);
});

// listen for incoming messages
socket.on('chat:message', message => {
	console.log("Someone said something:", message);

	addMessageToChat(message);
});

// get username from form and emit `user:joined` and then show chat
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameForm.username.value;

	// emit `user:joined` event and when we get acknowledgement, THEN show the chat
	socket.emit('user:joined', username, (status) => {
		// we've received acknowledgement from the server
		console.log("Server acknowledged that user joined", status);

		if (status.success) {
			// hide start view
			startEl.classList.add('hide');

			// show chat view
			chatWrapperEl.classList.remove('hide');

			// focus on inputMessage
			messageEl.focus();
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
		content: messageEl.value,
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
 virus.setAttribute('style', `grid-column-start: ${randomColumnRow()}; grid-row-start: ${randomColumnRow()}`)
 virus.setAttribute("src", "assets/icons/corona-virus.svg");
 container.appendChild(virus);

 function randomColumnRow () {
   return Math.ceil(Math.random() * 8)
 }
 
 const changeVirusPosition = () => {
	 const row = randomColumnRow();
	 const column = randomColumnRow();
   
	 virus.style.gridColumnStart = column;
	 virus.style.gridRowStart = row;
   }

 
 
 let clickedTime, createdTime, reactionTime;
 
 makeVirus = () => {
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
	 
	 changeVirusPosition();
	 
	 document.getElementById("virus-icon").style.display = "block";
	 createdTime = Date.now();
   }, time);
 }
 
 document.getElementById("virus-icon").onclick = function() {
   clickedTime = Date.now();
   reactionTime = (clickedTime-createdTime)/1000;
   document.getElementById("time").innerHTML = reactionTime;
   this.style.display = "none";
   makeVirus();
 }
 
 makeVirus();

