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
  colorSpace: 'RGB' | 'HSV';
  onApply: (rec: SavedSetting) => void;
}
export default function SavedSettingsTable({ rgbSettings, hsvSettings, colorSpace, onApply }: SavedSettingsTableProps) {
  return (
    <div className="space-y-8">
      {colorSpace === 'RGB' && (
        <div>
          <h4 className="mb-4 text-2xl font-semibold">Saved RGB Settings</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Red</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Green</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Blue</th>
                  <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rgbSettings.map((r, idx) => (
                  <tr key={r.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {r.rRange![0]}–{r.rRange![1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {r.gRange![0]}–{r.gRange![1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {r.bRange![0]}–{r.bRange![1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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
      )}

      {colorSpace === 'HSV' && (
        <div>
          <h4 className="mb-4 text-2xl font-semibold">Saved HSV Settings</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Hue</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Saturation</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hsvSettings.map((h, idx) => (
                  <tr key={h.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {h.hRange![0]}–{h.hRange![1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {h.sRange![0]}–{h.sRange![1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {h.vRange![0]}–{h.vRange![1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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
      )}
    </div>
  );
}
