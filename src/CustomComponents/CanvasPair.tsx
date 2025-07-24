/* eslint-disable jsx-a11y/label-has-associated-control, no-multi-assign */
import { useRef, useCallback, useState } from 'react';

interface Props {
  origCanvasRef: React.RefObject<HTMLCanvasElement>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement>;
  combinedCanvasRef: React.RefObject<HTMLCanvasElement>;
  brushSize: number;
  onBrushSizeChange: (n: number) => void;
  downloadMask: (whichImage: React.RefObject<HTMLCanvasElement>) => void;
  minSize: number;
  onMinSizeChange: (n: number) => void;
  multiMode: boolean;
  multiImageMaskSave: () => void;
}

export default function CanvasPair({
  origCanvasRef,
  maskCanvasRef,
  combinedCanvasRef,
  brushSize,
  onBrushSizeChange,
  downloadMask,
  minSize,
  onMinSizeChange,
  multiMode,
  multiImageMaskSave,
}: Props) {
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [brushMode, setBrushMode] = useState<'erase' | 'add'>('erase');
  const [zoom, setZoom] = useState(1);

  /* Get the coordinates of the mouse event relative to the mask canvas */
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

  /* Draw a preview of the brush on the overlay canvas */
  const drawBrushPreview = useCallback(
    (displayX: number, displayY: number) => {
      const overlay = overlayCanvasRef.current;
      if (!overlay || !maskCanvasRef.current) return;

      const mc = maskCanvasRef.current;
      const rect = mc.getBoundingClientRect();

      overlay.width = rect.width;
      overlay.height = rect.height;

      const ctx = overlay.getContext('2d')!;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (isHovering) {
        const displayBrushSize = brushSize * (rect.width / mc.width);

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        const rectX = displayX - displayBrushSize / 2;
        const rectY = displayY - displayBrushSize / 2;

        ctx.strokeRect(rectX, rectY, displayBrushSize, displayBrushSize);

        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 1;
        const crossSize = 10;

        ctx.beginPath();
        ctx.moveTo(displayX - crossSize, displayY);
        ctx.lineTo(displayX + crossSize, displayY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(displayX, displayY - crossSize);
        ctx.lineTo(displayX, displayY + crossSize);
        ctx.stroke();
      }
    },
    [brushSize, isHovering, maskCanvasRef],
  );

  /* Handle brush actions for adding or erasing */
  const handleBrush = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasCoordinates(e);
      const mc = maskCanvasRef.current!;
      const ctx = mc.getContext('2d')!;
      const half = brushSize / 2;

      if (brushMode === 'erase') {
        ctx.fillStyle = 'white';
        ctx.fillRect(x - half, y - half, brushSize, brushSize);
      } else {
        const oc = origCanvasRef.current!;
        const octx = oc.getContext('2d')!;
        const imgData = octx.getImageData(Math.max(0, x - half), Math.max(0, y - half), brushSize, brushSize);
        ctx.putImageData(imgData, x - half, y - half);
      }
    },
    [brushSize, brushMode, getCanvasCoordinates, origCanvasRef, maskCanvasRef],
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

  /* Handle brush size changes and redraw the preview */
  const handleBrushSizeChange = useCallback(
    (newSize: number) => {
      onBrushSizeChange(newSize);
      if (isHovering) {
        drawBrushPreview(mousePos.x, mousePos.y);
      }
    },
    [onBrushSizeChange, isHovering, mousePos, drawBrushPreview],
  );

  /* Invert the mask by replacing white pixels with original image pixels */
  const handleInvertMask = useCallback(() => {
    const oc = origCanvasRef.current!;
    const mc = maskCanvasRef.current!;
    const octx = oc.getContext('2d')!;
    const mctx = mc.getContext('2d')!;

    const origData = octx.getImageData(0, 0, oc.width, oc.height);
    const maskData = mctx.getImageData(0, 0, mc.width, mc.height);

    const dOrig = origData.data;
    const dMask = maskData.data;

    for (let i = 0; i < dMask.length; i += 4) {
      const r = dMask[i];
      const g = dMask[i + 1];
      const b = dMask[i + 2];
      if (r === 255 && g === 255 && b === 255) {
        dMask[i] = dOrig[i];
        dMask[i + 1] = dOrig[i + 1];
        dMask[i + 2] = dOrig[i + 2];
      } else {
        dMask[i] = dMask[i + 1] = dMask[i + 2] = 255;
      }
      dMask[i + 3] = 255;
    }
    mctx.putImageData(maskData, 0, 0);
  }, [origCanvasRef, maskCanvasRef]);

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
            style={{ cursor: 'none' }}
          />
          <canvas
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none border border-gray-300 rounded"
            style={{ zIndex: 10 }}
          />
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 mr-[8vw]">
        <select
          value={brushMode}
          onChange={(e) => setBrushMode(e.target.value as 'erase' | 'add')}
          className="border rounded px-2 py-1 mt-5"
        >
          <option value="erase">Erase</option>
          <option value="add">Add from original</option>
        </select>
        <button
          onClick={handleInvertMask}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 ml-10"
          type="button"
        >
          Invert Mask
        </button>
        <button
          onClick={() => downloadMask(maskCanvasRef)}
          title="Download Mask"
          className=" bg-white border border-gray-300 mt-4 rounded-full px-3 shadow hover:bg-gray-100"
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
      {multiMode && (
        <>
          <button
            type="button"
            onClick={multiImageMaskSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 ml-10"
          >
            Add this UnMasked
          </button>
          <div className="relative max-w-[45%]">
            <canvas ref={combinedCanvasRef} className="border border-gray-300 rounded w-full" />
          </div>
          <button
            onClick={() => downloadMask(combinedCanvasRef)}
            title="Download Mask"
            className=" bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
            type="button"
          >
            ⬇️
          </button>
        </>
      )}
    </div>
  );
}
