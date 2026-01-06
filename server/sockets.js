function sockets(io, socket, data) {

  socket.on('getUILabels', function (lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createGame', function (d) {
    data.createGame(d.gamePin, d.lang);
    socket.emit('pollData', data.getPoll(d.gamePin));
  });

  socket.on('addQuestion', function (d) {
    data.addQuestion(d.gamePin, { q: d.q, a: d.a });
    socket.emit('questionUpdate', data.activateQuestion(d.gamePin));
  });

  /* socket.on('joinGame', function(gamePin) {
    socket.join(gamePin);
    //socket.emit('questionUpdate', data.activateQuestion(gamePin))
    //socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(gamePin));
  }); */

  socket.on('joinGame', function (d) {
    // was: socket.on('joinGame', function(gamePin) { socket.join(gamePin); });
    // expect an object { gamePin }
    if (d && d.gamePin) {
      socket.join(d.gamePin);
      console.log('socket joined room', d.gamePin);
    }
  });

  socket.on('participateInGame', function (d) {
    socket.join(d.gamePin);
    data.participateInGame(d.gamePin, d.name);

    const participants = data.getParticipants(d.gamePin);
    io.to(d.gamePin).emit('participantsUpdate', participants);

    console.log("participant added to gamePin:", data.getParticipants(d.gamePin));

    //data.participateInGame(d.gamePin, d.name, socket.id);
    //io.to(d.gamePin).emit('participantsUpdate', participants);

    //if (participants.length === 1) {
    //  startRound(io, data, d.gamePin);
  });

  socket.on('startGame', function (d) {
    //const participants = data.getParticipants(gamePin)
    io.to(d.gamePin).emit('gameStarted');
    console.log("Game started for room:", d.gamePin)
  })
  socket.on('iCreated', function (d) {
    socket.emit("iCreated", data.getParticipants(d.gamePin));
    console.log("Emitted iCreated for room:", d.gamePin)
  });


  socket.on('getParticipants', (d) => {
    const participants = data.getParticipants(d.gamePin);
    console.log("Sending participants for", d.gamePin, ":", participants);
    socket.emit('participantsUpdate', participants);
  });

  //socket.on("joinLobbyAsHost", data => {socket.emit("hostJoined", true)});

  socket.on('startPoll', function (gamePin) {
    io.to(gamePin).emit('startPoll');
  })
  socket.on('runQuestion', function (d) {
    let question = data.activateQuestion(d.gamePin, d.questionNumber);
    io.to(d.gamePin).emit('questionUpdate', question);
    io.to(d.gamePin).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.gamePin));
  });

  socket.on('submitAnswer', function (d) {
    data.submitAnswer(d.gamePin, d.answer);
    io.to(d.gamePin).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.gamePin));
  });

  socket.on("guess", d => {
    const poll = data.getPoll(d.gamePin);
    if (!poll || !poll.isRunning) return;

    if (d.guess.toLowerCase() === poll.currentWord) {
      clearInterval(poll.timer);
      poll.isRunning = false;

      const result = data.onCorrectGuess(
        d.gamePin,
        d.playerName,
        poll.timeLeft
      );

      io.to(d.gamePin).emit("correctGuess", result);
      io.to(d.gamePin).emit("roundEnded");
    }
  });

  socket.on("newMessage", d => {
    const message = d.currentMessage;
    io.to(d.gamePin).emit("messageReceived", { sender: d.sender, message: message });
    console.log("New message in gamePin", d.gamePin, "from", d.sender, ":", message);
  });

  function startRound(io, data, gamePin) {
    const poll = data.getPoll(gamePin);
    if (!poll) return;

    poll.currentWord = "apple"; // replace with random later
    poll.timeLeft = 30;
    poll.isRunning = true;

    if (!poll.participants.length) return;

    const drawer = poll.participants[0];
    poll.drawerSocketId = drawer.socketId;

    io.to(gamePin).emit("roundStarted", {
      drawer: drawer.socketId,
      word: poll.currentWord,
      timeLeft: poll.timeLeft
    });

    poll.timer = setInterval(() => {
      poll.timeLeft--;
      io.to(gamePin).emit("timerUpdate", poll.timeLeft);

      if (poll.timeLeft <= 0) {
        clearInterval(poll.timer);
        poll.isRunning = false;
        io.to(gamePin).emit("roundEnded");
      }
    }, 1000);
  }

  socket.on("drawing", (data) => {
    // Broadcast drawing data to all other clients in the same game room
    socket.to(data.gamePin).emit("drawing", data);
  });


  socket
}

export { sockets };