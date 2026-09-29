import { compressToTarget, encodeAtQuality, type CompressOutcome } from "./compress-core";
import { createEncoder, EncodeError, type OutputMime } from "./encoder";

export type CompressMode = { kind: "target"; targetBytes: number } | { kind: "quality"; quality: number };

export interface CompressRequest {
  file: File;
  mime: OutputMime;
  mode: CompressMode;
}

export interface CompressResult extends CompressOutcome {
  width: number;
  height: number;
}

export type WorkerMessage =
  | { type: "progress"; fraction: number }
  | { type: "done"; outcome: CompressOutcome; width: number; height: number }
  | { type: "error"; code: "decode" | "webp" | "generic" };

export class CompressError extends Error {
  constructor(public code: "decode" | "webp" | "generic") {
    super(code);
  }
}

/** Runs in a Web Worker when possible so the UI never freezes; falls back to the main thread. */
export function compressImage(
  req: CompressRequest,
  onProgress?: (fraction: number) => void,
): Promise<CompressResult> {
  if (typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined") {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./compress.worker.ts", import.meta.url));
      worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const msg = e.data;
        if (msg.type === "progress") return onProgress?.(msg.fraction);
        worker.terminate();
        if (msg.type === "done") resolve({ ...msg.outcome, width: msg.width, height: msg.height });
        else reject(new CompressError(msg.code));
      };
      worker.onerror = () => {
        worker.terminate();
        reject(new CompressError("generic"));
      };
      worker.postMessage(req);
    });
  }
  return compressOnMainThread(req, onProgress);
}

async function compressOnMainThread(
  { file, mime, mode }: CompressRequest,
  onProgress?: (fraction: number) => void,
): Promise<CompressResult> {
  try {
    const enc = await createEncoder(file, mime);
    const outcome =
      mode.kind === "target"
        ? await compressToTarget(enc.encode, mode.targetBytes, onProgress)
        : await encodeAtQuality(enc.encode, mode.quality);
    const result = {
      ...outcome,
      width: Math.max(1, Math.round(enc.width * outcome.scale)),
      height: Math.max(1, Math.round(enc.height * outcome.scale)),
    };
    enc.close();
    return result;
  } catch (err) {
    throw new CompressError(err instanceof EncodeError ? err.code : "generic");
  }
}
