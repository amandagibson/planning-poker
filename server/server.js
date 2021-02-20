"use strict";

const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;

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

let amountOfVotesPerChoice = [];


app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});


io.on("connection", (socket) => {
    console.log("A user just connected.");

    socket.on("start", ({ roomId }) => {
        socket.join(roomId)
            //if there is no history for the room, we want to create a new map.
        if (!history.has(roomId)) {
            history.set(roomId, new Map())
        }
        // //fetch history
        socket.emit("previousVotes", amountOfVotesPerChoice);
    })

    socket.on("vote", (vote) => {
        //add votes to room history, overwrite the vote if the clientid already exists with a vote in the room.
        socket.to(vote.roomId).emit("vote-update", vote.value);
        let roomHistory = history.get(vote.roomId);
        roomHistory.set(socket.client.id, vote.value);
        console.log(history)
            //create an array of values that can be sent back to the client
        amountOfVotesPerChoice = Array.from(roomHistory.values());
        console.log(amountOfVotesPerChoice);
    })
});

// show votes on front end

// add a way to clear the history when no client id can be found. (vote again button?)