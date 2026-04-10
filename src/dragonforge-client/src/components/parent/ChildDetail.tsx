import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { parentFetchJson } from "../../services/api";
import type { EvolutionStage } from "../../types/game";
import DragonAvatar from "../shared/DragonAvatar";

interface Child {
  id: string;
  displayName: string;
  currentStage: string;
  totalPoints: number;
  highestLevelCompleted: number;
}

interface Attempt {
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

interface Session {
  id: string;
  deviceName: string | null;
  createdAt: string;
  expiresAt: string;
}

interface Props {
  child: Child;
  onBack: () => void;
  onGenerateCode: () => void;
}

export default function ChildDetail({ child, onBack, onGenerateCode }: Props) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tab, setTab] = useState<"progress" | "sessions">("progress");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      parentFetchJson(`/api/children/${child.id}/attempts`),
      parentFetchJson(`/api/children/${child.id}/sessions`),
    ]).then(([att, sess]) => {
      setAttempts(att);
      setSessions(sess);
    }).finally(() => setLoading(false));
  }, [child.id]);

  // Chart data — last 30 attempts, chronological
  const chartData = [...attempts]
    .reverse()
    .slice(-30)
    .map((a, i) => ({
      index: i + 1,
      wpm: a.wpm,
      accuracy: a.accuracy,
      level: a.levelNumber,
    }));

  const handleRevokeSession = async (sessionId: string) => {
    await parentFetchJson(`/api/children/${child.id}/sessions/${sessionId}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  return (
    <div className="parent-dashboard">
      <div className="parent-header">
        <button className="btn btn-parent-secondary" onClick={onBack}>← Back</button>
        <h1 className="parent-title">{child.displayName}</h1>
        <button className="btn btn-generate-code" onClick={onGenerateCode}>
          Generate Code
        </button>
      </div>

      {/* Profile Summary */}
      <div className="child-detail-summary">
        <DragonAvatar
          stage={child.currentStage as EvolutionStage}
          highestLevelCompleted={child.highestLevelCompleted}
          size={100}
        />
        <div className="child-detail-stats">
          <div className="detail-stat">
            <span className="detail-stat-label">Stage</span>
            <span className="detail-stat-value">{child.currentStage}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Points</span>
            <span className="detail-stat-value">{child.totalPoints}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Level</span>
            <span className="detail-stat-value">{child.highestLevelCompleted}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Attempts</span>
            <span className="detail-stat-value">{attempts.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button
          className={`detail-tab ${tab === "progress" ? "active" : ""}`}
          onClick={() => setTab("progress")}
        >
          Progress
        </button>
        <button
          className={`detail-tab ${tab === "sessions" ? "active" : ""}`}
          onClick={() => setTab("sessions")}
        >
          Devices ({sessions.length})
        </button>
      </div>

      {loading ? (
        <p className="parent-loading">Loading...</p>
      ) : tab === "progress" ? (
        <div className="detail-progress">
          {/* WPM Chart */}
          {chartData.length > 1 && (
            <>
              <h3 className="chart-title">Words Per Minute</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d2b6b" />
                    <XAxis dataKey="index" stroke="#9980b3" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9980b3" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#251a40", border: "1px solid #3d2b6b", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#9980b3" }}
                      labelFormatter={(v) => `Attempt ${v}`}
                    />
                    <Line type="monotone" dataKey="wpm" stroke="#ff6b35" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h3 className="chart-title">Accuracy %</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d2b6b" />
                    <XAxis dataKey="index" stroke="#9980b3" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} stroke="#9980b3" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#251a40", border: "1px solid #3d2b6b", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#9980b3" }}
                      labelFormatter={(v) => `Attempt ${v}`}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#33ff66" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Level History Table */}
          <h3 className="chart-title">Level History</h3>
          {attempts.length === 0 ? (
            <p className="parent-empty">No attempts yet.</p>
          ) : (
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>WPM</th>
                    <th>Accuracy</th>
                    <th>Points</th>
                    <th>Result</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id}>
                      <td>{a.levelNumber}. {a.levelTitle}</td>
                      <td>{a.wpm}</td>
                      <td>{a.accuracy}%</td>
                      <td>{a.pointsAwarded}</td>
                      <td>{a.passed ? "Pass" : "Fail"}</td>
                      <td>{new Date(a.completedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="detail-sessions">
          {sessions.length === 0 ? (
            <p className="parent-empty">No active sessions.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="session-card">
                <div className="session-info">
                  <span className="session-device">{s.deviceName || "Unknown device"}</span>
                  <span className="session-date">
                    Added {new Date(s.createdAt).toLocaleDateString()} &middot; Expires {new Date(s.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="btn btn-parent-danger"
                  onClick={() => handleRevokeSession(s.id)}
                >
                  Revoke
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
