'use strict';
import {readFileSync} from "fs";

function Data() {
  this.games = {};
}

Data.prototype.gameExists = function (gamePin) {
  return typeof this.games[gamePin] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.getUIWords = function (lang) {
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const words = readFileSync("./server/data/words-" + lang + ".json");
  return JSON.parse(words);
}

Data.prototype.createGame = function(gamePin, lang="en") {
  if (!this.gameExists(gamePin)) {
    let game = {};
    game.lang = lang;  
    game.participants = [];            
    this.games[gamePin] = game;
    console.log("game created", gamePin, game);
  }
  return this.games[gamePin];
}

Data.prototype.getGame = function(gamePin) {
  if (this.gameExists(gamePin)) {
    return this.games[gamePin];
  }
  return {};
}


Data.prototype.participateInGame = function(gamePin, name) {
  if (this.gameExists(gamePin)) {
    this.games[gamePin].participants.push({
      name: name,
      score: 0,
      gamePin: gamePin,
    });
    console.log("participants now:", this.games[gamePin].participants);
  }
}

Data.prototype.getParticipants = function(gamePin) {
  console.log("participants requested for", gamePin);
  if (this.gameExists(gamePin)) { 
    return this.games[gamePin].participants
  }
  return [];
}

Data.prototype.removeParticipant = function(gamePin, name) {
  if (!this.gameExists(gamePin)) return;

  const newParticipants = []

  for (let i = 0; i <this.games[gamePin].participants.length; i++) {
    const participant = this.games[gamePin].participants[i];
    if (participant.name !== name){
        newParticipants.push(participant);
    }
  }
  this.games[gamePin].participants = newParticipants
}

Data.prototype.removeGame = function(gamePin) {
    delete this.games[gamePin];
}

Data.prototype.getCurrentDrawer = function(gamePin) {
  const participants = this.getParticipants(gamePin);
  const randomIndex = Math.floor(Math.random() * participants.length);
  const currentDrawer = participants[randomIndex].name;
  console.log("CurrentDrawer:", currentDrawer);
  return currentDrawer;
}

Data.prototype.addScore = function(gamePin, name) {
  const participants = this.getParticipants(gamePin);
  for (const p of participants) {
    if (p.name === name) {
      p.score += 10;
      console.log("Uppdaterad score:", p.score);
    }
  }
}

export { Data };



