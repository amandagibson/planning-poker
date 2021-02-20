"use strict";

const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));


let history = new Map(
    // roomId => [
    //     clientId => vote,
    //     clientId => vote,
    //     clientId => vote,
    // ],
    // roomId => [
    //     clientid => vote,
    //     clientId => vote,
    //     clientId => vote,
    // ]
);

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

function getRoomVotes(roomId) {
    return Array.from(history.get(roomId).values());
}

function setVote(roomId, clientId, value) {
    const roomHistory = history.get(roomId);
    roomHistory.set(clientId, value);
}

function createRoomHistory(roomId) {
    if (!history.has(roomId)) {
        history.set(roomId, new Map())
    }
}


io.on("connection", (socket) => {
    console.log("A user just connected.");

    socket.on("start", ({ roomId }) => {
        socket.join(roomId)
        createRoomHistory(roomId);
        //fetch history upon entering room
        socket.emit("currentVotes", getRoomVotes(roomId));
    })

    socket.on("vote", (vote) => {
        setVote(vote.roomId, socket.client.id, vote.value);
        console.log(history)
        io.in(vote.roomId).emit("currentVotes", getRoomVotes(vote.roomId));
    })
});