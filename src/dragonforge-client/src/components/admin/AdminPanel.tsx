import { useState } from "react";
import { adminVerifyKey, clearAdminKey, getAdminKey } from "../../services/api";
import AdminOverview from "./AdminOverview";
import AdminParents from "./AdminParents";
import AdminLevels from "./AdminLevels";
import AdminChildDetail from "./AdminChildDetail";

type Tab = "overview" | "parents" | "levels";

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean>(!!getAdminKey());
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await adminVerifyKey(keyInput.trim());
      setAuthed(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Invalid key");
    }
  };

  const handleLogout = () => {
    clearAdminKey();
    setAuthed(false);
    setKeyInput("");
  };

  if (!authed) {
    return (
      <div className="admin-gate">
        <form className="admin-gate-card" onSubmit={handleLogin}>
          <h1 className="admin-gate-title">Admin Panel</h1>
          <p className="admin-gate-hint">Enter the admin key</p>
          <input
            type="password"
            className="admin-input"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin key"
            autoFocus
          />
          {authError && <p className="admin-error">{authError}</p>}
          <button type="submit" className="btn btn-admin-primary" disabled={!keyInput.trim()}>
            Unlock
          </button>
        </form>
      </div>
    );
  }

  if (selectedChildId) {
    return (
      <AdminChildDetail
        childId={selectedChildId}
        onBack={() => setSelectedChildId(null)}
      />
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">DragonForge Admin</h1>
        <button className="btn btn-admin-secondary" onClick={handleLogout}>
          Lock
        </button>
      </div>

      <div className="admin-tabs">
        {(["overview", "parents", "levels"] as Tab[]).map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? "admin-tab-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === "overview" && <AdminOverview />}
        {tab === "parents" && <AdminParents onSelectChild={setSelectedChildId} />}
        {tab === "levels" && <AdminLevels />}
      </div>
    </div>
  );
}

