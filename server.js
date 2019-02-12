const express = require("express");
const app = express();
const server = require("http").Server(app);
const port = process.env.PORT || 3000;
const controllers = require("./controllers");
const io = require("socket.io")(server);

// We'll store our online users here
let onlineUsers = {};

// store channels
let channels = { General: [] };

// socket.io connection
io.on("connection", socket => {
  console.log("🔌 New user connected! 🔌");

  // Listen for "new user" socket emits
  socket.on("new user", username => {
    //Save the username as key to access the user's socket id
    onlineUsers[username] = socket.id;
    //Save the username to socket as well. This is important for later.
    socket["username"] = username;
    console.log(`✋ ${username} has joined the chat! ✋`);
    io.emit("new user", username);
  });

  //Listen for new messages
  socket.on("new message", data => {
    //Save the new message to the channel.
    channels[data.channel].push({ sender: data.sender, message: data.message });
    //Emit only to sockets that are in that channel room.
    io.to(data.channel).emit("new message", data);
  });

  socket.on("get online users", () => {
    //Send over the onlineUsers
    socket.emit("get online users", onlineUsers);
  });

  //This fires when a user closes out of the application
  socket.on("disconnect", () => {
    //This deletes the user by using the username we saved to the socket
    delete onlineUsers[socket.username];
    io.emit("user has left", onlineUsers);
  });

  socket.on("new channel", newChannel => {
    //Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = [];
    //Have the socket join the new channel room.
    socket.join(newChannel);
    //Inform all clients of the new channel.
    io.emit("new channel", newChannel);
    //Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });
});

// set view engine to ejs
app.set("view engine", "ejs");

// setup express to serve static assets
app.use("/assets", express.static("assets"));

// setup express to use controllers
app.use(controllers);

// start http server
server.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
