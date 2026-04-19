import { useState, useMemo, Fragment } from "react";
import { adminApi } from "../../services/api";
import { useAdminData } from "./useAdminData";

interface ChildRow {
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
}

interface ParentRow {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  childCount: number;
  totalAttempts: number;
  lastAttemptAt: string | null;
  children: ChildRow[];
}

export default function AdminParents({ onSelectChild }: { onSelectChild: (id: string) => void }) {
  const { data, loading, error } = useAdminData<ParentRow[]>(
    () => adminApi.parents() as Promise<ParentRow[]>,
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) =>
      p.email.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.children.some((c) => c.displayName.toLowerCase().includes(q)),
    );
  }, [data, search]);

  if (loading) return <p className="admin-loading">Loading parents...</p>;
  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return null;

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <input
        type="search"
        className="admin-input admin-search"
        placeholder="Search parents or kids..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="admin-empty">No matching parents.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Parent</th>
                <th>Email</th>
                <th>Kids</th>
                <th>Attempts</th>
                <th>Last active</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isOpen = expanded.has(p.id);
                return (
                  <Fragment key={p.id}>
                    <tr
                      className={`admin-row ${isOpen ? "admin-row-open" : ""}`}
                      onClick={() => toggle(p.id)}
                    >
                      <td className="admin-chevron">{isOpen ? "▼" : "▶"}</td>
                      <td>{p.displayName || <em className="admin-muted">(no name)</em>}</td>
                      <td className="admin-mono">{p.email}</td>
                      <td>{p.childCount}</td>
                      <td>{p.totalAttempts}</td>
                      <td>{formatRelative(p.lastAttemptAt)}</td>
                      <td>{formatDate(p.createdAt)}</td>
                    </tr>
                    {isOpen && (
                      <tr className="admin-row-detail">
                        <td colSpan={7}>
                          {p.children.length === 0 ? (
                            <p className="admin-muted admin-muted-block">No kids yet.</p>
                          ) : (
                            <table className="admin-subtable">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Stage</th>
                                  <th>Points</th>
                                  <th>Level</th>
                                  <th>Attempts</th>
                                  <th>Avg WPM</th>
                                  <th>Avg Acc</th>
                                  <th>Last active</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.children.map((c) => (
                                  <tr key={c.id}>
                                    <td>{c.displayName}</td>
                                    <td>{c.currentStage}</td>
                                    <td>{c.totalPoints}</td>
                                    <td>{c.highestLevelCompleted}</td>
                                    <td>{c.attemptCount}</td>
                                    <td>{c.averageWpm?.toFixed(1) ?? "—"}</td>
                                    <td>{c.averageAccuracy != null ? `${c.averageAccuracy.toFixed(1)}%` : "—"}</td>
                                    <td>{formatRelative(c.lastAttemptAt)}</td>
                                    <td>
                                      <button
                                        className="admin-link-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onSelectChild(c.id);
                                        }}
                                      >
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

function formatRelative(iso: string | null): string {
  if (!iso) return "never";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
