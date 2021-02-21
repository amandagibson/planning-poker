# Planning Poker

A single-page web application that developers can use when estimating the complexity of stories.

Before starting the vote you are prompted to enter a room name. Share this with your teammates to ensure you're all voting within the same room.

You can only vote once, but you can change your vote by clicking on a different value button. All results are shown in real-time and the number of votes a value has is shown above each button; this increases or decreases dependant upon what you or your teammates vote.

To move onto the next story, someone in the room clicks `Reset votes` and the values are cleared.

When all members leave the room, the room history is cleared.

Built by: [Amanda Gibson](https://github.com/amandagibson)

Deployed with Heroku at https://amandas-planning-poker.herokuapp.com/

# Getting Started:

Under the repository name, click Clone or download. Copy the clone URL for the repository. Open Terminal. Change the current working directory to the location where you want the cloned directory to be made.

`git clone https://github.com/amandagibson/planning-poker.git`

# Installation:

run `npm install` in the terminal to install dependencies.

# Available Scripts:

In the project directory, you can run:

`npm start`

This allows the application to run locally. <br>
Navigate to [http://localhost:3000](http://localhost:3000) in the browser to view.

`npm test`

Will run tests (server logs are visible when running tests)

---

# Built with:

[node.js](https://nodejs.org/en/), [socket.io](https://socket.io/) & [express](https://expressjs.com/)

# Tested with:

[mocha](https://mochajs.org/) & [chai](https://www.chaijs.com/)
