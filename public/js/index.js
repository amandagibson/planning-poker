'use strict';

const socket = io();
let roomId;

document.getElementById("start").addEventListener("click", () => {
    roomId = prompt("Please give your room a name before starting the game:");
    socket.emit("start", { roomId: roomId });
    changeRoomSetup();
})

function changeRoomSetup() {
    start.style.display = "none";
    document.getElementById("room-name").textContent = `(Room: ${roomId})`;
    document.getElementById("room-greeting").textContent = `Time to vote!`;
    document.getElementById("page-image").src = "/../zhearts.png";
}