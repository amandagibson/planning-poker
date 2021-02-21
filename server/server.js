'use strict';

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

let history = new Map();
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

function getRoomVotes(roomId) {
    ensureRoomHistory(roomId);
    return Array.from(history.get(roomId).values());
}

function setVote(roomId, clientId, value) {
    ensureRoomHistory(roomId);
    const roomHistory = history.get(roomId);
    roomHistory.set(clientId, value);
}

function resetVotes(roomId) {
    history.set(roomId, new Map());
}

function ensureRoomHistory(roomId) {
    if (!history.has(roomId)) {
        history.set(roomId, new Map());
    }
}

function broadcastVotes(roomId) {
    io.in(roomId).emit('currentVotes', getRoomVotes(roomId));
}

io.on('connection', socket => {
    console.log('A user just connected.');

    socket.on('start', ({ roomId }) => {
        socket.join(roomId);
        socket.emit('currentVotes', getRoomVotes(roomId));
    });

    socket.on('vote', ({ roomId, value }) => {
        setVote(roomId, socket.client.id, value);
        io.in(roomId).emit('currentVotes', getRoomVotes(roomId));
    });

    socket.on('resetVotes', ({ roomId }) => {
        resetVotes(roomId);
        broadcastVotes(roomId);
    });

    socket.on('disconnect', reason => {
        // Remove the client's vote on disconnection
        history.forEach((room, roomId) => {
            if (room.has(socket.client.id)) {
                room.delete(socket.client.id);
                if (room.size > 0) {
                    broadcastVotes(roomId);
                } else {
                    history.delete(roomId);
                }
            }
        });
    });
});

exports.server = io;