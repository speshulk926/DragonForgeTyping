import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { adminApi } from "../../services/api";
import { useAdminData } from "./useAdminData";

interface LevelStats {
  levelNumber: number;
  title: string;
  phase: string;
  attemptCount: number;
  passCount: number;
  passRate: number;
  averageWpm: number | null;
  averageAccuracy: number | null;
  uniquePlayers: number;
}

export default function AdminLevels() {
  const { data, loading, error } = useAdminData<LevelStats[]>(
    () => adminApi.levels() as Promise<LevelStats[]>,
  );

  if (loading) return <p className="admin-loading">Loading levels...</p>;
  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return null;

  const chartData = data.map((l) => ({
    level: l.levelNumber,
    attempts: l.attemptCount,
    passRate: l.passRate,
  }));

  return (
    <div>
      <div className="admin-section">
        <h2 className="admin-section-title">Attempts & Pass Rate per Level</h2>
        <div className="admin-chart">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#3d2b6b" strokeDasharray="3 3" />
              <XAxis dataKey="level" stroke="#9980b3" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#9980b3" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#33ff66" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#251a40", border: "1px solid #3d2b6b", borderRadius: 6 }}
                labelStyle={{ color: "#f0e6ff" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="attempts" fill="#ff6b35" radius={[3, 3, 0, 0]} />
              <Bar yAxisId="right" dataKey="passRate" fill="#33ff66" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Per-Level Detail</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Phase</th>
                <th>Attempts</th>
                <th>Pass rate</th>
                <th>Avg WPM</th>
                <th>Avg Acc</th>
                <th>Unique players</th>
              </tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr key={l.levelNumber}>
                  <td>{l.levelNumber}</td>
                  <td>{l.title}</td>
                  <td><span className={`admin-phase admin-phase-${l.phase.toLowerCase()}`}>{l.phase}</span></td>
                  <td>{l.attemptCount}</td>
                  <td>{l.attemptCount === 0 ? "—" : `${l.passRate.toFixed(1)}%`}</td>
                  <td>{l.averageWpm?.toFixed(1) ?? "—"}</td>
                  <td>{l.averageAccuracy != null ? `${l.averageAccuracy.toFixed(1)}%` : "—"}</td>
                  <td>{l.uniquePlayers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
