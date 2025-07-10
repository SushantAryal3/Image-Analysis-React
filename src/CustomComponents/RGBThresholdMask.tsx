/* eslint-disable no-multi-assign, react-hooks/exhaustive-deps, jsx-a11y/label-has-associated-control, camelcase */
import { useRef, useState, useEffect, useCallback } from 'react';
import removeSmallIslands from 'Utils/cleanup';
import SliderGroup from './SliderGroup';
import CanvasPair from './CanvasPair';
import SavedSettingsTable from './SavedSettingsTable';

export type Range2 = [number, number];

export default function RGBThresholdMask() {
  const uploadRef = useRef<HTMLInputElement>(null);
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const maskDataRef = useRef<Uint8ClampedArray | null>(null);
  const [minSize, setMinSize] = useState(0);
  const [filename, setFilename] = useState('');
  const [brushSize, setBrushSize] = useState(10);
  const [rRange, setRRange] = useState<Range2>([0, 255]);
  const [gRange, setGRange] = useState<Range2>([0, 255]);
  const [bRange, setBRange] = useState<Range2>([0, 255]);
  const [hRange, setHRange] = useState<Range2>([0, 360]);
  const [sRange, setSRange] = useState<Range2>([0, 100]);
  const [vRange, setVRange] = useState<Range2>([0, 100]);
  const [savedRGB, setSavedRGB] = useState<any[]>([]);
  const [savedHSV, setSavedHSV] = useState<any[]>([]);
  const [colorSpace, setColorSpace] = useState<'RGB' | 'HSV'>('RGB');
  const [stats, setStats] = useState<
    { name: string; plant: number; noise: number; total: number; width: number; height: number }[]
  >([]);

  const cleanupImageData = useCallback(() => {
    imageDataRef.current = null;
    maskDataRef.current = null;
    if (window.gc) window.gc();
  }, []);

  const applyMask = useCallback(() => {
    const imgData = imageDataRef.current;
    if (!imgData || !maskDataRef.current) return;

    const { data } = imgData;
    const w = imgData.width;
    const h = imgData.height;
    const out = maskDataRef.current;
    const cs = colorSpace;

    const [r0, r1] = rRange;
    const [g0, g1] = gRange;
    const [b0, b1] = bRange;
    const [h0, h1] = hRange;
    const [s0, s1] = sRange;
    const [v0, v1] = vRange;

    const s0_norm = s0 / 100;
    const s1_norm = s1 / 100;
    const v0_norm = v0 / 100;
    const v1_norm = v1 / 100;

    if (cs === 'RGB') {
      for (let i = 0; i < data.length; i += 4) {
        const R = data[i];
        const G = data[i + 1];
        const B = data[i + 2];

        if (R >= r0 && R <= r1 && G >= g0 && G <= g1 && B >= b0 && B <= b1) {
          out[i] = R;
          out[i + 1] = G;
          out[i + 2] = B;
          out[i + 3] = 255;
        } else {
          out[i] = out[i + 1] = out[i + 2] = 255;
          out[i + 3] = 255;
        }
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        const R = data[i];
        const G = data[i + 1];
        const B = data[i + 2];

        const r = R / 255;
        const g = G / 255;
        const b = B / 255;

        const mx = Math.max(r, g, b);
        const mn = Math.min(r, g, b);
        const d = mx - mn;

        let hh = 0;
        if (d > 0) {
          if (mx === r) hh = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          else if (mx === g) hh = ((b - r) / d + 2) / 6;
          else hh = ((r - g) / d + 4) / 6;
        }

        const ss = mx === 0 ? 0 : d / mx;
        const vv = mx;
        const h_deg = hh * 360;

        if (h_deg >= h0 && h_deg <= h1 && ss >= s0_norm && ss <= s1_norm && vv >= v0_norm && vv <= v1_norm) {
          out[i] = R;
          out[i + 1] = G;
          out[i + 2] = B;
          out[i + 3] = 255;
        } else {
          out[i] = out[i + 1] = out[i + 2] = 255;
          out[i + 3] = 255;
        }
      }
    }

    const mctx = maskCanvasRef.current!.getContext('2d')!;
    const rawMask = new ImageData(out, w, h);
    const cleaned = removeSmallIslands(rawMask, minSize);
    mctx.putImageData(cleaned, 0, 0);
  }, [colorSpace, rRange, gRange, bRange, hRange, sRange, vRange, minSize]);

  const [shouldApplyMask, setShouldApplyMask] = useState(true);

  useEffect(() => {
    if (shouldApplyMask && imageData) {
      applyMask();
      setShouldApplyMask(false);
    }
  }, [shouldApplyMask, applyMask, imageData, colorSpace]);

  const handleMinSizeChange = useCallback(
    (n: number) => {
      setMinSize(n);
      applyMask();
    },
    [applyMask],
  );

  const calculateStatistics = useCallback(() => {
    const ctx = maskCanvasRef.current!.getContext('2d')!;
    const { data, width, height } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    let plant = 0;
    const total = width * height;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        plant++;
      }
    }
    const noise = total - plant;
    setStats((prev) => [
      ...prev.filter((item) => item.name !== filename),
      { name: filename, plant, noise, total, width, height },
    ]);
  }, [applyMask, filename]);

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      cleanupImageData();

      const url = URL.createObjectURL(file);
      setFilename(file.name.replace(/\.[^/.]+$/, ''));

      const img = new Image();
      img.onload = () => {
        const oc = origCanvasRef.current!;
        const octx = oc.getContext('2d')!;

        oc.width = img.width;
        oc.height = img.height;
        octx.drawImage(img, 0, 0);

        const mc = maskCanvasRef.current!;
        mc.width = img.width;
        mc.height = img.height;

        imageDataRef.current = octx.getImageData(0, 0, img.width, img.height);
        setImageData(imageDataRef.current);
        maskDataRef.current = new Uint8ClampedArray(imageDataRef.current.data.length);

        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [cleanupImageData],
  );

  const saveSettings = useCallback(() => {
    const cs = colorSpace;
    const rec = {
      name: filename,
      ...(cs === 'RGB' ? { rRange, gRange, bRange } : { hRange, sRange, vRange }),
    };
    if (cs === 'RGB') {
      setSavedRGB((prev) => [...prev.filter((r) => r.name !== filename), rec]);
    } else {
      setSavedHSV((prev) => [...prev.filter((h) => h.name !== filename), rec]);
    }
  }, [colorSpace, filename, rRange, gRange, bRange, hRange, sRange, vRange]);

  const applySaved = useCallback((rec: any) => {
    if ('rRange' in rec) {
      setColorSpace('RGB');
      setRRange(rec.rRange);
      setGRange(rec.gRange);
      setBRange(rec.bRange);
    } else {
      setColorSpace('HSV');
      setHRange(rec.hRange);
      setSRange(rec.sRange);
      setVRange(rec.vRange);
    }
    setShouldApplyMask(true);
  }, []);

  const downloadMask = useCallback(() => {
    const link = document.createElement('a');
    link.download = `${filename}_masked.png`;
    link.href = maskCanvasRef.current!.toDataURL('image/png');
    link.click();
    saveSettings();
  }, [filename, saveSettings]);

  useEffect(() => {
    return cleanupImageData;
  }, [cleanupImageData]);

  return (
    <div className="mt-10 max-w-[95%] mx-auto bg-white shadow-2xl border-t-2 rounded-2xl p-6 space-y-6">
      <h3 className="text-3xl text-center">Interactive RGB/HSV Threshold Mask</h3>
      <input
        type="file"
        ref={uploadRef}
        onChange={handleUpload}
        accept="image/*"
        className="block w-full text-xl text-gray-700 file:bg-blue-500 file:text-white file:py-2 file:px-4 file:rounded-full"
      />
      <div className="flex items-center space-x-2">
        <label className="font-medium" htmlFor="valueFor">
          Color Space:
        </label>
        <select
          value={colorSpace}
          onChange={(e) => setColorSpace(e.target.value as 'RGB' | 'HSV')}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="RGB">RGB</option>
          <option value="HSV">HSV</option>
        </select>
      </div>
      {imageData && (
        <SliderGroup
          imageData={imageData}
          colorSpace={colorSpace}
          rRange={rRange}
          setRRange={setRRange}
          gRange={gRange}
          setGRange={setGRange}
          bRange={bRange}
          setBRange={setBRange}
          hRange={hRange}
          setHRange={setHRange}
          sRange={sRange}
          setSRange={setSRange}
          vRange={vRange}
          setVRange={setVRange}
          applyMask={applyMask}
        />
      )}
      <CanvasPair
        origCanvasRef={origCanvasRef}
        maskCanvasRef={maskCanvasRef}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        downloadMask={downloadMask}
        minSize={minSize}
        onMinSizeChange={handleMinSizeChange}
      />
      <button
        onClick={saveSettings}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        type="button"
      >
        Save Current Settings
      </button>
      <button
        onClick={calculateStatistics}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 ml-10"
        type="button"
      >
        Calculate Statistics
      </button>
      <SavedSettingsTable rgbSettings={savedRGB} hsvSettings={savedHSV} stats={stats} onApply={applySaved} />
    </div>
  );
}
