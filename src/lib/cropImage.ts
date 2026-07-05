export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CropShape = "rect" | "round";

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  cropShape: CropShape = "rect",
  mimeType = "image/jpeg",
  quality = 0.92,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const { width: boxWidth, height: boxHeight } = rotateSize(image.width, image.height, rotation);
  canvas.width = boxWidth;
  canvas.height = boxHeight;

  ctx.translate(boxWidth / 2, boxHeight / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = pixelCrop.width;
  outCanvas.height = pixelCrop.height;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Canvas not supported");

  outCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  if (cropShape === "round") {
    const roundCanvas = document.createElement("canvas");
    roundCanvas.width = pixelCrop.width;
    roundCanvas.height = pixelCrop.height;
    const roundCtx = roundCanvas.getContext("2d");
    if (!roundCtx) throw new Error("Canvas not supported");

    roundCtx.beginPath();
    roundCtx.arc(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      Math.min(pixelCrop.width, pixelCrop.height) / 2,
      0,
      Math.PI * 2,
    );
    roundCtx.closePath();
    roundCtx.clip();
    roundCtx.drawImage(outCanvas, 0, 0);

    return canvasToBlob(roundCanvas, mimeType, quality);
  }

  return canvasToBlob(outCanvas, mimeType, quality);
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      mimeType,
      quality,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
