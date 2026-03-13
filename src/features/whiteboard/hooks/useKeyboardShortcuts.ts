import { useEffect } from "react";
import { useBoardStore } from "../store/boardStore";
import { copyStroke, pasteStroke } from "../../../lib/clipboard";

export function useKeyboardShortcuts() {
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const strokes = useBoardStore((s) => s.strokes);
  const addStroke = useBoardStore((s) => s.addStroke);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modKey) return;

      if (e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (e.key === "y") {
        e.preventDefault();
        redo();
      }

      if (e.key === "c") {
        e.preventDefault();

        const lastStroke = strokes[strokes.length - 1];
        if (lastStroke) {
          copyStroke(lastStroke);
        }
      }

      if (e.key === "v") {
        e.preventDefault();

        const stroke = pasteStroke();
        if (stroke) {
          addStroke(stroke);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, strokes, addStroke]);
}