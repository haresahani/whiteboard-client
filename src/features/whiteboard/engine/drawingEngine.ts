import type {
  StrokeElement,
  RectangleElement,
  ArrowElement,
  Point,
} from "../models/element";
import { generateUUID } from "../../../lib/utils";

export class DrawingEngine {
  private currentStroke: StrokeElement | null = null;
  private currentRectangle: RectangleElement | null = null;
  private currentArrow: ArrowElement | null = null;

  /*
  ----------------------------------------
  Start Stroke
  ----------------------------------------
  */

  startStroke(point: Point, color: string, width: number) {
    this.currentStroke = {
      id: generateUUID(),

      type: "stroke",

      x: point.x,
      y: point.y,

      points: [point],

      style: {
        strokeColor: color,
        strokeWidth: width,
      },

      zIndex: 0,

      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /*
  ----------------------------------------
  Add Point While Drawing Stroke
  ----------------------------------------
  */

  addPoint(point: Point) {
    if (!this.currentStroke) return;

    this.currentStroke.points.push(point);
    this.currentStroke.updatedAt = Date.now();
  }

  endStroke(): StrokeElement | null {
    const finished = this.currentStroke;
    this.currentStroke = null;
    return finished;
  }

  getCurrentStroke() {
    return this.currentStroke;
  }
  /*
  ----------------------------------------
  Start Rectangle
  ----------------------------------------
  */

  startRectangle(point: Point, color: string, width: number) {
    this.currentRectangle = {
      id: generateUUID(),
      type: "rectangle",
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      style: {
        strokeColor: color,
        strokeWidth: width,
      },
      zIndex: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  updateRectangle(point: Point) {
    if (!this.currentRectangle) return;

    this.currentRectangle.width = point.x - this.currentRectangle.x;
    this.currentRectangle.height = point.y - this.currentRectangle.y;
    this.currentRectangle.updatedAt = Date.now();
  }

  endRectangle(): RectangleElement | null {
    const rect = this.currentRectangle;
    this.currentRectangle = null;
    return rect;
  }

  getCurrentRectangle() {
    return this.currentRectangle;
  }

  // Start Arrow
  startArrow(point: Point, color: string, width: number) {
    this.currentArrow = {
      id: generateUUID(),
      type: "arrow",
      x: point.x,
      y: point.y,
      start: point,
      end: point,
      rotation: 0,
      zIndex: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      style: {
        strokeColor: color,
        strokeWidth: width,
      },
    };
  }

  //Update Arrow
  updateArrow(point: Point) {
    if (!this.currentArrow) return;

    this.currentArrow.end = point;
  }

  //End Arrow
  endArrow() {
    const arrow = this.currentArrow;
    this.currentArrow = null;
    return arrow;
  }

  //Getter
  getCurrentArrow() {
    return this.currentArrow;
  }
}
