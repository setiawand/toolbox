export type OutputMime = "image/jpeg" | "image/webp";

export class EncodeError extends Error {
  constructor(public code: "decode" | "webp" | "generic") {
    super(code);
  }
}

export interface Encoder {
  width: number;
  height: number;
  encode: (quality: number, scale: number) => Promise<Blob>;
  close: () => void;
}

/**
 * Decodes the file once and returns an encode(quality, scale) function.
 * Always starts from the original pixels, so results are never stacked.
 * Drawing to a fresh canvas is also what drops EXIF/GPS metadata.
 * Uses OffscreenCanvas when available (worker-safe), otherwise a DOM canvas.
 */
export async function createEncoder(file: Blob, mime: OutputMime): Promise<Encoder> {
  let bitmap: ImageBitmap;
  try {
    // Applies the EXIF orientation while decoding, so photos are not rotated wrongly.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new EncodeError("decode");
  }

  const encode = async (quality: number, scale: number): Promise<Blob> => {
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const draw = (ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D) => {
      if (mime === "image/jpeg") {
        ctx.fillStyle = "#fff"; // JPEG has no alpha: flatten onto white
        ctx.fillRect(0, 0, w, h);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, w, h);
    };

    let blob: Blob | null;
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new EncodeError("generic");
      draw(ctx);
      blob = await canvas.convertToBlob({ type: mime, quality });
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new EncodeError("generic");
      draw(ctx);
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality));
    }
    // Browsers silently fall back to PNG for formats they cannot encode.
    if (!blob || blob.type !== mime) throw new EncodeError(mime === "image/webp" ? "webp" : "generic");
    return blob;
  };

  return { width: bitmap.width, height: bitmap.height, encode, close: () => bitmap.close() };
}
