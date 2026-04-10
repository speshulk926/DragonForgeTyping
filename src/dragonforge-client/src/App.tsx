import { useState, useCallback, useEffect } from "react";
import { getProfile, createProfile, clearProfile, saveProfile } from "./services/storage";
import { getLevelByNumber } from "./services/levels";
import { checkEvolution } from "./services/evolution";
import {
  isChildLoggedIn, getGameProfile, submitAttempt as apiSubmitAttempt,
  childLogout, clearChildSession,
} from "./services/api";
import type { PlayerProfile, LevelAttemptResult, EvolutionStage } from "./types/game";
import NameEntry from "./components/auth/NameEntry";
import LevelSelect from "./components/game/LevelSelect";
import GameScreen from "./components/game/GameScreen";

type Screen = "name" | "levels" | "game";
type AuthMode = "local" | "online";

export default function App() {
  const [screen, setScreen] = useState<Screen>("name");
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [authMode, setAuthMode] = useState<AuthMode>("local");

  // Check for existing sessions on mount
  useEffect(() => {
    if (isChildLoggedIn()) {
      // Try to load online profile
      getGameProfile()
        .then((data) => {
          const onlineProfile: PlayerProfile = {
            name: data.displayName,
            highestLevelCompleted: data.highestLevelCompleted,
            totalPoints: data.totalPoints,
            currentStage: data.currentStage as EvolutionStage,
            attempts: [],
          };
          setProfile(onlineProfile);
          setAuthMode("online");
          setScreen("levels");
        })
        .catch(() => {
          clearChildSession();
          // Fall back to local
          checkLocalProfile();
        });
    } else {
      checkLocalProfile();
    }
  }, []);

  function checkLocalProfile() {
    const existing = getProfile();
    if (existing) {
      setProfile(existing);
      setAuthMode("local");
      setScreen("levels");
    }
  }

  // Local mode: enter name
  const handleNameSubmit = useCallback((name: string) => {
    const p = createProfile(name);
    setProfile(p);
    setAuthMode("local");
    setScreen("levels");
  }, []);

  // Online mode: child OTP login succeeded
  const handleChildLogin = useCallback((displayName: string) => {
    getGameProfile().then((data) => {
      const onlineProfile: PlayerProfile = {
        name: displayName,
        highestLevelCompleted: data.highestLevelCompleted,
        totalPoints: data.totalPoints,
        currentStage: data.currentStage as EvolutionStage,
        attempts: [],
      };
      setProfile(onlineProfile);
      setAuthMode("online");
      setScreen("levels");
    });
  }, []);

  const handleSelectLevel = useCallback((levelNumber: number) => {
    setCurrentLevelNumber(levelNumber);
    setScreen("game");
  }, []);

  const handleLevelComplete = useCallback(
    (result: LevelAttemptResult) => {
      if (authMode === "online") {
        // Save to API, then refresh profile
        apiSubmitAttempt({
          levelNumber: result.levelNumber,
          wpm: result.wpm,
          accuracy: result.accuracy,
          heartsRemaining: result.heartsRemaining,
          pointsAwarded: result.pointsAwarded,
          passed: result.passed,
        }).then((data) => {
          setProfile((prev) =>
            prev ? {
              ...prev,
              totalPoints: data.totalPoints ?? prev.totalPoints,
              highestLevelCompleted: data.highestLevelCompleted ?? prev.highestLevelCompleted,
              currentStage: (data.stage as EvolutionStage) ?? prev.currentStage,
            } : prev
          );
        }).catch(() => {});
      } else {
        // Local mode
        const updated = getProfile();
        if (updated) {
          const evo = checkEvolution(updated);
          if (evo) {
            updated.currentStage = evo;
            saveProfile(updated);
          }
          setProfile(updated);
        }
      }

      const nextLevel = currentLevelNumber + 1;
      const nextDef = getLevelByNumber(nextLevel);
      if (nextDef) {
        setCurrentLevelNumber(nextLevel);
      } else {
        setScreen("levels");
      }
    },
    [currentLevelNumber, authMode]
  );

  const handleLogout = useCallback(() => {
    if (authMode === "online") {
      childLogout();
    } else {
      clearProfile();
    }
    setProfile(null);
    setAuthMode("local");
    setScreen("name");
  }, [authMode]);

  const handleBackToLevels = useCallback(() => {
    if (authMode === "local") {
      const updated = getProfile();
      if (updated) setProfile(updated);
    }
    setScreen("levels");
  }, [authMode]);

  if (screen === "name" || !profile) {
    return (
      <NameEntry
        onSubmit={handleNameSubmit}
        onChildLogin={handleChildLogin}
      />
    );
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
