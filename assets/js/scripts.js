window.onload = () => {
  // connect to socket.io server
  const socket = io.connect();

  // keep track of current user
  let currentUser;

  socket.emit("get online users");

  socket.on("get online users", onlineUsers => {
    for (username in onlineUsers) {
      document.querySelector(
        ".usersOnline"
      ).innerHTML += `<p class="userOnline">${username}</p>`;
    }
  });

  // create user onclick
  document.getElementById("createUserBtn").addEventListener("click", e => {
    e.preventDefault();
    const element = document.getElementById("usernameInput");
    currentUser = element.value;
    if (currentUser.length > 0) {
      //Emit to the server the new user
      socket.emit("new user", currentUser);
      const form = document.querySelector(".usernameForm");
      form.parentNode.removeChild(form);
      // make main page visible
      document.querySelector(".mainContainer").style.display = "flex";
    }
  });

  // sendchat onclick
  document.getElementById("sendChatBtn").addEventListener("click", e => {
    e.preventDefault();
    const element = document.getElementById("chatInput");
    const message = element.value;
    if (message.length > 0) {
      //Emit to the server the new user
      socket.emit("new message", {
        sender: currentUser,
        message: message
      });
      element.value = "";
    }
  });

  //socket listeners
  socket.on("new user", username => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    // add the new user to the .usersOnline div
    document.querySelector(
      ".usersOnline"
    ).innerHTML += `<div class="userOnline">${username}</div>`;
  });

  //Output the new message
  socket.on("new message", data => {
    document.querySelector(".messageContainer").innerHTML += `
    <div class="message">
      <p class="messageUser">${data.sender}: </p>
      <p class="messageText">${data.message}</p>
    </div>
  `;
  });

  //Refresh the online user list
  socket.on("user has left", onlineUsers => {
    document.querySelector(".usersOnline").innerHTML = "";
    for (username in onlineUsers) {
      document.querySelector(".usersOnline").innerHTML += `<p>${username}</p>`;
    }
  });
};
