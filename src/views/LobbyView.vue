<template>
  <div>
    {{gamePin}}
    <div v-if="!joined">
      <input type="text" v-model="userName">
      <button v-on:click="participateInPoll">
        {{ this.uiLabels.participateInGame }}
      </button>
    </div>
  <div v-if="joined">
    <!--<p>Waiting for host to start poll</p>
    {{ participants }}-->
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
      gamePin: "inactive poll",
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
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.gamePin) );
    socket.emit( "joinPoll", this.gamePin );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit( "participateInPoll", {gamePin: this.gamePin, name: this.userName} )
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
  color: black;
  font-size: 1.5rem;
  font-family: 'Caveat', cursive;
  width: 15rem;;
  padding: 0.5rem 2rem;
  border: 3px solid rgb(213, 69, 206);
  border-radius: 50%; /*är det snyggare med mer fyrkantigt men rundade hörn? kanske mer likt en knapp?*/
  cursor: pointer;
}
</style>
