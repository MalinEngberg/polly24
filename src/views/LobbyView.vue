<template>
  <div class="lobby-view">

    <button id="language-button" v-on:click="switchLanguage">
      {{ uiLabels.changeLanguage }}
    </button>

    <div class="input-field" v-if="!$route.params.gamePin">
      <button id="go-back-button" v-on:click="goBack">
        {{ uiLabels.goBack }}
      </button>

      <h1>{{ uiLabels.enterGame }}</h1>

      <input type="text" v-bind:placeholder="uiLabels.nameInsert" v-model="name">
      <p v-if="nameError" class="error">{{ nameError }}</p>

      <input type="text" placeholder="Game Pin" v-model="gamePin">
      <p v-if="gamePinError" class="error">{{ gamePinError }}</p>

      <br>
      <button v-on:click="tryJoinGame">
        {{ uiLabels.participateInGame }}
      </button>
    </div>
    <div v-else>
      <h1>{{ uiLabels.waitLabel }}</h1>
      <p>[{{participants.map(p => p.name).join(', ')}}]</p>
      <p>{{ uiLabels.welcomeGame }} {{ gamePin }}</p>

      <button v-on:click="startDraw" id="goToDrawLink">
        {{ uiLabels.goToDraw }}
      </button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));

export default {
  name: 'LobbyView',
  data: function () {
    return {
      name: this.$route.query.name || "",
      gamePin: this.$route.params.gamePin || "",
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      nameError: '',
      gamePinError: ''
    }
  },
  created: function () {
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.on("participantsUpdate", p => {
      this.participants = p;
    });

    socket.on("gameStarted", () => {
      console.log("GAME STARTED")
      this.$router.push({
        path: `/draw/${this.gamePin}`,
        query: { name: this.name }
      });
    }),

      socket.on("gameExists", (exists) => {
        if (exists) {
          this.joinGame();
        }
        else {
          this.gamePinError = this.uiLabels.gamePinNotExistError;
        }
      });

    socket.emit("getUILabels", this.lang);

    if (this.$route.params.gamePin) {
      this.gamePin = this.$route.params.gamePin;
      socket.emit("joinGame", { gamePin: this.gamePin });
      socket.emit("getParticipants", { gamePin: this.gamePin });
    }
  },
  methods: {
    tryJoinGame: function () {
      this.nameError = "";
      this.gamePinError = "";

      if (!this.name) {
        this.nameError = this.uiLabels.nameError;
        return;
      }
      if (!this.gamePin) {
        this.gamePinError = this.uiLabels.gamePinError;
        return;
      }
      if (this.nameError || this.gamePinError) return;

      socket.emit("gameExists", { gamePin: this.gamePin });
    },

    joinGame: function () {
      socket.emit("participateInGame", { gamePin: this.gamePin, name: this.name });
      this.$router.push('/lobby/' + this.gamePin);
    },

    startDraw() {
      console.log("Start game clicked")
      socket.emit("startGame", { gamePin: this.gamePin })
    },

    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("getUILabels", this.lang);
    },

    goBack: function () {
      this.$router.push("/");
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

@media screen and (max-width:600px) {
  .input-field h1 {
    font-size: 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.input-field input {
  background-color: #AA87BF;
  font-size: 1.5rem;
  color: black;
  padding: 0.5rem;
  margin-bottom: 2rem;
  width: 30rem;
  border: 6px solid black;
  border-radius: 15px;
}

@media screen and (max-width:600px) {
  .input-field input {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20rem;
  }
}

.input-field button {
  background-color: #39FF14;
  border: 2px solid black;
  padding: 20px 90px;
  border-radius: 100px;
  cursor: pointer;
  gap: 10px;
  font-size: 1.5rem;
  font-family: 'Caveat', cursive;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

#go-back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;

  color: black;
  text-decoration: none;
  padding: 0.25rem 1rem;
  background-color: rgb(224, 151, 255);
  border: 2px solid #FF1493;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: bold;
  line-height: 2rem;
}

.error {
  color: red;
  font-weight: bold;
  font-family: "Times New Roman";
  font-size: 1rem;
  grid-column: 2 / span 1;
  text-align: left;
  margin-top: -20px;
  margin-bottom: 20px;
}

#goToDrawLink {
  background-color: #39FF14;
  padding: 20px 90px;
  border-radius: 100px;
}

#language-button {
  position: absolute;
  top: 1rem;
  right: 1rem;

  color: black;
  text-decoration: none;
  padding: 0.25rem 1rem;
  background-color: rgb(224, 151, 255);
  border-radius: 999px;
  font-size: 1rem;
  font-family: 'Caveat', cursive;
  font-weight: bold;
  line-height: 2rem;
}
</style>
