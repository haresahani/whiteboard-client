import type {
  Element,
  StrokeElement,
  RectangleElement,
} from "../../models/element";

/*
---------------------------------------
Bounds for Stroke
---------------------------------------
*/
function getStrokeBounds(stroke: StrokeElement) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of stroke.points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  return { minX, minY, maxX, maxY };
}

/*
---------------------------------------
Bounds for Rectangle
---------------------------------------
*/
function getRectangleBounds(rect: RectangleElement) {
  return {
    minX: rect.x,
    minY: rect.y,
    maxX: rect.x + rect.width,
    maxY: rect.y + rect.height,
  };
}

/*
---------------------------------------
Bounds for ANY Element
---------------------------------------
*/
function getElementBounds(element: Element) {
  switch (element.type) {
    case "stroke":
      return getStrokeBounds(element);

    case "rectangle":
      return getRectangleBounds(element);

    default:
      throw new Error("Unknown element type");
  }
}

/*
---------------------------------------
Selection Bounds
---------------------------------------
*/
export function getSelectionBounds(elements: Element[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    const bounds = getElementBounds(element);

    minX = Math.min(minX, bounds.minX);
    minY = Math.min(minY, bounds.minY);
    maxX = Math.max(maxX, bounds.maxX);
    maxY = Math.max(maxY, bounds.maxY);
  }

  return { minX, minY, maxX, maxY };
}

// Bounds as box {x,y,width,height}
export function getBounds(element: Element) {
  const { minX, minY, maxX, maxY } = getElementBounds(element);
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
