export function createCanvasDrawer(canvas, canDrawSignal, onLocalDraw) {
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
    console.log('canDrawSignal:', canDrawSignal?.()); //denna blir false just nu så nästa rad returnerar bara
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

    const fromX = lastX;
    const fromY = lastY;

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(x, y);
    context.stroke();

    onLocalDraw?.({
      from: {x: fromX, y: fromY},
      to: {x, y},
      color: context.strokeStyle,
      lineWidth: context.lineWidth
    });

    lastX = x;
    lastY = y;
  }

  function stop() {
    drawing = false;
  }

  function getcolor(color){
    context.strokeStyle = color;
  }

  function drawRemote(seg) { // vad är seg?
    if (!seg?.from || !seg?.to) return;

    const prevColor = context.strokeStyle;
    const prevWidth = context.lineWidth;

    if (seg.color) context.strokeStyle = seg.color;
    if (seg.lineWidth) context.lineWidth = seg.lineWidth;

    context.beginPath();
    context.moveTo(seg.from.x, seg.from.y); // varför skriver man såhär?
    context.lineTo(seg.to.x, seg.to.y);
    context.stroke();

    context.strokeStyle = prevColor;
    context.lineWidth = prevWidth;
  }

  function clear() {
    context.clearRect (0, 0, canvas.width, canvas.height);
  }

  return { start, move, stop, getcolor, drawRemote, clear };
}
