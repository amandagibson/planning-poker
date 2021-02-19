'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('A user just connected.');

    socket.on("start", ({ roomId }) => {
        socket.join(roomId)
    })

    socket.on("vote", (vote) => {
        // do something with vote

        socket.to("roomid56").emit("vote-update", {
            'adams vote': 5,
            'amandas vote': 3
        })
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});