import type { Stroke } from "../features/whiteboard/models/stroke";

let clipboardStroke: Stroke | null = null;

export function copyStroke(stroke: Stroke) {
  clipboardStroke = stroke;
}

export function pasteStroke(): Stroke | null {
  if (!clipboardStroke) return null;

  return {
    ...clipboardStroke,
    id: crypto.randomUUID(),
    points: clipboardStroke.points.map((p) => ({
      x: p.x + 20,
      y: p.y + 20,
    })),
  };
}