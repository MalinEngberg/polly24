export function createCanvasDrawer(canvas, canDrawSignal) {
  const context = canvas.getContext("2d");

  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 4;
  context.strokeStyle = "#000";

  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function start(e) {
    if (canDrawSignal && !canDrawSignal()) return;

    drawing = true;
    const { x, y } = getPos(e);
    lastX = x;
    lastY = y;
  }

  function move(e) {
    if (!drawing) return;
    if (canDrawSignal && !canDrawSignal()) return;

    const { x, y } = getPos(e);

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();

    lastX = x;
    lastY = y;
  }

  function stop() {
    drawing = false;
  }

  return { start, move, stop };
}
