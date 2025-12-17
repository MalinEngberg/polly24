
let canDraw = false;

function setCanDraw(value) {
  canDraw = value;
}


var resolveTimer = (seconds) => {

  return new Promise(resolve => {
    setTimeout(() => {
      resolve("TIMER_ENDED");
    }, seconds * 1000);
  });
};


var isCorrectGuess = () => {

  return new Promise(resolve => {

    setTimeout(() => {
      resolve("GUESS_CORRECT");
    }, 8000);
  });
};

var stopDrawing = () => {
  setCanDraw(false);
};


var concurrentStart = async (time) => {
  setCanDraw(true);

  const timerPromise = resolveTimer(time);
  const guessPromise = isCorrectGuess();

  // wait for FIRST thing to finish
  const result = await Promise.race([
    timerPromise,
    guessPromise
  ]);

  stopDrawing(result);

};

export { concurrentStart, canDraw };

