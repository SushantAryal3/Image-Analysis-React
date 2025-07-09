import { useMemo } from 'react';
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

type XY = { x: number; y: number };

// Friendly channel names
const CHANNEL_NAMES: Record<Channel, string> = {
  r: 'Red',
  g: 'Green',
  b: 'Blue',
  h: 'Hue',
  s: 'Saturation',
  v: 'Value',
};

// Max values per channel
const MAX_VALUES: Record<Channel, number> = {
  r: 255,
  g: 255,
  b: 255,
  h: 360,
  s: 100,
  v: 100,
};

// Solid fills for non-H channels
const SOLID_FILLS: Record<'r' | 'g' | 'b' | 's' | 'v', string> = {
  r: 'rgba(255,0,0,0.6)',
  g: 'rgba(0,255,0,0.6)',
  b: 'rgba(0,0,255,0.6)',
  s: 'rgba(128,128,128,0.6)',
  v: 'rgba(128,128,128,0.3)',
};

interface HistogramChartProps {
  imageData: ImageData;
  channel: Channel;
  selection: Range2;
}

export function HistogramChart({ imageData, channel, selection: [minSel, maxSel] }: HistogramChartProps) {
  const maxValue = MAX_VALUES[channel];
  const bins = maxValue + 1;

  // eslint-disable-next-line no-shadow
  const { histPoints, histFills } = useMemo(() => {
    const counts = new Array<number>(bins).fill(0);
    const dataArr = imageData.data;
    const pixelCount = dataArr.length / 4;

    for (let i = 0; i < pixelCount; i++) {
      const idx = i * 4;
      let value: number;

      if (channel === 'r' || channel === 'g' || channel === 'b') {
        const map = { r: 0, g: 1, b: 2 } as const;
        value = dataArr[idx + map[channel]];
      } else {
        const rv = dataArr[idx] / 255;
        const gv = dataArr[idx + 1] / 255;
        const bv = dataArr[idx + 2] / 255;
        const mx = Math.max(rv, gv, bv);
        const mn = Math.min(rv, gv, bv);
        const d = mx - mn;
        let h = 0;
        if (d > 0) {
          if (mx === rv) h = ((gv - bv) / d + (gv < bv ? 6 : 0)) / 6;
          else if (mx === gv) h = ((bv - rv) / d + 2) / 6;
          else h = ((rv - gv) / d + 4) / 6;
        }
        const s = mx === 0 ? 0 : d / mx;
        const v = mx;
        if (channel === 'h') value = h * 360;
        else if (channel === 's') value = s * 100;
        else value = v * 100;
      }

      const binIndex = Math.min(bins - 1, Math.round(value));
      counts[binIndex]++;
    }

    const histPoints: XY[] = counts.map((cnt, i) => ({ x: i, y: cnt }));
    const histFills: string[] = histPoints.map(({ x }) => {
      if (channel === 'h') {
        return `hsl(${(x / maxValue) * 360},100%,50%)`;
      }
      return SOLID_FILLS[channel as 'r' | 'g' | 'b' | 's' | 'v'];
    });

    return { histPoints, histFills };
  }, [imageData, channel, bins, maxValue]);

  const chartData: ChartData<'bar', XY[]> = {
    datasets: [
      {
        label: 'Pixels',
        data: histPoints,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' },
        backgroundColor: histFills,
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 0,
      } as ChartDataset<'bar', XY[]>,
    ],
  };

  const options: ChartOptions<'bar'> = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: maxValue,
        grid: { display: false },
        ticks: { display: false, stepSize: 1, autoSkip: false },
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
          title: ([i]) => `Value: ${i.parsed.x}`,
          label: (i) => `Count: ${i.formattedValue}`,
        },
      },
      annotation: {
        annotations: {
          minLine: { type: 'line', xMin: minSel, xMax: minSel, borderColor: '#000', borderWidth: 2 },
          maxLine: { type: 'line', xMin: maxSel, xMax: maxSel, borderColor: '#000', borderWidth: 2 },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: 100, marginBottom: 8 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
