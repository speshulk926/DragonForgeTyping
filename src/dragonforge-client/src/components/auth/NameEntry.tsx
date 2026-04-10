import { useState } from "react";
import DragonAvatar from "../shared/DragonAvatar";

interface Props {
  onSubmit: (name: string) => void;
}

export default function NameEntry({ onSubmit }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
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

        <form onSubmit={handleSubmit}>
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
        </form>
      </div>
    </div>
  );
}
