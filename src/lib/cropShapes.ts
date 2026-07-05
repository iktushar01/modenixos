export type CropShapeType =
  | "rectangle"
  | "square"
  | "circle"
  | "oval"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "pentagon"
  | "octagon"
  | "star"
  | "heart"
  | "arrow"
  | "rounded-rectangle";

/** @deprecated Use CropShapeType */
export type CropShape = CropShapeType | "rect" | "round";

export interface CropShapeOption {
  id: CropShapeType;
  label: string;
}

export interface CropShapeGroup {
  title: string;
  shapes: CropShapeOption[];
}

export const CROP_SHAPE_GROUPS: CropShapeGroup[] = [
  {
    title: "Basic",
    shapes: [
      { id: "rectangle", label: "Rectangle" },
      { id: "square", label: "Square" },
      { id: "circle", label: "Circle" },
      { id: "oval", label: "Oval" },
    ],
  },
  {
    title: "Polygon",
    shapes: [
      { id: "triangle", label: "Triangle" },
      { id: "diamond", label: "Diamond" },
      { id: "pentagon", label: "Pentagon" },
      { id: "hexagon", label: "Hexagon" },
      { id: "octagon", label: "Octagon" },
    ],
  },
  {
    title: "Decorative",
    shapes: [
      { id: "star", label: "Star" },
      { id: "heart", label: "Heart" },
      { id: "arrow", label: "Arrow" },
      { id: "rounded-rectangle", label: "Rounded rect" },
    ],
  },
];

export function normalizeCropShape(shape: CropShape): CropShapeType {
  if (shape === "rect") return "rectangle";
  if (shape === "round") return "circle";
  return shape;
}

export function shapeForcesSquareAspect(shape: CropShapeType): boolean {
  return shape === "square" || shape === "circle";
}

export function usesCircularCropPreview(shape: CropShapeType): boolean {
  return shape === "circle";
}

export function shapeNeedsTransparency(shape: CropShapeType): boolean {
  return shape !== "rectangle";
}

export function traceShapePath(
  ctx: CanvasRenderingContext2D | Path2D,
  shape: CropShapeType,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const isPath2D = ctx instanceof Path2D;

  const moveTo = (px: number, py: number) => {
    if (isPath2D) ctx.moveTo(px, py);
    else (ctx as CanvasRenderingContext2D).moveTo(px, py);
  };
  const lineTo = (px: number, py: number) => {
    if (isPath2D) ctx.lineTo(px, py);
    else (ctx as CanvasRenderingContext2D).lineTo(px, py);
  };
  const closePath = () => {
    if (isPath2D) ctx.closePath();
    else (ctx as CanvasRenderingContext2D).closePath();
  };
  const bezierCurveTo = (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    px: number,
    py: number,
  ) => {
    if (isPath2D) ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, px, py);
    else (ctx as CanvasRenderingContext2D).bezierCurveTo(cp1x, cp1y, cp2x, cp2y, px, py);
  };
  const arc = (
    acx: number,
    acy: number,
    r: number,
    start: number,
    end: number,
    counter?: boolean,
  ) => {
    if (isPath2D) ctx.arc(acx, acy, r, start, end, counter);
    else (ctx as CanvasRenderingContext2D).arc(acx, acy, r, start, end, counter);
  };

  switch (shape) {
    case "rectangle":
    case "square":
      moveTo(x, y);
      lineTo(x + w, y);
      lineTo(x + w, y + h);
      lineTo(x, y + h);
      closePath();
      break;

    case "rounded-rectangle": {
      const r = Math.min(w, h) * 0.18;
      const ctx2 = ctx as CanvasRenderingContext2D;
      if (!isPath2D && typeof ctx2.roundRect === "function") {
        ctx2.roundRect(x, y, w, h, r);
        break;
      }
      moveTo(x + r, y);
      lineTo(x + w - r, y);
      arc(x + w - r, y + r, r, -Math.PI / 2, 0);
      lineTo(x + w, y + h - r);
      arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
      lineTo(x + r, y + h);
      arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
      lineTo(x, y + r);
      arc(x + r, y + r, r, Math.PI, (Math.PI * 3) / 2);
      closePath();
      break;
    }

    case "circle": {
      const r = Math.min(w, h) / 2;
      arc(cx, cy, r, 0, Math.PI * 2);
      closePath();
      break;
    }

    case "oval":
      if (!isPath2D) {
        (ctx as CanvasRenderingContext2D).ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
      } else {
        traceRegularPolygon(ctx, cx, cy, Math.min(w, h) / 2, 32, 0);
      }
      break;

    case "triangle":
      moveTo(cx, y);
      lineTo(x + w, y + h);
      lineTo(x, y + h);
      closePath();
      break;

    case "diamond":
      moveTo(cx, y);
      lineTo(x + w, cy);
      lineTo(cx, y + h);
      lineTo(x, cy);
      closePath();
      break;

    case "pentagon":
      traceRegularPolygon(ctx, cx, cy, Math.min(w, h) / 2, 5, -Math.PI / 2);
      break;

    case "hexagon":
      traceRegularPolygon(ctx, cx, cy, Math.min(w, h) / 2, 6, -Math.PI / 2);
      break;

    case "octagon":
      traceRegularPolygon(ctx, cx, cy, Math.min(w, h) / 2, 8, -Math.PI / 8);
      break;

    case "star":
      traceStar(ctx, cx, cy, Math.min(w, h) / 2, Math.min(w, h) / 4.5, 5);
      break;

    case "heart":
      traceHeart(ctx, x, y, w, h, moveTo, lineTo, bezierCurveTo, closePath);
      break;

    case "arrow":
      traceArrow(ctx, x, y, w, h, moveTo, lineTo, closePath);
      break;
  }
}

function traceRegularPolygon(
  ctx: CanvasRenderingContext2D | Path2D,
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation: number,
) {
  const isPath2D = ctx instanceof Path2D;
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (i * 2 * Math.PI) / sides;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);
    if (i === 0) {
      if (isPath2D) ctx.moveTo(px, py);
      else ctx.moveTo(px, py);
    } else {
      if (isPath2D) ctx.lineTo(px, py);
      else ctx.lineTo(px, py);
    }
  }
  if (isPath2D) ctx.closePath();
  else ctx.closePath();
}

function traceStar(
  ctx: CanvasRenderingContext2D | Path2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
) {
  const isPath2D = ctx instanceof Path2D;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) {
      if (isPath2D) ctx.moveTo(px, py);
      else ctx.moveTo(px, py);
    } else {
      if (isPath2D) ctx.lineTo(px, py);
      else ctx.lineTo(px, py);
    }
  }
  if (isPath2D) ctx.closePath();
  else ctx.closePath();
}

function traceHeart(
  ctx: CanvasRenderingContext2D | Path2D,
  x: number,
  y: number,
  w: number,
  h: number,
  moveTo: (px: number, py: number) => void,
  lineTo: (px: number, py: number) => void,
  bezierCurveTo: (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    px: number,
    py: number,
  ) => void,
  closePath: () => void,
) {
  const top = y + h * 0.28;
  moveTo(x + w / 2, y + h * 0.88);
  bezierCurveTo(x + w * 0.1, y + h * 0.55, x, y + h * 0.22, x + w * 0.25, top);
  bezierCurveTo(x + w * 0.38, y + h * 0.02, x + w * 0.5, y + h * 0.12, x + w / 2, y + h * 0.22);
  bezierCurveTo(x + w * 0.5, y + h * 0.12, x + w * 0.62, y + h * 0.02, x + w * 0.75, top);
  bezierCurveTo(x + w, y + h * 0.22, x + w * 0.9, y + h * 0.55, x + w / 2, y + h * 0.88);
  closePath();
}

function traceArrow(
  ctx: CanvasRenderingContext2D | Path2D,
  x: number,
  y: number,
  w: number,
  h: number,
  moveTo: (px: number, py: number) => void,
  lineTo: (px: number, py: number) => void,
  closePath: () => void,
) {
  const cy = y + h / 2;
  const shaft = w * 0.55;
  moveTo(x, y + h * 0.32);
  lineTo(x + shaft, y + h * 0.32);
  lineTo(x + shaft, y + h * 0.12);
  lineTo(x + w, cy);
  lineTo(x + shaft, y + h * 0.88);
  lineTo(x + shaft, y + h * 0.68);
  lineTo(x, y + h * 0.68);
  closePath();
}

export function applyShapeMask(
  source: HTMLCanvasElement,
  shape: CropShapeType,
): HTMLCanvasElement {
  if (shape === "rectangle") return source;

  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.beginPath();
  traceShapePath(ctx, shape, 0, 0, source.width, source.height);
  ctx.clip();
  ctx.drawImage(source, 0, 0);
  return out;
}

/** SVG path in 0–100 viewBox for crop selection overlay preview */
export function shapeSvgPathString(shape: CropShapeType): string {
  switch (shape) {
    case "rectangle":
    case "square":
      return "M0,0 H100 V100 H0 Z";
    case "rounded-rectangle":
      return "M18,0 H82 Q100,0 100,18 V82 Q100,100 82,100 H18 Q0,100 0,82 V18 Q0,0 18,0 Z";
    case "circle":
      return "M50,0 A50,50 0 1,1 49.99,0 Z";
    case "oval":
      return "M50,0 A50,50 0 1,1 49.99,0 Z";
    case "triangle":
      return "M50,2 L98,98 L2,98 Z";
    case "diamond":
      return "M50,2 L98,50 L50,98 L2,50 Z";
    case "pentagon":
      return polygonSvg(50, 50, 48, 5, -90);
    case "hexagon":
      return polygonSvg(50, 50, 48, 6, -90);
    case "octagon":
      return polygonSvg(50, 50, 48, 8, -22.5);
    case "star":
      return starSvg(50, 50, 48, 20, 5);
    case "heart":
      return "M50,88 C10,55 0,22 25,28 C38,2 50,12 50,22 C50,12 62,2 75,28 C100,22 90,55 50,88 Z";
    case "arrow":
      return "M0,32 L55,32 L55,12 L100,50 L55,88 L55,68 L0,68 Z";
    default:
      return "M0,0 H100 V100 H0 Z";
  }
}

function polygonSvg(cx: number, cy: number, r: number, sides: number, rotDeg: number): string {
  const rot = (rotDeg * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = rot + (i * 2 * Math.PI) / sides;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M${pts.join(" L")} Z`;
}

function starSvg(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    coords.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M${coords.join(" L")} Z`;
}

export function shapePreviewLabel(shape: CropShapeType): string {
  for (const group of CROP_SHAPE_GROUPS) {
    const found = group.shapes.find((s) => s.id === shape);
    if (found) return found.label;
  }
  return shape;
}
