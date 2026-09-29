/// <reference lib="webworker" />
import { compressToTarget, encodeAtQuality } from "./compress-core";
import { createEncoder, EncodeError } from "./encoder";
import type { CompressRequest, WorkerMessage } from "./compress";

const post = (msg: WorkerMessage) => (self as DedicatedWorkerGlobalScope).postMessage(msg);

self.onmessage = async (e: MessageEvent<CompressRequest>) => {
  const { file, mime, mode } = e.data;
  try {
    const enc = await createEncoder(file, mime);
    const outcome =
      mode.kind === "target"
        ? await compressToTarget(enc.encode, mode.targetBytes, (fraction) => post({ type: "progress", fraction }))
        : await encodeAtQuality(enc.encode, mode.quality);
    const w = Math.max(1, Math.round(enc.width * outcome.scale));
    const h = Math.max(1, Math.round(enc.height * outcome.scale));
    enc.close();
    post({ type: "done", outcome, width: w, height: h });
  } catch (err) {
    post({ type: "error", code: err instanceof EncodeError ? err.code : "generic" });
  }
};
