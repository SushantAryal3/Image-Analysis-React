/* eslint-disable no-nested-ternary, no-continue */
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  ChartData,
  ChartOptions,
  ChartDataset,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, annotationPlugin);

export type Range2 = [number, number];
type Channel = 'r' | 'g' | 'b' | 'h' | 's' | 'v';

interface HistogramProps {
  imageData: ImageData;
  channel: Channel;
  selection: Range2;
  isFurtherAnalysis?: boolean;
}

const CHANNEL_NAMES: Record<Channel, string> = {
  r: 'Red',
  g: 'Green',
  b: 'Blue',
  h: 'Hue',
  s: 'Saturation',
  v: 'Value',
};

const MAX_VALUES: Record<Channel, number> = {
  r: 255,
  g: 255,
  b: 255,
  h: 359,
  s: 100,
  v: 100,
};

const SOLID_FILLS: Record<'r' | 'g' | 'b' | 's' | 'v', string> = {
  r: 'rgba(255,0,0,0.6)',
  g: 'rgba(0,255,0,0.6)',
  b: 'rgba(0,0,255,0.6)',
  s: 'rgba(128,128,128,0.6)',
  v: 'rgba(128,128,128,0.3)',
};

export const HistogramChart: React.FC<HistogramProps> = ({
  imageData,
  channel,
  selection: [minSel, maxSel],
  isFurtherAnalysis = false,
}) => {
  const maxValue = MAX_VALUES[channel];
  const bins = maxValue + 1;

  // Option 2: Use separate bin for "undefined" hue
  const { histPoints, histFills } = useMemo(() => {
    const counts = new Array<number>(bins + 1).fill(0); // Extra bin for undefined hue
    const { data } = imageData;
    const pixelCount = data.length / 4;
    const maxValue = channel === 'h' ? 360 : channel === 's' || channel === 'v' ? 100 : 255;

    for (let i = 0; i < pixelCount; i++) {
      const idx = i * 4;
      const R = data[idx];
      const G = data[idx + 1];
      const B = data[idx + 2];
      if (isFurtherAnalysis && R === 255 && G === 255 && B === 255) {
        continue;
      }

      let value: number;
      let isUndefinedHue = false;

      if (channel === 'r' || channel === 'g' || channel === 'b') {
        const map = { r: 0, g: 1, b: 2 } as const;
        value = data[idx + map[channel]];
      } else {
        const rv = R / 255;
        const gv = G / 255;
        const bv = B / 255;
        const mx = Math.max(rv, gv, bv);
        const mn = Math.min(rv, gv, bv);
        const d = mx - mn;

        const s = mx === 0 ? 0 : d / mx;

        // Mark low-saturation pixels as undefined hue
        if (channel === 'h' && s < 0.1) {
          isUndefinedHue = true;
        }

        let h = 0;
        if (d > 0) {
          if (mx === rv) h = ((gv - bv) / d) % 6;
          else if (mx === gv) h = (bv - rv) / d + 2;
          else h = (rv - gv) / d + 4;
        }

        h = (h / 6) % 1;
        if (h < 0) h += 1;

        const v = mx;

        if (channel === 'h') value = h * 360;
        else if (channel === 's') value = s * 100;
        else value = v * 100;
      }

      let binIndex: number;
      if (isUndefinedHue) {
        binIndex = bins; // Last bin for undefined hue
      } else {
        binIndex = Math.min(bins - 1, Math.floor((value / maxValue) * bins));
      }
      counts[binIndex]++;
    }

    const histPoints = counts.slice(0, bins).map((cnt, i) => ({ x: i, y: cnt })); // Exclude undefined bin from display
    const histFills = histPoints.map(({ x }) => {
      if (channel === 'h') {
        const hue = (x / bins) * 360;
        return `hsl(${hue},100%,50%)`;
      }
      return SOLID_FILLS[channel as 'r' | 'g' | 'b' | 's' | 'v'];
    });

    return { histPoints, histFills };
  }, [imageData, channel, bins, isFurtherAnalysis]);

  const chartData = useMemo<ChartData<'bar', { x: number; y: number }[]>>(
    () => ({
      datasets: [
        {
          label: 'Pixels',
          data: histPoints,
          parsing: { xAxisKey: 'x', yAxisKey: 'y' },
          backgroundColor: histFills,
          barPercentage: 1,
          categoryPercentage: 1,
          borderRadius: 0,
        } as ChartDataset<'bar', { x: number; y: number }[]>,
      ],
    }),
    [histPoints, histFills],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          min: minSel,
          max: maxSel,
          grid: { display: false },
          ticks: { display: false },
        },
        y: { display: false, grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: CHANNEL_NAMES[channel],
          align: 'start',
          font: { size: 14, weight: 'bold' },
          padding: { bottom: 6 },
        },
        tooltip: {
          callbacks: {
            title: ([ctx]) => `Value: ${ctx.parsed.x}`,
            label: (ctx) => `Count: ${ctx.parsed.y}`,
          },
        },
        annotation: {
          annotations: {
            minLine: { type: 'line', xMin: minSel, xMax: minSel, borderColor: '#000', borderWidth: 2 },
            maxLine: { type: 'line', xMin: maxSel, xMax: maxSel, borderColor: '#000', borderWidth: 2 },
          },
        },
      },
    }),
    [channel, minSel, maxSel],
  );

  return (
    <div style={{ width: '100%', height: 100, marginBottom: 8 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HistogramChart;
