import { useRef } from "react";
import { DrawingEngine } from "../engine/drawingEngine";
import { useBoardStore } from "../store/boardStore";
import { useToolStore } from "../store/toolStore";
import { useViewportStore } from "../store/viewportStore";
import { useSelectionStore } from "../store/selectionStore";
import { getSelectionBounds, getBounds } from "../engine/geometry/bounds";
import {
  getHandleUnderPoint,
  type Handle,
} from "../engine/geometry/resizeHandles";
import { snapToGrid } from "../engine/snapping/snapToGrid";

import type {
  StrokeElement,
  RectangleElement,
  Element,
} from "../models/element";
import { hitTestElement } from "../engine/shapes/shapeRegistry";

export function usePointerDraw() {
  const engineRef = useRef(new DrawingEngine());

  const addElement = useBoardStore((s) => s.addElement);

  const dragRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const resizeHandleRef = useRef<Handle | null>(null);
  const marqueeActiveRef = useRef(false);

  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const marquee = useSelectionStore((s) => s.marquee);
  const setMarquee = useSelectionStore((s) => s.setMarquee);

  const tool = useToolStore((s) => s.tool);
  const color = useToolStore((s) => s.color);
  const width = useToolStore((s) => s.width);

  /*
  --------------------------------
  Pointer Down
  --------------------------------
  */

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { offsetX, offsetY, zoom } = useViewportStore.getState();

    const screenX = e.nativeEvent.offsetX;
    const screenY = e.nativeEvent.offsetY;

    const point = {
      x: (screenX - offsetX) / zoom,
      y: (screenY - offsetY) / zoom,
    };

    lastPointRef.current = point;

    const elements = useBoardStore.getState().elements as Element[];

    /*
    Selection Tool (hit test + marquee start)
    */

    if (tool === "select") {
      const selectedElements = elements.filter((el) =>
        selectedIds.includes(el.id),
      );

      if (selectedElements.length > 0) {
        const bounds = getSelectionBounds(selectedElements);

        const handle = getHandleUnderPoint(point.x, point.y, bounds);

        if (handle) {
          resizeHandleRef.current = handle;
          return;
        }
      }

      const hit = [...elements]
        .slice()
        .reverse()
        .find((el) => hitTestElement(point.x, point.y, el));

      if (hit) {
        if (e.shiftKey) {
          useSelectionStore.getState().addToSelection(hit.id);
        } else {
          useSelectionStore.getState().setSelection([hit.id]);
        }

        dragRef.current = true;
      } else {
        // start marquee
        marqueeActiveRef.current = true;
        setMarquee({
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
        });
      }

      return;
    }

    /*
    Pen Tool
    */

    if (tool === "pen") {
      engineRef.current.startStroke(point, color, width);
    }

    /*
    Eraser Tool
    */

    if (tool === "eraser") {
      engineRef.current.startStroke(point, "eraser", width * 4);
    }

    /*
    Rectangle Tool
    */

    if (tool === "rectangle") {
      engineRef.current.startRectangle(point, color, width);
      return;
    }

    //Arrow
    if (tool === "arrow") {
      engineRef.current.startArrow(point, color, width);
    }
  }

  /*
  --------------------------------
  Pointer Move
  --------------------------------
  */

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const { offsetX, offsetY, zoom } = useViewportStore.getState();

    const screenX = e.nativeEvent.offsetX;
    const screenY = e.nativeEvent.offsetY;

    const point = {
      x: (screenX - offsetX) / zoom,
      y: (screenY - offsetY) / zoom,
    };

    const selectedIds = useSelectionStore.getState().selectedIds;

    /*
    Drag Elements
    */

    if (resizeHandleRef.current && lastPointRef.current) {
      const dx = point.x - lastPointRef.current.x;
      const dy = point.y - lastPointRef.current.y;

      const handle = resizeHandleRef.current;

      useBoardStore.setState((state) => ({
        elements: state.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;

          if (el.type !== "rectangle") return el;

          let { x, y, width, height } = el;

          if (handle.includes("w")) {
            x += dx;
            width -= dx;
          }
          if (handle.includes("e")) {
            width += dx;
          }
          if (handle.includes("n")) {
            y += dy;
            height -= dy;
          }
          if (handle.includes("s")) {
            height += dy;
          }

          if (width < 0) {
            x += width;
            width = Math.abs(width);
          }

          if (height < 0) {
            y += height;
            height = Math.abs(height);
          }

          const updated: RectangleElement = {
            ...el,
            x,
            y,
            width,
            height,
            updatedAt: Date.now(),
          };

          return updated;
        }),
      }));

      lastPointRef.current = point;
      return;
    }

    if (dragRef.current && lastPointRef.current) {
      const snapped = e.shiftKey ? snapToGrid(point.x, point.y) : point;

      const dx = snapped.x - lastPointRef.current.x;
      const dy = snapped.y - lastPointRef.current.y;

      useBoardStore.setState((state) => ({
        elements: state.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;

          if (el.type === "stroke") {
            return {
              ...el,
              points: el.points.map((p) => ({
                x: p.x + dx,
                y: p.y + dy,
              })),
            } as StrokeElement;
          }

          if (el.type === "rectangle") {
            return {
              ...el,
              x: el.x + dx,
              y: el.y + dy,
              updatedAt: Date.now(),
            } as RectangleElement;
          }

          return el;
        }),
      }));

      lastPointRef.current = point;

      return;
    }

    if (tool === "rectangle") {
      engineRef.current.updateRectangle(point);
      return;
    }

    // update marquee while dragging
    if (tool === "select" && marqueeActiveRef.current && marquee) {
      setMarquee({
        ...marquee,
        width: point.x - marquee.x,
        height: point.y - marquee.y,
      });
      return;
    }

    /*
    Continue drawing stroke
    */

    if (e.buttons !== 1) return;

    //Arrow
    if (tool === "arrow") {
      engineRef.current.updateArrow(point);
    }

    engineRef.current.addPoint(point);
    console.log(engineRef.current.getCurrentArrow());
  }

  /*
  --------------------------------
  Pointer Up
  --------------------------------
  */

  function handlePointerUp() {
    dragRef.current = false;
    lastPointRef.current = null;
    resizeHandleRef.current = null;

    const element = engineRef.current.endStroke();
    const rect = engineRef.current.endRectangle();
    const arrow = engineRef.current.endArrow();

    if (rect) {
      addElement(rect);
      return;
    }

    // finalize marquee selection
    if (marqueeActiveRef.current && marquee) {
      const elements = useBoardStore.getState().elements as Element[];

      const box = {
        x: Math.min(marquee.x, marquee.x + marquee.width),
        y: Math.min(marquee.y, marquee.y + marquee.height),
        width: Math.abs(marquee.width),
        height: Math.abs(marquee.height),
      };

      const intersects = (
        a: { x: number; y: number; width: number; height: number },
        b: { x: number; y: number; width: number; height: number },
      ) => {
        return !(
          a.x + a.width < b.x ||
          a.x > b.x + b.width ||
          a.y + a.height < b.y ||
          a.y > b.y + b.height
        );
      };

      const selected = elements.filter((el) => intersects(box, getBounds(el)));

      useSelectionStore.getState().setSelection(selected.map((e) => e.id));

      setMarquee(null);
      marqueeActiveRef.current = false;
    }
    /*
    Commit stroke
    */

    if (element) {
      addElement(element);
    }

    //Arrow
    if (arrow) {
      useBoardStore.getState().addElement(arrow);
    }
  }

  return {
    engineRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
