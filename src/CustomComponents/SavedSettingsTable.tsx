export interface SavedSetting {
  name: string;
  colorspace?: 'RGB' | 'HSV';
  rRange?: [number, number];
  gRange?: [number, number];
  bRange?: [number, number];
  hRange?: [number, number];
  sRange?: [number, number];
  vRange?: [number, number];
}

interface SavedSettingsTableProps {
  rgbSettings: SavedSetting[];
  hsvSettings: SavedSetting[];
  maskSettings: SavedSetting[];
  stats: { name: string; plant: number; noise: number; total: number; width: number; height: number }[];
  onApply: (rec: SavedSetting) => void;
  onSetOptimal: (rec: SavedSetting) => void;
  selectedOptimalName?: string;
}

export default function SavedSettingsTable({
  rgbSettings,
  hsvSettings,
  maskSettings,
  stats,
  onApply,
  onSetOptimal,
  selectedOptimalName,
}: SavedSettingsTableProps) {
  const downloadStatsCsv = () => {
    if (stats.length === 0) return;

    const rgbMap = new Map<string, SavedSetting>(rgbSettings.map((r) => [r.name, r]));
    const hsvMap = new Map<string, SavedSetting>(hsvSettings.map((h) => [h.name, h]));

    const headers = [
      'Name',
      'Width',
      'Height',
      'Unmasked Pixels',
      'Masked Pixels',
      'Total Pixels',
      '% Unmasked',
      'Red Min',
      'Red Max',
      'Green Min',
      'Green Max',
      'Blue Min',
      'Blue Max',
      'Hue Min',
      'Hue Max',
      'Saturation Min',
      'Saturation Max',
      'Value Min',
      'Value Max',
    ];

    const rows = stats.map((s) => {
      const rgb = rgbMap.get(s.name);
      const hsv = hsvMap.get(s.name);

      const r0 = rgb?.rRange?.[0] ?? '';
      const r1 = rgb?.rRange?.[1] ?? '';
      const g0 = rgb?.gRange?.[0] ?? '';
      const g1 = rgb?.gRange?.[1] ?? '';
      const b0 = rgb?.bRange?.[0] ?? '';
      const b1 = rgb?.bRange?.[1] ?? '';

      const h0 = hsv?.hRange?.[0] ?? '';
      const h1 = hsv?.hRange?.[1] ?? '';
      const s0 = hsv?.sRange?.[0] ?? '';
      const s1 = hsv?.sRange?.[1] ?? '';
      const v0 = hsv?.vRange?.[0] ?? '';
      const v1 = hsv?.vRange?.[1] ?? '';

      return [
        s.name,
        s.width,
        s.height,
        s.plant,
        s.noise,
        s.total,
        `${((s.plant / s.total) * 100).toFixed(2)}%`,
        r0,
        r1,
        g0,
        g1,
        b0,
        b1,
        h0,
        h1,
        s0,
        s1,
        v0,
        v1,
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'moss_statistics.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* --- Statistics Table --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold">Moss Statistics</h4>
          <button
            type="button"
            onClick={downloadStatsCsv}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">Name</th>
              <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Width</th>
              <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Height</th>
              <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Unmasked</th>
              <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Masked</th>
              <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Total</th>
              <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">% Unmasked</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => (
              <tr key={s.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border px-4 py-2 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="border px-4 py-2 text-sm text-gray-700 text-right">{s.width.toLocaleString()}</td>
                <td className="border px-4 py-2 text-sm text-gray-700 text-right">{s.height.toLocaleString()}</td>
                <td className="border px-4 py-2 text-sm text-gray-700 text-right">{s.plant.toLocaleString()}</td>
                <td className="border px-4 py-2 text-sm text-gray-700 text-right">{s.noise.toLocaleString()}</td>
                <td className="border px-4 py-2 text-sm text-gray-700 text-right">{s.total.toLocaleString()}</td>
                <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                  {((s.plant / s.total) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- RGB Settings --- */}
      <div>
        <h4 className="mb-4 text-2xl font-semibold">Saved RGB Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">Name</th>
                <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Red</th>
                <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Green</th>
                <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Blue</th>
                <th className="border px-4 py-2 text-center text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rgbSettings.map((r, idx) => {
                const isOpt = r.name === selectedOptimalName;
                return (
                  <tr
                    key={r.name}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                      isOpt ? 'bg-yellow-100 border-l-4 border-yellow-500' : ''
                    }`}
                  >
                    <td className="border px-4 py-2 text-sm font-medium text-gray-900">{r.name}</td>
                    <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                      {r.rRange![0]}–{r.rRange![1]}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                      {r.gRange![0]}–{r.gRange![1]}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                      {r.bRange![0]}–{r.bRange![1]}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onApply(r)}
                        className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => onSetOptimal(r)}
                        className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Set Optimal
                      </button>
                      {isOpt && (
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">
                          Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- HSV Settings --- */}
      <div>
        <h4 className="mb-4 text-2xl font-semibold">Saved HSV Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">Name</th>
                <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Hue</th>
                <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Saturation</th>
                <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Value</th>
                <th className="border px-4 py-2 text-center text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hsvSettings.map((h, idx) => {
                const isOpt = h.name === selectedOptimalName;
                return (
                  <tr
                    key={h.name}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                      isOpt ? 'bg-yellow-100 border-l-4 border-yellow-500' : ''
                    }`}
                  >
                    <td className="border px-4 py-2 text-sm font-medium text-gray-900">{h.name}</td>
                    <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                      {h.hRange![0]}–{h.hRange![1]}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                      {h.sRange![0]}–{h.sRange![1]}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                      {h.vRange![0]}–{h.vRange![1]}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onApply(h)}
                        className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => onSetOptimal(h)}
                        className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Set Optimal
                      </button>
                      {isOpt && (
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">
                          Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {maskSettings.length > 0 && (
        <div>
          <h4 className="mb-4 text-2xl font-semibold">Multicolor Analysis Values</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">Name</th>
                  <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Red</th>
                  <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Green</th>
                  <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Blue</th>
                  <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Hue</th>
                  <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                    Saturation
                  </th>
                  <th className="border px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {maskSettings.map((m, idx) => {
                  const prevSame = idx > 0 && maskSettings[idx - 1].name === m.name;
                  const nextSame = idx < maskSettings.length - 1 && maskSettings[idx + 1].name === m.name;
                  const groupBorderClass = `${!prevSame ? 'border-t-4 border-gray-400' : ''} ${
                    !nextSame ? 'border-b-4 border-gray-400' : ''
                  }`;
                  return (
                    <tr className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${groupBorderClass}`}>
                      <td className="border px-4 py-2 text-sm font-medium text-gray-900">{m.name}</td>
                      <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                        {m.colorspace === 'RGB' ? `${m.rRange![0]}–${m.rRange![1]}` : '-'}
                      </td>
                      <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                        {m.colorspace === 'RGB' ? `${m.gRange![0]}–${m.gRange![1]}` : '-'}
                      </td>
                      <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                        {m.colorspace === 'RGB' ? `${m.bRange![0]}–${m.bRange![1]}` : '-'}
                      </td>
                      <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                        {m.colorspace === 'HSV' ? `${m.hRange![0]}–${m.hRange![1]}` : '-'}
                      </td>
                      <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                        {m.colorspace === 'HSV' ? `${m.sRange![0]}–${m.sRange![1]}` : '-'}
                      </td>
                      <td className="border px-4 py-2 text-sm text-gray-700 text-right">
                        {m.colorspace === 'HSV' ? `${m.vRange![0]}–${m.vRange![1]}` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
