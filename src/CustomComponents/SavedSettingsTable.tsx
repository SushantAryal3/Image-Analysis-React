interface Record {
  name: string;
  rRange?: [number, number];
  gRange?: [number, number];
  bRange?: [number, number];
  hRange?: [number, number];
  sRange?: [number, number];
  vRange?: [number, number];
}

interface Props {
  rgbSettings: Record[];
  hsvSettings: Record[];
  onApply: (r: Record) => void;
}

export default function SavedSettingsTable({ rgbSettings, hsvSettings, onApply }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium">Saved RGB Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">R</th>
                <th className="px-4 py-2 border">G</th>
                <th className="px-4 py-2 border">B</th>
                <th className="px-4 py-2 border">Apply</th>
              </tr>
            </thead>
            <tbody>
              {rgbSettings.map((r) => (
                <tr key={r.name} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{r.name}</td>
                  <td className="px-4 py-2 border text-center">
                    {r.rRange![0]}–{r.rRange![1]}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {r.gRange![0]}–{r.gRange![1]}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {r.bRange![0]}–{r.bRange![1]}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => onApply(r)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      type="button"
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
        <h4 className="text-lg font-medium">Saved HSV Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">H</th>
                <th className="px-4 py-2 border">S</th>
                <th className="px-4 py-2 border">V</th>
                <th className="px-4 py-2 border">Apply</th>
              </tr>
            </thead>
            <tbody>
              {hsvSettings.map((h) => (
                <tr key={h.name} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{h.name}</td>
                  <td className="px-4 py-2 border text-center">
                    {h.hRange![0]}–{h.hRange![1]}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {h.sRange![0]}–{h.sRange![1]}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {h.vRange![0]}–{h.vRange![1]}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => onApply(h)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      type="button"
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
