const express = require("express");
const app = express();
const server = require("http").Server(app);
const port = process.env.PORT || 3000;
const controllers = require("./controllers");
const io = require("socket.io")(server);

//We'll store our online users here
let onlineUsers = {};

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
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);
    io.emit("new message", data);
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
