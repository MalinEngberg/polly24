<template>
  <div class="lobby-view">

    <div class="input-field" v-if="!joined">
      <h1>{{ uiLabels.enterGame }}</h1>

      <input
        type="text"
        v-bind:placeholder= "uiLabels.nameInsert"
        v-model="userName">

      <input 
        type="text"
        placeholder="Game Pin"
        v-model="gamePin">

      <br>
      <button v-on:click="participateInPoll">
        {{ this.uiLabels.participateInGame }}
      </button>
    </div>
  <div v-if="joined">
    <h1>Waiting for host to start game!</h1>
    {{ participants }}
      <router-link to="/lobby/" id="createGame">
        
      </router-link>
  </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'LobbyView',
  data: function () {
    return {
      userName: "",
      gamePin: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: []
    }
  },
  created: function () {
    this.userName = localStorage.getItem("userName") || "";
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.on( "hostJoined", () => {this.joined = true});
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit( "participateInPoll", {pollId: this.gamePin, name: this.userName} )
      this.joined = true;
    } 
  }

}
</script>

<style scoped>

.lobby-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
  padding: 20px;
  box-sizing: border-box
}

.input-field {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-field h1 {
  margin: 70px;
  font-size: 50px;
}

.input-field input {
  background-color: #AA87BF;
  font-size: 1.5rem;
  color: black;
  padding: 0.5rem;
  margin-bottom: 2rem;
  width: 30rem;
  /*text-align: center;*/
  border: 6px solid black;
  border-radius: 15px;
}
.input-field button {
  background-color: #514ace;
  border: 2px solid #FF1493;
  padding: 20px 90px;
  border-radius: 100px;
  cursor: pointer;
  gap: 10px;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap:10px;
  font-weight: bold;
}
</style>
