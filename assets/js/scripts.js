window.onload = () => {

  // connect to socket.io server
  const socket = io.connect();

  // create user onclick
  document.getElementById("createUserBtn").addEventListener('click', (e) => {
    e.preventDefault();
    const element = document.getElementById("usernameInput");
    const username = element.value;
    if(username.length > 0){
      //Emit to the server the new user
      socket.emit('new user', username);
      element.parentNode.removeChild(element);
    }
  });

  //socket listeners
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
  });
  
};