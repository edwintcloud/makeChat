const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;
const controllers = require('./controllers');
const io = require('socket.io')(server);

// socket.io connection
io.on("connection", (socket) => {
  console.log("🔌 New user connected! 🔌");

  // Listen for "new user" socket emits
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat! ✋`);
  });

  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    //Send the username to all clients currently connected
    io.emit("new user", username);
  });

  //Listen for new messages
  socket.on('new message', (data) => {
    // Send that data back to ALL clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
    io.emit('new message', data);
  })
})

// set view engine to ejs
app.set('view engine', 'ejs');

// setup express to serve static assets
app.use('/assets', express.static('assets'));

// setup express to use controllers
app.use(controllers);

// start http server
server.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

