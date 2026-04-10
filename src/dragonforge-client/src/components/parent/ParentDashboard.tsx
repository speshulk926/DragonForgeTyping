import { useState, useEffect, useCallback } from "react";
import { getChildren, createChild, generateChildCode, clearParentToken, parentPlay } from "../../services/api";
import type { EvolutionStage } from "../../types/game";
import DragonAvatar from "../shared/DragonAvatar";
import ChildDetail from "./ChildDetail";

interface Child {
  id: string;
  displayName: string;
  avatarChoice: string | null;
  currentStage: string;
  totalPoints: number;
  highestLevelCompleted: number;
  createdAt: string;
}

interface Props {
  onLogout: () => void;
  onPlay: () => void;
}

export default function ParentDashboard({ onLogout, onPlay }: Props) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [otpCode, setOtpCode] = useState<{ childId: string; code: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChildren = useCallback(async () => {
    try {
      const data = await getChildren();
      setChildren(data);
    } catch {
      setError("Failed to load children");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChildren(); }, [loadChildren]);

  // Separate parent's own profile from kids
  const selfProfile = children.find((c) => c.avatarChoice === "__parent_self__");
  const kidProfiles = children.filter((c) => c.avatarChoice !== "__parent_self__");

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    try {
      await createChild(newChildName.trim());
      setNewChildName("");
      setShowAddChild(false);
      loadChildren();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add child");
    }
  };

  const handleGenerateCode = async (childId: string) => {
    try {
      const result = await generateChildCode(childId);
      setOtpCode({ childId, code: result.code, expiresAt: result.expiresAt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate code");
    }
  };

  const handlePlay = async () => {
    try {
      await parentPlay();
      onPlay();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start game");
    }
  };

  const handleLogout = () => {
    clearParentToken();
    onLogout();
  };

  if (selectedChild) {
    const child = children.find(c => c.id === selectedChild);
    if (child) {
      return (
        <ChildDetail
          child={child}
          onBack={() => { setSelectedChild(null); loadChildren(); }}
          onGenerateCode={() => handleGenerateCode(child.id)}
        />
      );
    }
  }

  return (
    <div className="parent-dashboard">
      <div className="parent-header">
        <h1 className="parent-title">Parent Dashboard</h1>
        <button className="btn btn-parent-secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {error && <p className="error-text" style={{ textAlign: "center", marginBottom: 16 }}>{error}</p>}

      {/* OTP Modal */}
      {otpCode && (
        <div className="otp-modal-overlay" onClick={() => setOtpCode(null)}>
          <div className="otp-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="otp-modal-title">Login Code</h2>
            <p className="otp-modal-hint">Give this code to your child to enter on the game screen</p>
            <div className="otp-code-display">{otpCode.code}</div>
            <p className="otp-modal-expiry">
              Expires in 5 minutes
            </p>
            <button className="btn btn-parent-primary" onClick={() => setOtpCode(null)}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Parent's Own Game Card */}
      <div className="parent-play-card">
        <div className="parent-play-info">
          <DragonAvatar
            stage={(selfProfile?.currentStage ?? "Egg") as EvolutionStage}
            highestLevelCompleted={selfProfile?.highestLevelCompleted ?? 0}
            size={64}
          />
          <div className="parent-play-stats">
            <h3 className="parent-play-title">Your Game</h3>
            {selfProfile ? (
              <p className="parent-play-detail">
                {selfProfile.totalPoints} pts &middot; Level {selfProfile.highestLevelCompleted} &middot; {selfProfile.currentStage}
              </p>
            ) : (
              <p className="parent-play-detail">Start your own typing adventure!</p>
            )}
          </div>
        </div>
        <button className="btn btn-play-game" onClick={handlePlay}>
          Play Game
        </button>
      </div>

      {/* Sibling Leaderboard */}
      {kidProfiles.length >= 2 && (
        <>
          <h2 className="section-title">Leaderboard</h2>
          <div className="leaderboard">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Points</th>
                  <th>Level</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {[...kidProfiles]
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((child, i) => (
                    <tr key={child.id} className={i === 0 ? "leaderboard-first" : ""}>
                      <td className="leaderboard-rank">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </td>
                      <td className="leaderboard-name">{child.displayName}</td>
                      <td>{child.totalPoints}</td>
                      <td>{child.highestLevelCompleted}</td>
                      <td>{child.currentStage}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Kids Section */}
      <h2 className="section-title">Kids</h2>

      {loading ? (
        <p className="parent-loading">Loading...</p>
      ) : kidProfiles.length === 0 ? (
        <div className="parent-empty">
          <p>No child profiles yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="children-grid">
          {kidProfiles.map((child) => (
            <div key={child.id} className="child-card">
              <div className="child-card-avatar" onClick={() => setSelectedChild(child.id)}>
                <DragonAvatar
                  stage={child.currentStage as EvolutionStage}
                  highestLevelCompleted={child.highestLevelCompleted}
                  size={80}
                />
              </div>
              <div className="child-card-info" onClick={() => setSelectedChild(child.id)}>
                <h3 className="child-card-name">{child.displayName}</h3>
                <p className="child-card-stat">{child.totalPoints} pts &middot; Level {child.highestLevelCompleted}</p>
                <p className="child-card-stage">{child.currentStage}</p>
              </div>
              <button
                className="btn btn-generate-code"
                onClick={() => handleGenerateCode(child.id)}
              >
                Generate Login Code
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Child */}
      {showAddChild ? (
        <form className="add-child-form" onSubmit={handleAddChild}>
          <input
            type="text"
            className="parent-input"
            placeholder="Child's name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            autoFocus
            maxLength={20}
          />
          <div className="add-child-actions">
            <button type="submit" className="btn btn-parent-primary" disabled={!newChildName.trim()}>
              Add
            </button>
            <button type="button" className="btn btn-parent-secondary" onClick={() => setShowAddChild(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="btn btn-add-child" onClick={() => setShowAddChild(true)}>
          + Add Child
        </button>
      )}
    </div>
  );
}
