import { useState } from 'react';

interface Props {
  origCanvasRef: React.RefObject<HTMLCanvasElement>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement>;
  brushSize: number;
  onBrushSizeChange: (n: number) => void;
  downloadMask: () => void;
}

export default function CanvasPair({
  origCanvasRef,
  maskCanvasRef,
  brushSize,
  onBrushSizeChange,
  downloadMask,
}: Props) {
  const [broomState, changeBroomState] = useState<Boolean>(false);
  const handleBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!broomState) return;
    const mc = maskCanvasRef.current!;
    const rect = mc.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (mc.width / rect.width);
    const y = (e.clientY - rect.top) * (mc.height / rect.height);
    const ctx = mc.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
  };
  return (
    <div className="flex flex-row gap-4">
      <canvas ref={origCanvasRef} className="border border-gray-300 rounded max-w-[45%]" />
      <div className="relative max-w-[45%]">
        <canvas
          ref={maskCanvasRef}
          className="border border-gray-300 rounded w-full"
          onMouseDown={handleBrush}
          onMouseMove={(e) => e.buttons === 1 && handleBrush(e)}
        />
        <button
          onClick={() => {
            changeBroomState(!broomState);
          }}
          title="Toggle Brush Mode"
          className="absolute top-2 right-14 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
          type="button"
        >
          🖌
        </button>
        <button
          onClick={downloadMask}
          title="Download Mask"
          className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
          type="button"
        >
          ⬇️
        </button>
        {broomState && (
          <div className="absolute top-2 left-2">
            <div className="mt-4 flex items-center space-x-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
