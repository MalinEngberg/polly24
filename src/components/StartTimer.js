export function createTimer({ getTime, setTime, onEnd }) {
  let timerInterval = null;

  function setTimer(seconds) {
    if (timerInterval) clearInterval(timerInterval);

    setTime(seconds);

    timerInterval = setInterval(() => {
      const current = getTime();

      if (current > 0) {
        setTime(current - 1);
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        onEnd?.();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  return { setTimer, stopTimer };
}
