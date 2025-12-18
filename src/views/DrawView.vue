
<template>
  <div class="page">

    <div class="timer-bar">
        Time left: {{ timeLeft }}s
      </div>
    <div class="game-layout">

      <div class="left-column">
            <div class="players" v-for="p in participants" :key="p.name" :style="{ background: p.img }" >
                <img :src="p.img" alt="Player Image" class="player-img" />
                <div class="player-score">{{ p.name }}: {{ p.score }}p
            </div>
            </div>
          </div>

    <div class="center-column">
        <div class="top-bar">
          Your time to paint:
          <span class="word-display" > Ä P P L E</span>
          
        </div>

 

        <div class="canvas-area">
  <canvas
    ref="canvas"
    @mousedown="drawer.start"
    @mousemove="drawer.move"
    @mouseup="drawer.stop"
    @mouseleave="drawer.stop">
  </canvas>
        </div>
    </div>

    

      <div class="right-column">

        <div class="tools-box">
          <div class="colors">
            <div class="color" v-for="c in colors" :key="c" :style="{ background: c }" @click= "drawer && drawer.getcolor(c)"></div>
          </div>
        </div>

        <div class="info-box">
          <p><strong>Clara is choosing a word!</strong></p>
          <p>Hanna <span style="color: green;">+325p</span></p>
        </div>

        <div class="guess-box">
          <input type="text"
                 placeholder="Guess something..."
                 v-model="currentGuess"
                 @keydown.enter="submitGuess" />
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
  background: linear-gradient(#c8b7e8, #9c88c8);
  min-height: 100vh;
}

/* MAIN LAYOUT (3 columns centered) */
.game-layout {
  margin-top: 4%;
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 80%;      /* <<< entire game area is 70% of screen */
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
  border: 2px solid #aaa;;
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
  border:2px solid #aaa;
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

.guess-box input {
  width: 95%;
  border: 2px solid #aaa;
  padding: 8px;
  font-size: 16px;
  background: white;
}
</style>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
//import {Getpoints} from "@/components/GetPoints.js";
//import { Getpoints } from "@/components/GetPoints.js";
import { concurrentStart } from "@/components/Concurrency.js";
import { createCanvasDrawer } from "@/components/StartDraw.js";
import { createTimer } from "@/components/StartTimer.js";

export default {
  data() {
    return {
      drawer: null,
      timeLeft: 0,         
      canDraw: false,
      currentColor: "black",
      colors: [ "black", "red", "green", "blue", "yellow"],
      participants: [],
      currentGuess: "",
      guesses: [],
      currentWord: "apple",
    };
  },
 // CANVAS functions
 mounted() {

   socket.on("correctGuess", (data) => {
    this.onCorrectGuess(data);
  });

  socket.on('participantsUpdate', (participants) => {
    this.participants = participants;
  });

   socket.emit('getparticipants', { gamePin: 'test' });

  const canvas = this.$refs.canvas;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  this.canDraw = false;

  this.drawer = createCanvasDrawer(
    canvas,
    () => this.canDraw
  );

  this.timer = createTimer({
    getTime: () => this.timeLeft,
    setTime: v => (this.timeLeft = v),
    onEnd: () => {
    this.canDraw = false;
    }
  });

  // START ROUND CONCURRENTLY
  this.startRound();
},


methods: {
    
  startRound() {
    const roundTime = 10;

    this.canDraw = true;

    this.timer.setTimer(roundTime);

    concurrentStart(roundTime);
  },

  submitGuess() {
    const guess = this.currentGuess.trim();
    if (!guess) return;

    this.guesses.push(guess);

    socket.emit("guess", {guess,gamePin: "test", timeleft: timeLeft});

    this.currentGuess = "";
},

onCorrectGuess(data) {
    this.canDraw = false;

    this.timer?.stopTimer?.();

    this.participants = data.participants;

    console.log(
      `${data.playerName} gained ${data.points} points`
    );
  }
}
};

</script>

