<template>
  <div class="lobby-view">

    <div class="input-field" v-if="!$route.params.gamePin">
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
      <button v-on:click="participateInGame">
        {{ uiLabels.participateInGame }}
      </button>
    </div>
    <div v-else>
      <h1>{{ uiLabels.waitLabel }}</h1>
      <p>[{{ participants.map(p => p.name).join(', ') }}]</p>

      <router-link to="/draw" id="goToDrawLink">
        {{ uiLabels.goToDraw }}
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
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      participants: []
    }
  },
  created: function () {
    this.userName = localStorage.getItem("userName") || "";
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    //socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );

    socket.on( "hostJoined", () => {this.joined = true});
    
    socket.emit( "getUILabels", this.lang );

    if (this.$route.params.gamePin) {
      this.gamePin = this.$route.params.gamePin;
      socket.emit("joinGame", this.gamePin);
      //socket.emit("participateInGame", { gamePin: this.gamePin, name: this.userName, joined: true });
  }
  },
  methods: {
    participateInGame: function () {
      localStorage.setItem("userName", this.userName);
      socket.emit( "participateInGame", {gamePin: this.gamePin, name: this.userName, joined: true } );
      this.$router.push('/lobby/'+ this.gamePin);
      //this.joined = true;
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
#goToDrawLink {
        /*display: inline-block;*/
        background-color: #39FF14;
        /*border: 2px solid #FF1493;*/
        padding: 20px 90px;
        border-radius: 100px;
        /*gap: 10px;*/
        /*font-size: 18px;*/
        /*align-items: center;*/
    } 

</style>
