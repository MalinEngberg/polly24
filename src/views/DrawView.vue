<template>
  <div class="page">
    <button id="language-button" v-on:click="switchLanguage">
      {{ uiLabels.changeLanguage }}
    </button>
    <div class="timer-bar">
      Time left: {{ timeLeft }}s
    </div>
    <div class="game-layout">

      <div class="left-column">
        <div class="players" v-for="p in participants" :key="p.name" :style="{ background: p.img }">
          <img :src="p.img" alt="Player Image" class="player-img" />
          <div class="player-score">{{ p.name }}: {{ p.score }}p
          </div>
        </div>
      </div>

      <div class="center-column">
        <div class="top-bar">
          <span class="word-display" v-if="currentDrawer === name"> {{ uiLabels.timeToPaint }}: {{ currentWord }}</span>
          <div v-else> {{ uiLabels.guessWord }}
            <span class="word-display" v-for="i in currentWord.length" :key="i">_</span>
          </div>
        </div>



        <div class="canvas-area">
          <canvas ref="canvas" @mousedown="drawerTool && drawerTool.start($event)"
            @mousemove="drawerTool && drawerTool.move($event)" @mouseup="drawerTool && drawerTool.stop($event)"
            @mouseleave="drawerTool && drawerTool.stop($event)">
          </canvas>
          <button v-if="currentDrawer === name" v-on:click="chooseRandomWord" id="chooseRandomWordButton">
            {{ uiLabels.chooseWord }}
          </button>
        </div>
      </div>


      <div class="right-column">

        <div class="tools-box" v-if="currentDrawer === name">
          <div class="colors">
            <div class="color" v-for="c in colors" :key="c" :style="{ background: c }"
              @click="drawerTool && drawerTool.getcolor(c)"></div>
          </div>
        </div>

        <div class="MessageDisplay">
          <ul v-for="msg in messages">
            <b>{{ msg.sender }}:</b> {{ msg.receivedMessage }}
          </ul>
        </div>

        <div class="InputChat">
          <input type="text" v-bind:placeholder="uiLabels.chatInput" v-model="currentMessage"
            @keydown.enter="sendMessage" />
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import { createCanvasDrawer } from "@/components/StartDraw.js";
import GetPoints from '../components/GetPoints';

export default {
  name: 'DrawView',
  data() {
    return {
      uiLabels: {},
      uiWords: {},
      lang: localStorage.getItem("lang") || "en",
      gamePin: this.$route.params.gamePin,
      name: this.$route.query.name,
      drawerTool: null,
      //SocketId: null,
      timeLeft: 0,
      canDraw: false,
      currentColor: "black",
      colors: ["black", "red", "green", "blue", "yellow"],
      participants: [],
      currentDrawer: "",
      currentGuess: "",
      currentWord: "",
      currentMessage: "",
      receivedMessage: "",
      sender: "",
      messages: []
    };
  },
  // CANVAS functions
  mounted() {
    // hämta uiLabels
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);

    // hämta words
    socket.on("uiWords", words => this.uiWords = words);
    socket.emit("getUIWords", this.lang);

    // make sure we are in the room (in case we navigated directly to draw view)
    socket.emit('joinGame', { gamePin: this.gamePin });
    socket.emit('getParticipants', { gamePin: this.gamePin });
    //socket.emit('participateInGame', { gamePin: this.gamePin, name: this.name });

    socket.on('participantsUpdate', (participants) => {
      this.participants = participants;
    });

    // hämta currentDrawer
    socket.on("currentDrawer", (currentDrawer) => { this.currentDrawer = currentDrawer; console.log("Nu är vi i drawView och vår ritare är", this.currentDrawer); });
    console.log("Vi är nu i DrawView och vill hitta currentDrawer för", this.gamePin);
    socket.emit("getCurrentDrawer", { gamePin: this.gamePin });

    socket.on("currentWord", (currentWord) => {
      this.currentWord = currentWord;
    })

    this.$nextTick(() => {
      const canvas = this.$refs.canvas;
      if (!canvas) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      this.drawerTool = createCanvasDrawer(canvas, () => this.currentDrawer === this.name, (data) => {
        // Emit drawing data to the server
        socket.emit("drawing", { gamePin: this.gamePin, ...data });
      });
    });

    // Listen for drawing events from other players
    socket.on("drawing", (data) => {
      const canvas = this.$refs.canvas;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(data.lastX, data.lastY);
      context.lineTo(data.x, data.y);
      context.strokeStyle = data.color;
      context.lineWidth = 4;
      context.stroke();
    });

    socket.on("messageReceived", data => {
      console.log("New message received from", data.sender, ":", data.message);
      // const formattedMessage = `${data.sender}: ${data.message}`;
      // this.messages.push(formattedMessage);
      this.messages.push({
        sender: data.sender,
        receivedMessage: data.message
      })
      // Here you can add logic to display the received message in the chat UI
    });
  },


  methods: {

    submitGuess() {
      const guess = this.currentGuess.trim();
      console.log(this.currentGuess);
      if (!guess) return;

      socket.emit("guess", {
        guess,
        gamePin: this.gamePin,
        playerName: this.name
      });

      this.currentGuess = "";
    },

    onCorrectGuess(data) {
      if (data.correct) {
        this.canDraw = false;

        //this.timer?.stopTimer?.();

        this.participants = data.participants;

        console.log(
          `${data.name} gained ${data.points} points`

        );
      }
    },
    sendMessage: function () {
      // Logic to send the message
      socket.emit("newMessage", { currentMessage: this.currentMessage, gamePin: this.gamePin, sender: this.name });
      console.log("Message sent:", this.currentMessage);
      if (this.currentMessage === this.currentWord) {
        console.log("vi har gissat rätt");
        this.addPoints();
        this.startNewRound();
      }
      this.currentMessage = ""; // Clear the input field after sending
    },

    chooseRandomWord: function () {
      console.log("Choosing a new word");
      const words = this.uiWords;
      const randomIndex = Math.floor(Math.random() * 10) + 1;
      const randomWord = words[randomIndex];
      console.log("Random index:", randomIndex, "words to choose from:", words, "Chosen word:", randomWord);
      this.currentWord = randomWord;
      socket.emit("currentWord", { currentWord: this.currentWord, gamePin: this.gamePin });
    },

    addPoints: function () {
      socket.emit('addPoints', { name: this.name, gamePin: this.gamePin });
    },

    startNewRound: function () {
      socket.emit("getCurrentDrawer", { gamePin: this.gamePin });
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
    }
  }
};

</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
  /* background: linear-gradient(#c8b7e8, #9c88c8); */
  min-height: 100vh;
}

/* MAIN LAYOUT (3 columns centered) */
.game-layout {
  margin-top: 4%;
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 80%;
  /* <<< entire game area is 70% of screen */
  min-width: 900px;
}

/* LEFT COLUMN: PLAYER LIST */
.left-column {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.players {
  background: white;
  border: 2px solid #aaa;
  text-align: center;
  padding-bottom: 5px;
}

.player-img {
  width: 100%;
  height: auto;
}

.player-score {
  background: #e9e9e9;
  padding: 5px 0;
  border-top: 2px solid #aaa;
}

/* CENTER COLUMN */
.center-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.timer-bar {
  background: white;
  display: flex;
  flex-direction: column;
  border: 2px solid #aaa;
  ;
  padding: 10px;
  margin-left: 120px;
  font-size: 20px;
  color: purple;
  font-weight: bold;
  text-align: center;
}

/* TOP BAR */
.top-bar {
  background: white;
  border: 2px solid #aaa;
  padding: 10px;
  font-size: 24px;
  color: purple;
  font-weight: bold;
  text-align: center;
}

.word-display {
  font-size: 28px;
  letter-spacing: 12px;
  margin-left: 10px;
}


.canvas-area {
  background: white;
  border: 2px solid #aaa;
  height: 550px;
}

.canvas-area canvas {
  width: 100%;
  height: 100%;
  display: block;
}


.right-column {
  width: 250px;
  display: flex;
  flex-direction: column;
  border: 2px solid #aaa;
  background: white;
}

.tools-box {
  height: 100px;
  background: white;
  border: 2px solid #aaa;
  padding: 10px;
}

.colors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid black;
}

.info-box {
  background: white;
  border: 2px solid #aaa;
  padding: 10px;
}

.MessageDisplay {
  width: 95%;
  height: 450px;
  border: 2px solid #aaa;
  padding: 8px;
  font-size: 16px;
  background: white;
  overflow: scroll;
}

#chooseRandomWordButton {
  /*display: inline-block;*/
  background-color: #39FF14;
  /*border: 2px solid #FF1493;*/
  padding: 20px 90px;
  border-radius: 100px;
  margin: 30px;
  /*gap: 10px;*/
  /*font-size: 18px;*/
  /*align-items: center;*/
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
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 2rem;
}
</style>