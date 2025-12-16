<template>
  <div class="page">

    <div class="= timer-bar">
        Time left: 01:23
      </div>
    <div class="game-layout">

      
      <div class="center-column">
        <div class="top-bar">
          Your time to paint:
          <span class="word-display" > Ä P P L E</span>
          
        </div>

        <div class="canvas-area"></div>
      </div>

      <div class="right-column">

        <div class="tools-box">
          <div class="colors">
            <div class="color" v-for="c in colors" :key="c" :style="{ background: c }"></div>
          </div>
        </div>

        <div class="info-box">
          <p><strong>Clara is choosing a word!</strong></p>
          <p>Hanna <span style="color: green;">+325p</span></p>
        </div>

        <div class="guess-box">
          <input type="text" placeholder="Guess something..." />
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* PAGE BACKGROUND */
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

.player {
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
  height: 550px; /* Adjust to your needs */
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
