<template>
  <div>
    Poll link: 
    <input type="text" v-model="gamePin">
    <button v-on:click="createPoll">
      Create poll
    </button>
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer' + i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="startPoll">
      Start poll
    </button>
    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + gamePin">Check result</router-link>
    Data: {{ pollData }}
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      gamePin: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {gamePin: this.gamePin, lang: this.lang })
      socket.emit("joinPoll", this.gamePin);
    },
    startPoll: function () {
      socket.emit("startPoll", this.gamePin)
    },
    addQuestion: function () {
      socket.emit("addQuestion", {gamePin: this.gamePin, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {gamePin: this.gamePin, questionNumber: this.questionNumber})
    }
  }
}
</script>
