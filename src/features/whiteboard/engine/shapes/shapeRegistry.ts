import type { Element, ElementType } from "../../models/element";
import type { Shape } from "./Shape";
import { strokeShape } from "./strokeShape";
import { rectangleShape } from "./rectangleShape";
import { arrowShape } from "./arrowShape";
import { textShape } from "./textShape";

type ShapeMap = Partial<Record<ElementType, Shape<Element>>>;

const registry: ShapeMap = {
  stroke: strokeShape,
  rectangle: rectangleShape,
  arrow: arrowShape,
  text: textShape,
};

export function getShape(type: ElementType): Shape<Element> | undefined {
  return registry[type];
}

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: Element,
  selected: boolean,
) {
  const shape = getShape(element.type);
  if (!shape) return;
  shape.draw(ctx, element, selected);
}

export function hitTestElement(
  x: number,
  y: number,
  element: Element,
): boolean {
  const shape = getShape(element.type);
  if (!shape || !shape.hitTest) return false;
  return shape.hitTest(x, y, element);
}
