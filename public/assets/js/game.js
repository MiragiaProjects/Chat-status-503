const socket = io();

const startEl = document.querySelector('#start');
const chatWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const messagesEl = document.querySelector('#messages');

let room = null;
let username = null;

const addNoticeToChat = notice => {
	const liEl = document.createElement('li');
	liEl.classList.add('notice');

	liEl.innerText = notice;

	messagesEl.appendChild(liEl);
	liEl.scrollIntoView();
}

const updateUserList = users => {
	document.querySelector('#online-users').innerHTML =
		Object.values(users).map(username => `<li><span class="fa-solid fa-user-astronaut"></span> ${username}</li>`).join("");
}

// listen for when a new user connects
socket.on('user:connected', (username) => {
	addNoticeToChat(`${username} connected 🥳`);
});

socket.on('user:disconnected', (username) => {
	addNoticeToChat(`${username} disconnected 😢`);
});

socket.on('user:list', users => {
	updateUserList(users);
})

socket.on('disconnect', (reason) => {
	if (reason === 'io server disconnect') {
		// reconnect to the server
		socket.connect();
	}
	addNoticeToChat(`You were disconnected. Reason: ${reason} 😳`);
});

socket.on('reconnect', () => {
	if (username) {
		socket.emit('user:joined', username, room, (status) => {
			addNoticeToChat(`You reconnected 🥳`);
		});
	}
});

socket.on('damageDone', (username, time, row, column) => {
	addNoticeToChat(`${username} killed the virus in ${time}s`);
	makeVirus(row, column);
})

usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	room = usernameForm.room.value;
	username = usernameForm.username.value;

	console.log(`User ${username} wants to join room '${room}'s`);

	socket.emit('user:joined', username, room, (status) => {

		console.log("Server acknowledged that user joined", status);

		if (status.success) {

			startEl.classList.add('hide');

			chatWrapperEl.classList.remove('hide');

			document.querySelector('#room').innerText = status.roomName;

			updateUserList(status.users);
		}
	});
});

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
