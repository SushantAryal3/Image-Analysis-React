/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

interface Props {
  origCanvasRef: React.RefObject<HTMLCanvasElement>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement>;
  brushSize: number;
  onBrushSizeChange: (n: number) => void;
  downloadMask: () => void;
  minSize: number;
  onMinSizeChange: (n: number) => void;
}

export default function CanvasPair({
  origCanvasRef,
  maskCanvasRef,
  brushSize,
  onBrushSizeChange,
  downloadMask,
  minSize,
  onMinSizeChange,
}: Props) {
  const handleBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mc = maskCanvasRef.current!;
    const rect = mc.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (mc.width / rect.width);
    const y = (e.clientY - rect.top) * (mc.height / rect.height);
    const ctx = mc.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
  };
  return (
    <div>
      <div className="flex flex-row gap-4">
        <canvas ref={origCanvasRef} className="border border-gray-300 rounded max-w-[45%]" />
        <div className="relative max-w-[45%]">
          <canvas
            ref={maskCanvasRef}
            className="border border-gray-300 rounded w-full"
            onMouseDown={handleBrush}
            onMouseMove={(e) => e.buttons === 1 && handleBrush(e)}
          />
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 mr-[8vw]">
        <button
          onClick={downloadMask}
          title="Download Mask"
          className=" bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
          type="button"
        >
          ⬇️
        </button>
        <div className="mt-4 flex items-center justify-center">
          <label className="font-medium" htmlFor="brushSize">
            Brush Size: <span className="font-semibold">{brushSize}</span>
          </label>
          <input
            id="brushSize"
            type="range"
            min={2}
            max={300}
            value={brushSize}
            onChange={(e) => onBrushSizeChange(+e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium mr-2" htmlFor="noiseThreshold">
            Noise Threshold:
          </label>
          <input
            id="noiseThreshold"
            type="number"
            min={0}
            step={1}
            value={minSize}
            onChange={(e) => onMinSizeChange(Number(e.target.value))}
            className="mt-1 w-16 border rounded px-1"
          />
        </div>
      </div>
    </div>
  );
}
