'use strict';
import {readFileSync} from "fs";
import {GetPoints} from "../src/components/GetPoints.js";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
  this.polls['test'] = {
    lang: "en",
    questions: [
      {q: "How old are you?", 
       a: ["0-13", "14-18", "19-25", "26-35", "36-45","45-"]
      },
      {q: "How much do you enjoy coding?", 
       a: ["1", "2", "3", "4", "5"]
      }
    ],
    answers: [{}],
    currentQuestion: 0,
    participants: [{name: "Barbapappa", img: "/img/Barbapappa.png",score: 1200},]
  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (gamePin) {
  return typeof this.polls[gamePin] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(gamePin, lang="en") {
  if (!this.pollExists(gamePin)) {
    let poll = {};
    poll.lang = lang;  
    poll.questions = [];
    poll.answers = [];
    poll.participants = [];
    poll.currentQuestion = 0;              
    this.polls[gamePin] = poll;
    console.log("poll created", gamePin, poll);
  }
  return this.polls[gamePin];
}

Data.prototype.getPoll = function(gamePin) {
  if (this.pollExists(gamePin)) {
    return this.polls[gamePin];
  }
  return {};
}

Data.prototype.participateInPoll = function(gamePin, name) {
  console.log("participant will be added to", gamePin, name);
  if (this.pollExists(gamePin)) {
    this.polls[gamePin].participants.push({name: name, answers: []})
  }
}

Data.prototype.getParticipants = function(gamePin) {
  const poll = this.polls[gamePin];
  console.log("participants requested for", gamePin);
  if (this.pollExists(gamePin)) { 
    return this.polls[gamePin].participants
  }
  return [];
}

Data.prototype.addQuestion = function(gamePin, q) {
  if (this.pollExists(gamePin)) {
    this.polls[gamePin].questions.push(q);
  }
}

Data.prototype.activateQuestion = function(gamePin, qId = null) {
  if (this.pollExists(gamePin)) {
    const poll = this.polls[gamePin];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(gamePin) {
  if (this.pollExists(gamePin)) {
    const poll = this.polls[gamePin];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function(gamePin, answer) {
  if (this.pollExists(gamePin)) {
    const poll = this.polls[gamePin];
    let answers = poll.answers[poll.currentQuestion];
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.onCorrectGuess = function (gamePin, playerName, timeleft) {
  const poll = this.polls[gamePin];
  if (!poll) return { correct: false };

  const player = poll.participants.find(p => p.name === playerName);

  let points = 0;
  if (player) {
    points = GetPoints(30, timeleft, 1);
    player.score += points;
  }

  return {
    correct: true,
    playerName,
    points,
    participants: poll.participants
  };
}


export { Data };



