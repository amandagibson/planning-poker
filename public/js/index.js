"use strict";

const socket = io();
let roomId;

const selections = document.getElementById("selections");
selections.style.display = "none";

document.getElementById("start").addEventListener("click", () => {
    roomId = prompt("Please give your room a name before starting the game:");
    while (roomId === "") {
        roomId = prompt("Your room name cannot be left blank. Please enter a room name:");
    }
    socket.emit("start", { roomId: roomId });
    changeRoomSetup();
});

function changeRoomSetup() {
    start.style.display = "none";
    document.getElementById("room-name").textContent = `(Room: ${roomId})`;
    document.getElementById("room-greeting").textContent = `Time to vote!`;
    selections.style.display = "block";
};

document.querySelectorAll(".vote-btn").forEach(item => {
    item.addEventListener("click", () => {
        socket.emit("vote", { value: `${item.textContent}`, roomId: roomId });
    });
});

socket.on('currentVotes', (currentVotes) => {
    console.log(currentVotes)
})