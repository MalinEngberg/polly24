function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createGame', function(d) {
    data.createGame(d.gamePin, d.lang)
    socket.emit('pollData', data.getGame(d.gamePin));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.gamePin, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.activateQuestion(d.gamePin));
  });

  socket.on('joinGame', function(gamePin) {
    socket.join(gamePin);
    //socket.emit('questionUpdate', data.activateQuestion(gamePin))
    //socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(gamePin));
  });

  socket.on('participateInGame', function(d) {
    socket.join(d.gamePin);
    data.participateInGame(d.gamePin, d.name, socket.id);
    
    const participants = data.getParticipants(d.gamePin);
    io.to(d.gamePin).emit('participantsUpdate', participants);

    console.log("participant added to gamePin:", data.getParticipants(d.gamePin));
  
    //data.participateInGame(d.gamePin, d.name, socket.id);
    //io.to(d.gamePin).emit('participantsUpdate', participants);

    if (participants.length === 1) {startRound(io, data, d.gamePin);}
  });

  socket.on('startGame', function(d){
    //const participants = data.getParticipants(gamePin)
    io.to(d.gamePin).emit('gameStarted');
    // startRound(io, data, d.gamePin);

    console.log("Game started for room:", d.gamePin)
    console.log("Participants are", d.participants)
  })

  socket.on('getparticipants', (d) =>{
     const participants = data.getParticipants(d.gamePin);
     socket.emit('participantsUpdate', participants);
  });

  //socket.on("joinLobbyAsHost", data => {socket.emit("hostJoined", true)});

  //socket.on('startPoll', function(gamePin) {io.to(gamePin).emit('startPoll');})

  socket.on('runQuestion', function(d) {
    let question = data.activateQuestion(d.gamePin, d.questionNumber);
    io.to(d.gamePin).emit('questionUpdate', question);
    io.to(d.gamePin).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.gamePin));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.gamePin, d.answer);
    io.to(d.gamePin).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.gamePin));
  }); 

 socket.on("guess", d => {
  const poll = data.getGame(d.gamePin);
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

function startRound(io, data, gamePin) {
  const poll = data.getGame(gamePin);
  if (!poll) return;

  poll.currentWord = "apple"; // replace with random later
  poll.timeLeft = 30;
  poll.isRunning = true;

  if (!poll.participants.length) return;

  const drawer = poll.participants[0];
  drawer.drawer = true;
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

  socket
}

export { sockets };