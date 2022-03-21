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
 * Heidi
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

  

  let score = 0;


function randomColumnRow () {
  return Math.ceil(Math.random() * 8)
}

const changeVirusPosition = () => {
    const row = randomColumnRow();
    const column = randomColumnRow();
  
    virus.style.gridColumnStart = column;
    virus.style.gridRowStart = row;
  }

    // Testfunction för att kolla rörelsen
  // setInterval(changeVirusPosition, 2000);


    // Eventlistner listening after a click on the virus and adding one to the score
    container.addEventListener("click",(e) =>{
      if (e.target === virus) {
        score++;

        let min = 2;
        let max = 5;

        //Generate Random number between 5 - 10,
        //SetTimeout för att det ska vara väntan mellan kilcksen 
        let rand = Math.floor(Math.random() * (max - min + 1) + min); 
        console.log('score ', score)
        setTimeout(() => { 
        
        document.getElementById("users").innerHTML="Your score is: " + score + "point";
        changeVirusPosition()

      },rand * 1000);
      }
    
    });
    

