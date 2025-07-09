import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import type { Range2 } from './RGBThresholdMask';
import { HistogramChart } from './Histogram';

export interface SliderGroupProps {
  colorSpace: 'RGB' | 'HSV';

  rRange: Range2;
  setRRange: (_: Range2) => void;

  gRange: Range2;
  setGRange: (_: Range2) => void;

  bRange: Range2;
  setBRange: (_: Range2) => void;

  hRange: Range2;
  setHRange: (_: Range2) => void;

  sRange: Range2;
  setSRange: (_: Range2) => void;

  vRange: Range2;
  setVRange: (_: Range2) => void;
  imageData: ImageData;
  applyMask: () => void;
}

export default function SliderGroup({
  colorSpace,
  rRange,
  setRRange,
  gRange,
  setGRange,
  bRange,
  setBRange,
  hRange,
  setHRange,
  sRange,
  setSRange,
  vRange,
  setVRange,
  imageData,
  applyMask,
}: SliderGroupProps) {
  const isRGB = colorSpace === 'RGB';

  return (
    <div className="flex flex-wrap gap-6">
      {isRGB ? (
        <>
          <div className="flex flex-col w-full sm:w-1/3">
            <HistogramChart imageData={imageData} channel="r" selection={rRange} />
            <label htmlFor="rRangeSlider" className="mb-2 font-medium text-gray-700">
              R:{' '}
              <span className="font-semibold">
                {rRange[0]}–{rRange[1]}
              </span>
            </label>
            <Slider
              id="rRangeSlider"
              range
              allowCross={false}
              min={0}
              max={255}
              value={rRange}
              onChange={(vals) => setRRange(vals as Range2)}
              onChangeComplete={() => applyMask()}
            />
          </div>
          <div className="flex flex-col w-full sm:w-1/3">
            <HistogramChart imageData={imageData} channel="g" selection={gRange} />
            <label className="mb-2 font-medium text-gray-700" htmlFor="gRangeSlider">
              G:{' '}
              <span className="font-semibold">
                {gRange[0]}–{gRange[1]}
              </span>
            </label>
            <Slider
              id="gRangeSlider"
              range
              allowCross={false}
              min={0}
              max={255}
              value={gRange}
              onChange={(vals) => setGRange(vals as Range2)}
              onChangeComplete={() => applyMask()}
            />
          </div>
          <div className="flex flex-col w-full sm:w-1/3">
            <HistogramChart imageData={imageData} channel="b" selection={bRange} />
            <label className="mb-2 font-medium text-gray-700" htmlFor="bRangeSlider">
              B:{' '}
              <span className="font-semibold">
                {bRange[0]}–{bRange[1]}
              </span>
            </label>
            <Slider
              id="bRangeSlider"
              range
              allowCross={false}
              min={0}
              max={255}
              value={bRange}
              onChange={(vals) => setBRange(vals as Range2)}
              onChangeComplete={() => applyMask()}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full sm:w-1/3">
            <HistogramChart imageData={imageData} channel="h" selection={hRange} />
            <label className="mb-2 font-medium text-gray-700" htmlFor="hRangeSlider">
              H:{' '}
              <span className="font-semibold">
                {hRange[0]}–{hRange[1]}
              </span>
            </label>
            <Slider
              id="hRangeSlider"
              range
              allowCross={false}
              min={0}
              max={360}
              value={hRange}
              onChange={(vals) => setHRange(vals as Range2)}
              onChangeComplete={() => applyMask()}
            />
          </div>
          <div className="flex flex-col w-full sm:w-1/3">
            <HistogramChart imageData={imageData} channel="s" selection={sRange} />
            <label className="mb-2 font-medium text-gray-700" htmlFor="sRangeSlider">
              S:{' '}
              <span className="font-semibold">
                {sRange[0]}–{sRange[1]}
              </span>
            </label>
            <Slider
              id="sRangeSlider"
              range
              allowCross={false}
              min={0}
              max={100}
              value={sRange}
              onChange={(vals) => setSRange(vals as Range2)}
              onChangeComplete={() => applyMask()}
            />
          </div>
          <div className="flex flex-col w-full sm:w-1/3">
            <HistogramChart imageData={imageData} channel="v" selection={vRange} />

            <label className="mb-2 font-medium text-gray-700" htmlFor="vRangeSlider">
              V:{' '}
              <span className="font-semibold">
                {vRange[0]}–{vRange[1]}
              </span>
            </label>
            <Slider
              id="vRangeSlider"
              range
              allowCross={false}
              min={0}
              max={100}
              value={vRange}
              onChange={(vals) => setVRange(vals as Range2)}
              onChangeComplete={() => applyMask()}
            />
          </div>
        </>
      )}
    </div>
  );
}
