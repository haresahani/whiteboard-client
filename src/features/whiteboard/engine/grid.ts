export function renderGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  zoom: number
) {
  const gridSize = 40 * zoom;

  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;

  const startX = offsetX % gridSize;
  const startY = offsetY % gridSize;

  for (let x = startX; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = startY; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}