const ioClient = require('socket.io-client');
const chai = require('chai');
const assert = chai.assert;

// Run server
require('../server/server');

const socketUrl = 'http://127.0.0.1:3000';
const options = {
    'force new connection': true,
};

describe('Client', () => {
    const roomId = 'test';
    let client;

    beforeEach(() => {
        client = ioClient.connect(socketUrl, options);
    });

    afterEach(() => {
        client.close();
    });

    it('should receive votes on start', done => {
        client.emit('start', { roomId: roomId });
        client.on('currentVotes', currentVotes => {
            assert.deepEqual(currentVotes, []);
            done();
        });
    });
});