import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Legend,
} from "recharts";
import { adminApi } from "../../services/api";
import { useAdminData } from "./useAdminData";

interface Overview {
  totalParents: number;
  totalChildren: number;
  totalAttempts: number;
  attemptsLast7Days: number;
  attemptsLast30Days: number;
  activeChildrenLast7Days: number;
  activeChildrenLast30Days: number;
  newParentsLast7Days: number;
  newParentsLast30Days: number;
  averageWpm: number;
  averageAccuracy: number;
  totalPointsAwarded: number;
  stageDistribution: Record<string, number>;
}

interface ActivityPoint {
  date: string;
  attempts: number;
  uniqueChildren: number;
  newParents: number;
}

const STAGE_ORDER = [
  "Egg", "Hatchling", "Drake", "YoungDragon",
  "FireDrake", "ElderDragon", "InfernoDragon",
];

export default function AdminOverview() {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const overview = useAdminData<Overview>(() => adminApi.overview() as Promise<Overview>);
  const activity = useAdminData<ActivityPoint[]>(
    () => adminApi.activity(range) as Promise<ActivityPoint[]>,
    [range],
  );

  if (overview.loading) return <p className="admin-loading">Loading overview...</p>;
  if (overview.error) return <p className="admin-error">{overview.error}</p>;
  if (!overview.data) return null;

  const o = overview.data;
  const stageData = STAGE_ORDER
    .map((s) => ({ stage: s, count: o.stageDistribution[s] ?? 0 }))
    .filter((d) => d.count > 0);

  const activityChartData = (activity.data ?? []).map((p) => ({
    ...p,
    label: new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <div className="admin-overview">
      <div className="admin-cards">
        <StatCard label="Parents" value={o.totalParents} sub={`+${o.newParentsLast7Days} in 7d`} />
        <StatCard label="Kids" value={o.totalChildren} />
        <StatCard label="Total Attempts" value={o.totalAttempts} sub={`${o.attemptsLast7Days} in 7d`} />
        <StatCard label="Active (7d)" value={o.activeChildrenLast7Days} sub={`${o.activeChildrenLast30Days} in 30d`} />
        <StatCard label="Avg WPM" value={o.averageWpm.toFixed(1)} />
        <StatCard label="Avg Accuracy" value={`${o.averageAccuracy.toFixed(1)}%`} />
        <StatCard label="Points Awarded" value={o.totalPointsAwarded.toLocaleString()} />
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h2 className="admin-section-title">Activity</h2>
          <div className="admin-range-toggle">
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                className={`admin-tab ${range === d ? "admin-tab-active" : ""}`}
                onClick={() => setRange(d)}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        {activity.loading ? (
          <p className="admin-loading">Loading activity...</p>
        ) : (
          <div className="admin-chart">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={activityChartData} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#3d2b6b" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#9980b3" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9980b3" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#251a40", border: "1px solid #3d2b6b", borderRadius: 6 }}
                  labelStyle={{ color: "#f0e6ff" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="attempts" stroke="#ff6b35" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="uniqueChildren" stroke="#33ff66" strokeWidth={2} dot={false} name="unique kids" />
                <Line type="monotone" dataKey="newParents" stroke="#ffd700" strokeWidth={2} dot={false} name="new parents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Stage Distribution</h2>
        {stageData.length === 0 ? (
          <p className="admin-empty">No kids yet.</p>
        ) : (
          <div className="admin-chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stageData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#3d2b6b" strokeDasharray="3 3" />
                <XAxis dataKey="stage" stroke="#9980b3" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} stroke="#9980b3" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#251a40", border: "1px solid #3d2b6b", borderRadius: 6 }}
                  labelStyle={{ color: "#f0e6ff" }}
                />
                <Bar dataKey="count" fill="#ff6b35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="admin-card">
      <div className="admin-card-label">{label}</div>
      <div className="admin-card-value">{value}</div>
      {sub && <div className="admin-card-sub">{sub}</div>}
    </div>
  );
}
