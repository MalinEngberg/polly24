export function createCanvasDrawer(canvas, canDrawSignal, emitDrawing) {
  console.log("Nu är vi i StartDraw");
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

    const scaleX = canvas.width / rect.width; // fanns ej förut
    const scaleY = canvas.height / rect.height; // fanns ej förut

    return {
      x: (e.clientX - rect.left) * scaleX, // utan scaleX
      y: (e.clientY - rect.top) * scaleY, // utan scaleY
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

    // Emit drawing data
    emitDrawing?.({ lastX, lastY, x, y, color: context.strokeStyle });

    lastX = x;
    lastY = y;
  }

  function stop() {
    drawing = false;
  }

  function getcolor(color) {
    context.strokeStyle = color;
  }

  function clear() {
    context.clearRect (0, 0, canvas.width, canvas.height); // var satt till canvas.width och canvas.height innan
  }

  return { start, move, stop, getcolor, clear };
}