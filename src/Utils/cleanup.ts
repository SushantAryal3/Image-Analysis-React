export default function removeSmallIslands(maskData: ImageData, minSize: number): ImageData {
  const { width: w, height: h, data } = maskData;

  const out = new Uint8ClampedArray(data);

  const parent = new Map<number, number>();

  function find(id: number): number {
    let current = id;
    const path: number[] = [];

    while (parent.get(current) !== current) {
      path.push(current);
      current = parent.get(current)!;
    }

    path.forEach((node) => parent.set(node, current));

    return current;
  }

  function union(a: number, b: number): void {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent.set(rootA, rootB);
    }
  }

  const totalPixels = w * h;
  const labels = new Int32Array(totalPixels);
  let nextLabel = 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const pixelIdx = idx * 4;

      const isForeground = data[pixelIdx] !== 255 || data[pixelIdx + 1] !== 255 || data[pixelIdx + 2] !== 255;

      if (isForeground) {
        const left = x > 0 ? labels[idx - 1] : 0;
        const up = y > 0 ? labels[idx - w] : 0;

        if (left === 0 && up === 0) {
          labels[idx] = nextLabel;
          parent.set(nextLabel, nextLabel);
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

  const area = new Map<number, number>();

  for (let i = 0; i < totalPixels; i++) {
    const lab = labels[i];
    if (lab !== 0) {
      const root = find(lab);
      labels[i] = root;
      area.set(root, (area.get(root) || 0) + 1);
    }
  }

  for (let p = 0; p < totalPixels; p++) {
    const lab = labels[p];
    if (lab !== 0 && (area.get(lab) || 0) < minSize) {
      const pixelIdx = p * 4;
      out[pixelIdx] = 255;
      out[pixelIdx + 1] = 255;
      out[pixelIdx + 2] = 255;
    }
  }

  parent.clear();
  area.clear();

  return new ImageData(out, w, h);
}
