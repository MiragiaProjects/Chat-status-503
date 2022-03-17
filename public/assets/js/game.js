const socket = io();

const container = document.querySelector(".container");
const users = document.querySelector(".usersClass");

const virus = document.createElement("img");
virus.setAttribute("class", "terrorist");
virus.setAttribute("src", "../icons/corona-virus.svg");