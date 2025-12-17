function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createGame', function(d) {
    data.createGame(d.gamePin, d.lang)
    socket.emit('pollData', data.getPoll(d.gamePin));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.gamePin, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.activateQuestion(d.gamePin));
  });

  socket.on('joinGame', function(gamePin) {
    socket.join(gamePin);
    socket.emit('questionUpdate', data.activateQuestion(gamePin))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(gamePin));
  });

  socket.on('participateInGame', function(d) {
    data.participateInGame(d.gamePin, d.name, d.joined);
    io.to(d.gamePin).emit('participantsUpdate', data.getParticipants(d.gamePin));
  });

  socket.on("joinLobbyAsHost", data => {socket.emit("hostJoined", true)});

  socket.on('startPoll', function(gamePin) {
    io.to(gamePin).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.activateQuestion(d.gamePin, d.questionNumber);
    io.to(d.gamePin).emit('questionUpdate', question);
    io.to(d.gamePin).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.gamePin));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.gamePin, d.answer);
    io.to(d.gamePin).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.gamePin));
  }); 

  socket
}

export { sockets };