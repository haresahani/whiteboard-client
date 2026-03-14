import type { ArrowElement } from "../../models/element";
import type { Shape } from "./Shape";

export const arrowShape: Shape<ArrowElement> = {
  draw(ctx, arrow) {
    const { start, end, style } = arrow;

    // const headLength = 12;
    const headLength = Math.max(10, style.strokeWidth * 4);
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    ctx.save();

    ctx.strokeStyle = style.strokeColor;
    ctx.lineWidth = style.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // main line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // arrow head
    ctx.beginPath();

    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 6),
      end.y - headLength * Math.sin(angle - Math.PI / 6),
    );

    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 6),
      end.y - headLength * Math.sin(angle + Math.PI / 6),
    );

    ctx.stroke();

    ctx.restore();
  },

  hitTest(x, y, arrow) {
    const { start, end } = arrow;

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    const t = ((x - start.x) * dx + (y - start.y) * dy) / (length * length);

    const closestX = start.x + t * dx;
    const closestY = start.y + t * dy;

    const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);

    return dist < 6;
  },

  getBounds(arrow) {
    const minX = Math.min(arrow.start.x, arrow.end.x);
    const minY = Math.min(arrow.start.y, arrow.end.y);

    const maxX = Math.max(arrow.start.x, arrow.end.x);
    const maxY = Math.max(arrow.start.y, arrow.end.y);

    return { minX, minY, maxX, maxY };
  },
};
