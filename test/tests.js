const ioClient = require('socket.io-client');
const chai = require('chai');
const assert = chai.assert;

// Run server
const { server } = require('../server/server');

const socketUrl = 'http://127.0.0.1:3000';
const options = {
    'force new connection': true,
};

describe('Client', () => {
    const roomId = 'test';
    let client1;
    let client2;

    beforeEach(() => {
        client1 = ioClient.connect(socketUrl, options);
        client2 = ioClient.connect(socketUrl, options);
    });

    afterEach(() => {
        client1.close();
        client2.close();
    });

    after(() => {
        server.close();
    });

    it('should receive votes on start', done => {
        client1.emit('start', { roomId: roomId });
        client1.on('currentVotes', currentVotes => {
            assert.deepEqual(currentVotes, []);
            done();
        });
    });

    it('should receive currentVotes when voting', done => {
        client1.emit('start', { roomId: roomId });
        client1.emit('vote', { value: '3', roomId: roomId });
        client1.on('currentVotes', currentVotes => {
            if (currentVotes.length == 0) return; // Ignore first update from the start message
            assert.deepEqual(currentVotes, ['3']);
            done();
        });
    });

    it('should broadcast votes to other clients', done => {
        client1.emit('start', { roomId: roomId });
        client2.emit('start', { roomId: roomId });
        client1.emit('vote', { value: '3', roomId: roomId });
        client2.on('currentVotes', currentVotes => {
            if (currentVotes.length == 0) return; // Ignore first update from the start message
            assert.deepEqual(currentVotes, ['3']);
            done();
        });
    });
});