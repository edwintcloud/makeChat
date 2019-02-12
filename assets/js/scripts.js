// connect to socket.io server
const socket = io.connect();

// keep track of current user
let currentUser;

window.onload = () => {
  socket.emit("get online users");

  //Each user should be in the general channel by default.
  socket.emit("user changed channel", "General");

  socket.on("get online users", data => {
    for (var username in data.users) {
      document.querySelector(
        ".usersOnline"
      ).innerHTML += `<p class="userOnline">${username}</p>`;
    }
    // update channels to show currently created channels
    for (var channel in data.channels) {
      if (channel == "General") continue;
      document.querySelector(
        ".channels"
      ).innerHTML += `<div class="channel">${channel}</div>`;
    }
  });

  //Users can change the channel by clicking on its name.
  $(document).on("click", ".channel", e => {
    let newChannel = e.target.textContent;
    socket.emit("user changed channel", newChannel);
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
    const channel = $(".channel-current").text();
    const element = document.getElementById("chatInput");
    const message = element.value;
    console.log(channel);
    console.log(message);
    console.log(currentUser);
    if (message.length > 0) {
      //Emit to the server the new user
      socket.emit("new message", {
        sender: currentUser,
        message: message,
        channel: channel
      });
      element.value = "";
    }
  });

  //socket listeners
  socket.on("new user", data => {
    // add the new user to the .usersOnline div
    document.querySelector(
      ".usersOnline"
    ).innerHTML += `<div class="userOnline">${data}</div>`;
  });

  //Output the new message
  socket.on("new message", data => {
    let currentChannel = $(".channel-current").text();
    if (currentChannel == data.channel) {
      $(".messageContainer").append(`
      <div class="message">
        <p class="messageUser">${data.sender}: </p>
        <p class="messageText">${data.message}</p>
      </div>
    `);
    }
  });

  //Refresh the online user list
  socket.on("user has left", onlineUsers => {
    document.querySelector(".usersOnline").innerHTML = "";
    for (username in onlineUsers) {
      document.querySelector(".usersOnline").innerHTML += `<p>${username}</p>`;
    }
  });

  socket.on("new channel", newChannel => {
    document.querySelector(
      ".channels"
    ).innerHTML += `<div class="channel">${newChannel}</div>`;
  });

  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on("user changed channel", data => {
    document.querySelector(".channel-current").classList.add("channel");
    document
      .querySelector(".channel-current")
      .classList.remove("channel-current");
    document.querySelectorAll(".channel").forEach(el => {
      if (el.innerHTML == data.channel) {
        el.classList.add("channel-current");
      }
    });
    document.querySelector(".channel-current").classList.remove("channel");
    document.querySelector(".messageContainer").innerHTML = "<h2>Messages</h2>";
    data.messages.forEach(message => {
      document.querySelector(".messageContainer").innerHTML += `
      <div class="message">
        <p class="messageUser">${message.sender}: </p>
        <p class="messageText">${message.message}</p>
      </div>
    `;
    });
  });
};

function createChannel() {
  const newChannel = document.getElementById("newChannelInput").value;
  if (newChannel.length > 0) {
    socket.emit("new channel", newChannel);
    document.getElementById("newChannelInput").value = "";
  }
}
