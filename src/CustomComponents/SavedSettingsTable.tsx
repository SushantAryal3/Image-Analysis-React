export interface SavedSetting {
  name: string;
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
  stats: { name: string; plant: number; noise: number; total: number; width: number; height: number }[];
  onApply: (rec: SavedSetting) => void;
}
export default function SavedSettingsTable({ rgbSettings, hsvSettings, stats, onApply }: SavedSettingsTableProps) {
  const downloadStatsCsv = () => {
    if (stats.length === 0) return;

    const headers = ['Name', 'Width', 'Height', 'Plant Pixels', 'Noise Pixels', 'Total Pixels', '% Plant'];
    const rows = stats.map((s) => [
      s.name,
      s.width,
      s.height,
      s.plant,
      s.noise,
      s.total,
      `${((s.plant / s.total) * 100).toFixed(2)}%`,
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'moss_statistics.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
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
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                Width
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                Hight
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                Plant Pixels
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                Noise Pixels
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                Total Pixels
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                % Plant
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => (
              <tr key={s.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                  {s.width.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                  {s.height.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                  {s.plant.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                  {s.noise.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                  {s.total.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                  {((s.plant / s.total) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h4 className="mb-4 text-2xl font-semibold">Saved RGB Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                  Red
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                  Green
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                  Blue
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium uppercase tracking-wider">
                  Apply
                </th>
              </tr>
            </thead>
            <tbody>
              {rgbSettings.map((r, idx) => (
                <tr key={r.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                    {r.rRange![0]}–{r.rRange![1]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                    {r.gRange![0]}–{r.gRange![1]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                    {r.bRange![0]}–{r.bRange![1]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => onApply(r)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-2xl font-semibold">Saved HSV Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                  Hue
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                  Saturation
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                  Value
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium uppercase tracking-wider">
                  Apply
                </th>
              </tr>
            </thead>
            <tbody>
              {hsvSettings.map((h, idx) => (
                <tr key={h.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900">{h.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                    {h.hRange![0]}–{h.hRange![1]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                    {h.sRange![0]}–{h.sRange![1]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-right">
                    {h.vRange![0]}–{h.vRange![1]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => onApply(h)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
