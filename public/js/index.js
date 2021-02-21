'use strict';

const socket = io();
let roomId;

const resetVotesButton = document.getElementById('reset-button');
resetVotesButton.style.display = 'none';

const voteResultsContainer = document.getElementById('vote-results-container');
voteResultsContainer.style.display = 'none';

document.getElementById('start').addEventListener('click', () => {
    roomId = prompt('Please give your room a name before starting the game:');
    while (roomId === '') {
        roomId = prompt(
            'Your room name cannot be left blank. Please enter a room name:'
        );
    }
    if (roomId != null) {
        socket.emit('start', { roomId: roomId });
        showVotingUI();
    }
});

function showVotingUI() {
    start.style.display = 'none';
    document.getElementById('room-name').textContent = `(Room: ${roomId})`;
    document.getElementById('room-greeting').textContent = `Time to vote!`;
    voteResultsContainer.style.display = 'block';
    resetVotesButton.style.display = 'block';
}

document.querySelectorAll('.vote-btn').forEach(item => {
    item.addEventListener('click', () => {
        socket.emit('vote', { value: item.textContent, roomId: roomId });
    });
});

resetVotesButton.addEventListener('click', () => {
    socket.emit('resetVotes', { roomId: roomId });
});

socket.on('currentVotes', currentVotes => {
    document.querySelectorAll('.vote-result').forEach(item => {
        item.innerHTML = null;
    });
    const voteCounts = new Map();
    for (const vote of currentVotes) {
        if (!voteCounts.has(vote)) {
            voteCounts.set(vote, 0);
        }
        voteCounts.set(vote, voteCounts.get(vote) + 1);
    }
    for (const [vote, count] of voteCounts.entries()) {
        document.getElementById(`vote-result-${vote}`).innerHTML = count.toString();
    }
});