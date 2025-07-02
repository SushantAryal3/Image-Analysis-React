// src/Utils/cleanup.ts

export default function removeSmallIslands(maskData: ImageData, minSize: number): ImageData {
  const { width: w, height: h, data } = maskData;
  const out = new Uint8ClampedArray(data);

  // ── Union-Find helpers ─────────────────────────
  const parent: Record<number, number> = {};
  function find(id: number): number {
    if (parent[id] !== id) parent[id] = find(parent[id]);
    return parent[id];
  }
  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  // ── 1) Build binary map ─────────────────────────
  const bin = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < w * h; p++, i += 4) {
    bin[p] = data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255 ? 1 : 0;
  }

  // ── 2) First pass: label pixels & record unions ──
  const labels = new Int32Array(w * h);
  let nextLabel = 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (bin[idx] === 1) {
        const left = x > 0 ? labels[idx - 1] : 0;
        const up = y > 0 ? labels[idx - w] : 0;

        if (left === 0 && up === 0) {
          labels[idx] = nextLabel;
          parent[nextLabel] = nextLabel;
          nextLabel++;
        } else {
          const keep = left !== 0 && up !== 0 ? Math.min(left, up) : left || up;

          labels[idx] = keep;
          if (left !== 0 && up !== 0 && left !== up) {
            union(left, up);
          }
        }
      }
    }
  }

  // ── 3) Flatten equivalences ─────────────────────
  Object.keys(parent).map(Number).forEach(find);

  // ── 4) Count areas ──────────────────────────────
  const area: Record<number, number> = {};
  for (let i = 0; i < labels.length; i++) {
    const lab = labels[i];
    if (lab !== 0) {
      const root = find(lab);
      labels[i] = root;
      area[root] = (area[root] || 0) + 1;
    }
  }

  // ── 5) Remove small blobs ───────────────────────
  for (let p = 0, i = 0; p < w * h; p++, i += 4) {
    const lab = labels[p];
    if (lab !== 0 && area[lab] < minSize) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
      // alpha channel (out[i+3]) stays at 255
    }
  }

  return new ImageData(out, w, h);
}
