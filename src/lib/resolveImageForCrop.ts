/**
 * Loads any image URL into a data URL safe for canvas crop export.
 * Remote URLs (e.g. Cloudinary) fail canvas export without this step.
 */
export async function resolveImageForCrop(src: string): Promise<string> {
  if (src.startsWith("data:")) {
    return src;
  }

  // blob: and http(s): — fetch then convert to data URL for canvas-safe cropping
  const response = await fetch(src, {
    mode: "cors",
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error(`Failed to load image (${response.status})`);
  }

  const blob = await response.blob();
  if (!blob.size) {
    throw new Error("Image file is empty");
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Failed to read image"));
    };
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(blob);
  });
}
