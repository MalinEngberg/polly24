function sockets(io, socket, data) {

  socket.on('getUILabels', function (lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('getUIWords', function (lang) {
    socket.emit('uiWords', data.getUIWords(lang));
  });

  socket.on('gameExists', function(d) {
    const gameExists = data.gameExists(d.gamePin);
    console.log("Existerar spelet redan?", gameExists);
    socket.emit('gameExists', gameExists);
  });

  socket.on('createGame', function(d) {
    data.createGame(d.gamePin, d.lang)
    socket.emit('gameData', data.getGame(d.gamePin));
  });

  socket.on('joinGame', function (d) {
    if (d && d.gamePin) {
      socket.join(d.gamePin);
      console.log('socket joined room', d.gamePin);
    }
  });

  socket.on('leaveGame', function (d) {
     if (d && d.gamePin && d.name) {
        console.log("nu är vi i leaveGame i socket")

        data.removeParticipant(d.gamePin, d.name);

        const participants = data.getParticipants(d.gamePin);
        io.to(d.gamePin).emit('participantsUpdate', participants);

        socket.leave(d.gamePin);

        console.log("lämnar spelet:", d.name, "Och participants kvar:", participants)

        if(participants.length === 0) {
            data.removeGame(d.gamePin);
        }
     }
  });


  socket.on('participateInGame', function (d) {
    socket.join(d.gamePin);
    data.participateInGame(d.gamePin, d.name);

    const participants = data.getParticipants(d.gamePin);
    io.to(d.gamePin).emit('participantsUpdate', participants);

    console.log("participant added to gamePin:", data.getParticipants(d.gamePin));

  });

  socket.on('startGame', function (d) {
    io.to(d.gamePin).emit('gameStarted');
    console.log("Game started for room:", d.gamePin)
  });

  socket.on('getParticipants', (d) => {
    const participants = data.getParticipants(d.gamePin);
    console.log("Sending participants for", d.gamePin, ":", participants);
    socket.emit('participantsUpdate', participants);
  });

  socket.on('getCurrentDrawer', (d) => {
    const currentDrawer = data.getCurrentDrawer(d.gamePin);
    console.log("Currentdrawer i socket är", currentDrawer);
    io.to(d.gamePin).emit("currentDrawer", currentDrawer);
  });

  socket.on("newMessage", d => {
    const message = d.currentMessage;
    io.to(d.gamePin).emit("messageReceived", { sender: d.sender, message: message });
    console.log("New message in gamePin", d.gamePin, "from", d.sender, ":", message);
  });

  socket.on("currentWord", d => {
    const currentWord = d.currentWord;
    io.to(d.gamePin).emit("currentWord", currentWord);
    console.log("Current word sending to all:", currentWord);
  });

  socket.on("addScore", d => {
    data.addScore(d.gamePin, d.name);
    const participants = data.getParticipants(d.gamePin);
    console.log("Uppdaterad participants:", participants);
    io.to(d.gamePin).emit('participantsUpdate', participants);
    console.log("Nu har addScore körts i sockets");
  });

  socket.on("drawing", (data) => {
    socket.to(data.gamePin).emit("drawing", data);
  });

  socket.on("clearCanvas", (d) => {
    io.to(d.gamePin).emit("clearCanvas");
  })
}

export { sockets };