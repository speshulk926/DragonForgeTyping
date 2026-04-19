import { adminApi } from "../../services/api";
import { useAdminData } from "./useAdminData";

interface AttemptRow {
  id: string;
  levelNumber: number;
  levelTitle: string;
  wpm: number;
  accuracy: number;
  heartsRemaining: number;
  pointsAwarded: number;
  passed: boolean;
  completedAt: string;
}

interface ChildDetail {
  child: {
    id: string;
    displayName: string;
    currentStage: string;
    totalPoints: number;
    highestLevelCompleted: number;
    attemptCount: number;
    lastAttemptAt: string | null;
    averageWpm: number | null;
    averageAccuracy: number | null;
    createdAt: string;
  };
  parentEmail: string;
  recentAttempts: AttemptRow[];
}

export default function AdminChildDetail({ childId, onBack }: { childId: string; onBack: () => void }) {
  const { data, loading, error } = useAdminData<ChildDetail>(
    () => adminApi.childDetail(childId) as Promise<ChildDetail>,
    [childId],
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button className="btn btn-admin-secondary" onClick={onBack}>← Back</button>
        <h1 className="admin-title">Kid detail</h1>
        <span />
      </div>

      {loading && <p className="admin-loading">Loading...</p>}
      {error && <p className="admin-error">{error}</p>}
      {data && (
        <div className="admin-content">
          <div className="admin-section">
            <h2 className="admin-section-title">{data.child.displayName}</h2>
            <p className="admin-muted">
              Parent: <span className="admin-mono">{data.parentEmail}</span> · Joined {new Date(data.child.createdAt).toLocaleDateString()}
            </p>

            <div className="admin-cards" style={{ marginTop: 16 }}>
              <StatCard label="Stage" value={data.child.currentStage} />
              <StatCard label="Total Points" value={data.child.totalPoints} />
              <StatCard label="Highest Level" value={data.child.highestLevelCompleted} />
              <StatCard label="Attempts" value={data.child.attemptCount} />
              <StatCard label="Avg WPM" value={data.child.averageWpm?.toFixed(1) ?? "—"} />
              <StatCard
                label="Avg Accuracy"
                value={data.child.averageAccuracy != null ? `${data.child.averageAccuracy.toFixed(1)}%` : "—"}
              />
            </div>
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">Recent attempts (last 50)</h2>
            {data.recentAttempts.length === 0 ? (
              <p className="admin-empty">No attempts yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Level</th>
                      <th>Title</th>
                      <th>WPM</th>
                      <th>Accuracy</th>
                      <th>Hearts</th>
                      <th>Points</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentAttempts.map((a) => (
                      <tr key={a.id}>
                        <td>{new Date(a.completedAt).toLocaleString()}</td>
                        <td>{a.levelNumber}</td>
                        <td>{a.levelTitle}</td>
                        <td>{a.wpm.toFixed(1)}</td>
                        <td>{a.accuracy.toFixed(1)}%</td>
                        <td>{a.heartsRemaining}</td>
                        <td>{a.pointsAwarded}</td>
                        <td className={a.passed ? "admin-pass" : "admin-fail"}>
                          {a.passed ? "✓ Pass" : "✗ Fail"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="admin-card">
      <div className="admin-card-label">{label}</div>
      <div className="admin-card-value">{value}</div>
    </div>
  );
}
