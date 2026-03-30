import {
  ArrowRight,
  Eraser,
  MousePointer2,
  Pen,
  Square,
  Type,
  X,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { cn } from "../../../../lib/utils";
import { useToolStore, type ToolType } from "../../store/toolStore";

const TOOL_ITEMS: Array<{
  id: ToolType;
  label: string;
  shortcut: string;
  Icon: typeof MousePointer2;
}> = [
  { id: "select", label: "Select", shortcut: "V", Icon: MousePointer2 },
  { id: "pen", label: "Pen", shortcut: "P", Icon: Pen },
  { id: "rectangle", label: "Rectangle", shortcut: "R", Icon: Square },
  { id: "arrow", label: "Arrow", shortcut: "A", Icon: ArrowRight },
  { id: "text", label: "Text", shortcut: "T", Icon: Type },
  { id: "eraser", label: "Eraser", shortcut: "E", Icon: Eraser },
];

const COLOR_SWATCHES = ["#e53935", "#5146e5", "#2f7cf7", "#1ea672", "#18181b"];
const WIDTH_PRESETS = [1, 2, 4];

interface LeftToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeftToolbar({ isOpen, onClose }: LeftToolbarProps) {
  const tool = useToolStore((state) => state.tool);
  const setTool = useToolStore((state) => state.setTool);
  const color = useToolStore((state) => state.color);
  const setColor = useToolStore((state) => state.setColor);
  const width = useToolStore((state) => state.width);
  const setWidth = useToolStore((state) => state.setWidth);

  const activeTool =
    TOOL_ITEMS.find((item) => item.id === tool) ?? TOOL_ITEMS[0];

  function focusToolButton(index: number) {
    const button = document.querySelector<HTMLButtonElement>(
      `[data-tool-index="${index}"]`,
    );
    button?.focus();
  }

  function handleToolbarKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = Number(
      (event.target as HTMLElement | null)?.getAttribute("data-tool-index") ??
        TOOL_ITEMS.findIndex((item) => item.id === tool),
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusToolButton((currentIndex + 1) % TOOL_ITEMS.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusToolButton((currentIndex - 1 + TOOL_ITEMS.length) % TOOL_ITEMS.length);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusToolButton(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusToolButton(TOOL_ITEMS.length - 1);
    }
  }

  return (
    <aside
      className={cn("wb-tool-rail", isOpen && "wb-tool-rail--open")}
      aria-label="Whiteboard tools"
    >
      <div
        className="wb-tool-rail__group"
        role="toolbar"
        aria-orientation="vertical"
        onKeyDown={handleToolbarKeyDown}
      >
        <button
          type="button"
          className="wb-icon-button wb-mobile-only"
          onClick={onClose}
          aria-label="Close tools"
        >
          <X size={16} />
        </button>

        {TOOL_ITEMS.map(({ id, label, shortcut, Icon }) => {
          const isActive = tool === id;

          return (
            <button
              key={id}
              type="button"
              data-tool-index={TOOL_ITEMS.findIndex((item) => item.id === id)}
              className={cn("wb-tool-rail__button", isActive && "is-active")}
              onClick={() => setTool(id)}
              aria-label={`${label} tool`}
              aria-pressed={isActive}
              aria-keyshortcuts={shortcut.toLowerCase()}
              title={`${label} (${shortcut})`}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      <div className="wb-tool-rail__palette">
        <div className="wb-tool-rail__meta">
          <span className="wb-tool-rail__label">{activeTool.label}</span>
          <span className="wb-tool-rail__shortcut">{activeTool.shortcut}</span>
        </div>

        <div className="wb-tool-rail__swatches">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={cn("wb-tool-rail__swatch", color === swatch && "is-active")}
              style={{ backgroundColor: swatch }}
              onClick={() => setColor(swatch)}
              aria-label={`Use color ${swatch}`}
            />
          ))}
        </div>

        <div className="wb-tool-rail__widths">
          {WIDTH_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={cn("wb-tool-rail__width", width === preset && "is-active")}
              onClick={() => setWidth(preset)}
              aria-label={`Use ${preset}px stroke width`}
            >
              <span
                className="wb-tool-rail__width-line"
                style={{
                  height: Math.max(preset, 2),
                  backgroundColor: tool === "eraser" ? "#cbd5e1" : color,
                }}
              />
            </button>
          ))}

          <label className="wb-tool-rail__custom-color">
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              aria-label="Choose a custom color"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
