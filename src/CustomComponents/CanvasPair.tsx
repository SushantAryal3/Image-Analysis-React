/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useCallback, useState } from 'react';

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
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const mc = maskCanvasRef.current!;
      const rect = mc.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (mc.width / rect.width);
      const y = (e.clientY - rect.top) * (mc.height / rect.height);
      const displayX = e.clientX - rect.left;
      const displayY = e.clientY - rect.top;
      return { x, y, displayX, displayY };
    },
    [maskCanvasRef],
  );

  const drawBrushPreview = useCallback(
    (displayX: number, displayY: number) => {
      const overlay = overlayCanvasRef.current;
      if (!overlay || !maskCanvasRef.current) return;

      const mc = maskCanvasRef.current;
      const rect = mc.getBoundingClientRect();

      // Set overlay canvas size to match the display size
      overlay.width = rect.width;
      overlay.height = rect.height;

      const ctx = overlay.getContext('2d')!;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (isHovering) {
        // Calculate brush size in display coordinates
        const displayBrushSize = brushSize * (rect.width / mc.width);

        // Draw brush preview rectangle
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        const rectX = displayX - displayBrushSize / 2;
        const rectY = displayY - displayBrushSize / 2;

        ctx.strokeRect(rectX, rectY, displayBrushSize, displayBrushSize);

        // Add crosshair at center
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 1;
        const crossSize = 10;

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(displayX - crossSize, displayY);
        ctx.lineTo(displayX + crossSize, displayY);
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(displayX, displayY - crossSize);
        ctx.lineTo(displayX, displayY + crossSize);
        ctx.stroke();
      }
    },
    [brushSize, isHovering, maskCanvasRef],
  );

  const handleBrush = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasCoordinates(e);
      const mc = maskCanvasRef.current!;
      const ctx = mc.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    },
    [brushSize, getCanvasCoordinates, maskCanvasRef],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { displayX, displayY } = getCanvasCoordinates(e);
      setMousePos({ x: displayX, y: displayY });
      drawBrushPreview(displayX, displayY);

      if (e.buttons === 1) {
        handleBrush(e);
      }
    },
    [getCanvasCoordinates, drawBrushPreview, handleBrush],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d')!;
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
  }, []);

  // Update brush preview when brush size changes
  const handleBrushSizeChange = useCallback(
    (newSize: number) => {
      onBrushSizeChange(newSize);
      if (isHovering) {
        drawBrushPreview(mousePos.x, mousePos.y);
      }
    },
    [onBrushSizeChange, isHovering, mousePos, drawBrushPreview],
  );

  return (
    <div>
      <div className="flex flex-row gap-4">
        <canvas ref={origCanvasRef} className="border border-gray-300 rounded max-w-[45%]" />
        <div className="relative max-w-[45%]">
          <canvas
            ref={maskCanvasRef}
            className="border border-gray-300 rounded w-full"
            onMouseDown={handleBrush}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'none' }} // Hide default cursor
          />
          {/* Overlay canvas for brush preview */}
          <canvas
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none border border-gray-300 rounded"
            style={{ zIndex: 10 }}
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
            onChange={(e) => handleBrushSizeChange(+e.target.value)}
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
