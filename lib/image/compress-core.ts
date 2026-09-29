/**
 * Pure search logic for hitting a target file size. It knows nothing about
 * canvases or workers: callers pass an `encode` function, which keeps this
 * testable and lets the same code run in a worker or on the main thread.
 */
export type Encode = (quality: number, scale: number) => Promise<Blob>;

export interface CompressOutcome {
  blob: Blob;
  quality: number;
  /** 1 = original dimensions. */
  scale: number;
  /** Only meaningful for target mode; always true for plain quality mode. */
  reachedTarget: boolean;
}

/** Below this JPEG/WebP quality artifacts get ugly, so shrink dimensions instead. */
export const MIN_QUALITY = 0.4;
export const MAX_QUALITY = 0.95;
/** Dimension steps tried, in order, when quality alone cannot hit the target. */
export const SCALES = [1, 0.85, 0.7, 0.55, 0.4];
const BISECT_STEPS = 6;

export async function encodeAtQuality(encode: Encode, quality: number): Promise<CompressOutcome> {
  const blob = await encode(quality, 1);
  return { blob, quality, scale: 1, reachedTarget: true };
}

export async function compressToTarget(
  encode: Encode,
  targetBytes: number,
  onProgress?: (fraction: number) => void,
): Promise<CompressOutcome> {
  let smallest: CompressOutcome | null = null;

  for (let s = 0; s < SCALES.length; s++) {
    const scale = SCALES[s];
    onProgress?.(s / SCALES.length);

    const floor = await encode(MIN_QUALITY, scale);
    if (!smallest || floor.size < smallest.blob.size) {
      smallest = { blob: floor, quality: MIN_QUALITY, scale, reachedTarget: false };
    }
    if (floor.size > targetBytes) continue; // even the lowest quality is too big: shrink dimensions

    // The floor fits. Find the highest quality that still fits.
    let best: CompressOutcome = { blob: floor, quality: MIN_QUALITY, scale, reachedTarget: true };
    const top = await encode(MAX_QUALITY, scale);
    if (top.size <= targetBytes) {
      return { blob: top, quality: MAX_QUALITY, scale, reachedTarget: true };
    }
    let lo = MIN_QUALITY;
    let hi = MAX_QUALITY;
    for (let i = 0; i < BISECT_STEPS; i++) {
      const mid = (lo + hi) / 2;
      const blob = await encode(mid, scale);
      if (blob.size <= targetBytes) {
        best = { blob, quality: mid, scale, reachedTarget: true };
        lo = mid;
      } else {
        hi = mid;
      }
    }
    onProgress?.(1);
    return best;
  }

  onProgress?.(1);
  // Nothing fit: hand back the smallest thing we produced and say so.
  return smallest as CompressOutcome;
}
