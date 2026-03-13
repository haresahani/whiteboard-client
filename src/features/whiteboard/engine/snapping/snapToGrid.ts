export function snapToGrid(
  x: number,
  y: number,
  gridSize = 40,
  threshold = 8
) {
  const gridX = Math.round(x / gridSize) * gridSize
  const gridY = Math.round(y / gridSize) * gridSize

  const snappedX =
    Math.abs(x - gridX) < threshold ? gridX : x

  const snappedY =
    Math.abs(y - gridY) < threshold ? gridY : y

  return { x: snappedX, y: snappedY }
}