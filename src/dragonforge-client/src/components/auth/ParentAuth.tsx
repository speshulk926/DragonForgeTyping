import { useState } from "react";
import { registerParent, loginParent } from "../../services/api";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function ParentAuth({ onSuccess, onBack }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await registerParent(email, password, displayName);
      } else {
        await loginParent(email, password);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-auth-screen">
      <div className="parent-auth-card">
        <h1 className="parent-auth-title">Parent Portal</h1>
        <p className="parent-auth-subtitle">
          {mode === "login" ? "Sign in to manage your kids' profiles" : "Create your parent account"}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              className="parent-input"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            className="parent-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            className="parent-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-parent-primary" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          className="parent-toggle-link"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
        >
          {mode === "login" ? "Don't have an account? Register" : "Already have an account? Sign in"}
        </button>
        <button className="parent-toggle-link" onClick={onBack}>
          ← Back to game
        </button>
      </div>
    </div>
  );
}
