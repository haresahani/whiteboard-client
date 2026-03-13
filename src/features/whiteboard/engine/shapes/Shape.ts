import type { Element } from "../../models/element";

export interface Shape<T extends Element = Element> {
  draw(
    ctx: CanvasRenderingContext2D,
    element: T,
    selected: boolean,
  ): void;

  hitTest?(
    x: number,
    y: number,
    element: T,
  ): boolean;
}

