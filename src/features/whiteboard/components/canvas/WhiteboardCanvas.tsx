import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "../../store/boardStore";
import { renderElements } from "../../engine/renderer";
import { usePointerDraw } from "../../hooks/usePointerDraw";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useToolStore } from "../../store/toolStore";
import { useViewportStore } from "../../store/viewportStore";
import { useSelectionStore } from "../../store/selectionStore";
import {
  getHandleUnderPoint,
  getCursorForHandle,
  type Handle,
} from "../../engine/geometry/resizeHandles";
import { getSelectionBounds } from "../../engine/geometry/bounds";
import type { Element } from "../../models/element";
import TextEditor from "../overlays/TextEditor";

export default function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useKeyboardShortcuts();

  const elements = useBoardStore((s) => s.elements);
  const tool = useToolStore((s) => s.tool);

  const offsetX = useViewportStore((s) => s.offsetX);
  const offsetY = useViewportStore((s) => s.offsetY);
  const zoom = useViewportStore((s) => s.zoom);
  const pan = useViewportStore((s) => s.pan);
  const zoomAt = useViewportStore((s) => s.zoomAt);

  const selectedIds = useSelectionStore((s) => s.selectedIds);

  const [hoverHandle, setHoverHandle] = useState<Handle | null>(null);

  const {
    engineRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
  } = usePointerDraw();

  /*
  ----------------------------------
  Resize canvas to full screen
  ----------------------------------
  */
  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  /*
  ----------------------------------
  Render Loop
  ----------------------------------
  */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const tempElement =
        engineRef.current.getCurrentStroke() ||
        engineRef.current.getCurrentRectangle() ||
        engineRef.current.getCurrentArrow() ||
        engineRef.current.getCurrentText();

      renderElements(
        ctx,
        elements,
        tempElement,
        offsetX,
        offsetY,
        zoom,
        selectedIds,
      );

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [elements, engineRef, offsetX, offsetY, zoom, selectedIds]);

  /*
  ----------------------------------
  Zoom with mouse wheel
  ----------------------------------
  */
  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();

    const delta = -e.deltaY * 0.001;

    zoomAt(e.clientX, e.clientY, delta);
  }

  /*
  ----------------------------------
  Pan with middle mouse
  ----------------------------------
  */
  function handlePan(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.buttons === 4) {
      pan(e.movementX, e.movementY);
    }
  }

  /*
  ----------------------------------
  Hover resize handles
  ----------------------------------
  */
  function handleHover(e: React.PointerEvent<HTMLCanvasElement>) {
    const { offsetX, offsetY, zoom } = useViewportStore.getState();

    const screenX = e.nativeEvent.offsetX;
    const screenY = e.nativeEvent.offsetY;

    const worldX = (screenX - offsetX) / zoom;
    const worldY = (screenY - offsetY) / zoom;

    const elements = useBoardStore.getState().elements as Element[];
    const selectedIds = useSelectionStore.getState().selectedIds;

    if (selectedIds.length === 0) {
      setHoverHandle(null);
      return;
    }

    const selectedElements = elements.filter((el) =>
      selectedIds.includes(el.id),
    );

    if (selectedElements.length === 0) {
      setHoverHandle(null);
      return;
    }

    const bounds = getSelectionBounds(selectedElements);

    const handle = getHandleUnderPoint(worldX, worldY, bounds);

    setHoverHandle(handle);
  }

  /*
  ----------------------------------
  Cursor logic
  ----------------------------------
  */
  const cursor = hoverHandle
    ? getCursorForHandle(hoverHandle)
    : tool === "eraser"
      ? "cell"
      : tool === "select"
        ? "default"
        : "crosshair";

  return (
    <div className="w-screen h-screen relative">
      <canvas
        ref={canvasRef}
        className="w-screen h-screen bg-white"
        style={{ cursor }}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => {
          handleHover(e);
          handlePointerMove(e);
          handlePan(e);
        }}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      <TextEditor />
    </div>
  );
}
