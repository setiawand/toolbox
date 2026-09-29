import { describe, expect, it } from "vitest";
import { compressToTarget, encodeAtQuality, MAX_QUALITY, MIN_QUALITY } from "../lib/image/compress-core";
import { formatBytes, outputFilename } from "../lib/format";

/** Fake encoder: size grows with quality and with pixel count, like a real codec. */
const fake = (baseKb: number) => async (quality: number, scale: number) =>
  new Blob([new Uint8Array(Math.round(baseKb * 1024 * quality * scale * scale))], { type: "image/jpeg" });

describe("compressToTarget", () => {
  it("returns the highest quality when even the top quality fits", async () => {
    const r = await compressToTarget(fake(100), 500 * 1024);
    expect(r.reachedTarget).toBe(true);
    expect(r.quality).toBe(MAX_QUALITY);
    expect(r.scale).toBe(1);
  });

  it("finds a quality just under the target without shrinking dimensions", async () => {
    const target = 200 * 1024;
    const r = await compressToTarget(fake(400), target); // q=0.5 -> 200 KB
    expect(r.reachedTarget).toBe(true);
    expect(r.scale).toBe(1);
    expect(r.blob.size).toBeLessThanOrEqual(target);
    expect(r.blob.size).toBeGreaterThan(target * 0.9); // close to the target, not wastefully small
  });

  it("shrinks dimensions when the quality floor is still too big", async () => {
    const target = 100 * 1024;
    const r = await compressToTarget(fake(1000), target); // floor q=0.4 -> 400 KB at scale 1
    expect(r.reachedTarget).toBe(true);
    expect(r.scale).toBeLessThan(1);
    expect(r.blob.size).toBeLessThanOrEqual(target);
  });

  it("returns the smallest result and reports failure when the target is impossible", async () => {
    const r = await compressToTarget(fake(100000), 10 * 1024);
    expect(r.reachedTarget).toBe(false);
    expect(r.quality).toBe(MIN_QUALITY);
    expect(r.scale).toBe(0.4);
  });

  it("reports progress ending at 1", async () => {
    const seen: number[] = [];
    await compressToTarget(fake(400), 200 * 1024, (f) => seen.push(f));
    expect(seen.at(-1)).toBe(1);
  });
});

describe("encodeAtQuality", () => {
  it("encodes once at full size", async () => {
    const r = await encodeAtQuality(fake(100), 0.8);
    expect(r.scale).toBe(1);
    expect(r.quality).toBe(0.8);
  });
});

describe("format helpers", () => {
  it("formats sizes", () => {
    expect(formatBytes(512, "en")).toBe("512 B");
    expect(formatBytes(2048, "en")).toBe("2 KB");
    expect(formatBytes(3 * 1024 * 1024, "en")).toBe("3 MB");
  });
  it("builds output filenames", () => {
    expect(outputFilename("photo.final.png", "compressed", "image/jpeg")).toBe("photo.final-compressed.jpg");
    expect(outputFilename("noext", "compressed", "image/webp")).toBe("noext-compressed.webp");
  });
});
