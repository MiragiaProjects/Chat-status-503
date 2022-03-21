"use strict";  
  const socket = io();
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
    

