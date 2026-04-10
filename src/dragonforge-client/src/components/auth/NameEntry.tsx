import { useState } from "react";
import { childLogin } from "../../services/api";
import DragonAvatar from "../shared/DragonAvatar";

interface Props {
  onSubmit: (name: string) => void;
  onChildLogin: (displayName: string) => void;
}

export default function NameEntry({ onSubmit, onChildLogin }: Props) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"choose" | "local" | "code">("choose");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0) onSubmit(trimmed);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await childLogin(code.trim());
      onChildLogin(result.displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="name-entry-screen">
      <div className="name-entry-card">
        <div className="logo-area">
          <h1 className="game-title">Dragon Forge</h1>
          <h2 className="game-subtitle">Typing</h2>
          <DragonAvatar stage="Egg" highestLevelCompleted={0} size={120} className="avatar-bounce" />
        </div>

        {mode === "choose" && (
          <div className="login-choices">
            <button className="btn btn-start" onClick={() => setMode("code")}>
              Enter Login Code
            </button>
            <button className="btn btn-retry" onClick={() => setMode("local")}>
              Quick Play
            </button>
            <p className="login-hint">
              Have a code from a parent? Use "Enter Login Code" to save your progress online.
            </p>
          </div>
        )}

        {mode === "local" && (
          <form onSubmit={handleLocalSubmit}>
            <label className="name-label" htmlFor="playerName">
              Enter Your Name, Adventurer
            </label>
            <input
              id="playerName"
              type="text"
              className="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-start"
              disabled={name.trim().length === 0}
            >
              Begin Your Quest
            </button>
            <button type="button" className="btn btn-retry" onClick={() => setMode("choose")} style={{ marginTop: 8 }}>
              Back
            </button>
          </form>
        )}

        {mode === "code" && (
          <form onSubmit={handleCodeSubmit}>
            <label className="name-label" htmlFor="otpCode">
              Enter Your 6-Digit Code
            </label>
            <input
              id="otpCode"
              type="text"
              className="name-input code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              inputMode="numeric"
            />
            {error && <p className="error-text">{error}</p>}
            <button
              type="submit"
              className="btn btn-start"
              disabled={code.length !== 6 || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button type="button" className="btn btn-retry" onClick={() => { setMode("choose"); setError(""); }} style={{ marginTop: 8 }}>
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
