import { useState, useCallback, useEffect } from "react";
import { getProfile, createProfile, clearProfile, saveProfile } from "./services/storage";
import { getLevelByNumber } from "./services/levels";
import { checkEvolution } from "./services/evolution";
import type { PlayerProfile, LevelAttemptResult } from "./types/game";
import NameEntry from "./components/auth/NameEntry";
import LevelSelect from "./components/game/LevelSelect";
import GameScreen from "./components/game/GameScreen";

type Screen = "name" | "levels" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("name");
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);

  useEffect(() => {
    const existing = getProfile();
    if (existing) {
      setProfile(existing);
      setScreen("levels");
    }
  }, []);

  const handleNameSubmit = useCallback((name: string) => {
    const p = createProfile(name);
    setProfile(p);
    setScreen("levels");
  }, []);

  const handleSelectLevel = useCallback((levelNumber: number) => {
    setCurrentLevelNumber(levelNumber);
    setScreen("game");
  }, []);

  const handleLevelComplete = useCallback(
    (_result: LevelAttemptResult) => {
      const updated = getProfile();
      if (updated) {
        // Apply evolution if earned
        const evo = checkEvolution(updated);
        if (evo) {
          updated.currentStage = evo;
          saveProfile(updated);
        }
        setProfile(updated);
      }
      const nextLevel = currentLevelNumber + 1;
      const nextDef = getLevelByNumber(nextLevel);
      if (nextDef) {
        setCurrentLevelNumber(nextLevel);
      } else {
        setScreen("levels");
      }
    },
    [currentLevelNumber]
  );

  const handleLogout = useCallback(() => {
    clearProfile();
    setProfile(null);
    setScreen("name");
  }, []);

  const handleBackToLevels = useCallback(() => {
    const updated = getProfile();
    if (updated) setProfile(updated);
    setScreen("levels");
  }, []);

  if (screen === "name" || !profile) {
    return <NameEntry onSubmit={handleNameSubmit} />;
  }

  if (screen === "levels") {
    return (
      <LevelSelect
        profile={profile}
        onSelectLevel={handleSelectLevel}
        onLogout={handleLogout}
      />
    );
  }

  const level = getLevelByNumber(currentLevelNumber);
  if (!level) {
    return (
      <div className="error-screen">
        <p>Level not found!</p>
        <button onClick={handleBackToLevels}>Back to Levels</button>
      </div>
    );
  }

  return (
    <GameScreen
      key={currentLevelNumber}
      level={level}
      stage={profile.currentStage}
      highestLevelCompleted={profile.highestLevelCompleted}
      onComplete={handleLevelComplete}
      onBack={handleBackToLevels}
    />
  );
}
