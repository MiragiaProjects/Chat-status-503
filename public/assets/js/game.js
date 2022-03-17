const socket = io();

const container = document.querySelector(".container");
const users = document.querySelector(".usersClass");
const usersScore = document.querySelector("")

const virus = document.createElement("img");
virus.setAttribute("class", "virus");
virus.setAttribute("src", "../icons/corona-virus.svg");

let score = 0;

const contHeight = container.offsetHeight;
const contWidth = container.offsetWidth;


// A random time generator that randoms a time between 5-10 seconds.
randomTime(() => {
    let min = 5;
    let max = 10;
        //Generate Random number between 5 - 10
    let rand = Math.floor(Math.random() * (max - min + 1) + min); 
    console.log('Wait for ' + rand + ' seconds');
    setTimeout(randomTime, rand * 1000);
  });
  
  // Running the function
  randomTime();


  // Virus gets randomized out on the screen on a 5-10 interval
setInterval(() => {
    const randTop = Math.random() * (contHeight - 100);
    const randLeft = Math.random() * (contWidth - 100);
  
    virus.style.position = "absolute";
    virus.style.top = randTop + "px";
    virus.style.left = randLeft + "px";
  }, randomTime());


  // Eventlistner listening after a click on the virus and adding one to the score not complete yet
  container.addEventListener("click",(e) =>{
      if(e.target === virus) score++;
  })