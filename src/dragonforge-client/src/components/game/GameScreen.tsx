import { useRef, useEffect, useState, useCallback } from "react";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { calculatePoints } from "../../services/scoring";
import { saveAttempt, getProfile } from "../../services/storage";
import { checkEvolution } from "../../services/evolution";
import { playCorrectSound, playErrorSound } from "../../services/sounds";
import type { LevelDefinition, LevelAttemptResult, EvolutionStage } from "../../types/game";
import HeartsDisplay from "./HeartsDisplay";
import TypingPrompt from "./TypingPrompt";
import LevelComplete from "./LevelComplete";
import EvolutionCelebration from "./EvolutionCelebration";
import Runner from "./Runner";

interface Props {
  level: LevelDefinition;
  stage: EvolutionStage;
  highestLevelCompleted: number;
  onComplete: (result: LevelAttemptResult) => void;
  onBack: () => void;
}

export default function GameScreen({ level, stage, highestLevelCompleted, onComplete, onBack }: Props) {
  const promptText = level.promptTexts.join(" ");
  const { state, handleKeyDown, reset } = useTypingEngine(promptText);
  const inputRef = useRef<HTMLInputElement>(null);
  const [stumbling, setStumbling] = useState(false);
  const [result, setResult] = useState<{
    points: number;
    badge: string | null;
  } | null>(null);
  const [pendingEvolution, setPendingEvolution] = useState<EvolutionStage | null>(null);

  // Keep input focused
  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => inputRef.current?.focus(), 500);
    return () => clearInterval(interval);
  }, []);

  // Sound + stumble on mistakes, sound on correct
  const prevIncorrect = useRef(0);
  const prevCorrect = useRef(0);
  useEffect(() => {
    if (state.incorrectCount > prevIncorrect.current) {
      setStumbling(true);
      playErrorSound();
      const timer = setTimeout(() => setStumbling(false), 300);
      prevIncorrect.current = state.incorrectCount;
      return () => clearTimeout(timer);
    }
    prevIncorrect.current = state.incorrectCount;
  }, [state.incorrectCount]);

  useEffect(() => {
    if (state.correctCount > prevCorrect.current) {
      playCorrectSound();
    }
    prevCorrect.current = state.correctCount;
  }, [state.correctCount]);

  // Handle level completion
  useEffect(() => {
    if (state.isComplete || state.isFailed) {
      const { points, badge } = state.isFailed
        ? { points: 0, badge: null }
        : calculatePoints(state.accuracy, level.basePoints);
      setResult({ points, badge });

      const attemptResult: LevelAttemptResult = {
        levelNumber: level.levelNumber,
        wpm: state.wpm,
        accuracy: state.accuracy,
        heartsRemaining: state.hearts,
        pointsAwarded: points,
        passed: state.isComplete && !state.isFailed,
      };
      saveAttempt(attemptResult);

      // Check for evolution
      if (attemptResult.passed) {
        const profile = getProfile();
        if (profile) {
          const evo = checkEvolution(profile);
          if (evo) setPendingEvolution(evo);
        }
      }
    }
  }, [state.isComplete, state.isFailed]);

  const handleRetry = useCallback(() => {
    setResult(null);
    setPendingEvolution(null);
    prevIncorrect.current = 0;
    reset();
    inputRef.current?.focus();
  }, [reset]);

  const handleNext = useCallback(() => {
    if (!result) return;
    const attemptResult: LevelAttemptResult = {
      levelNumber: level.levelNumber,
      wpm: state.wpm,
      accuracy: state.accuracy,
      heartsRemaining: state.hearts,
      pointsAwarded: result.points,
      passed: true,
    };
    onComplete(attemptResult);
  }, [result, state, level, onComplete]);

  const handleEvolutionContinue = useCallback(() => {
    setPendingEvolution(null);
  }, []);

  const progress = promptText.length > 0 ? state.currentIndex / promptText.length : 0;

  return (
    <div className="game-screen" onClick={() => inputRef.current?.focus()}>
      {/* HUD */}
      <div className="game-hud">
        <div className="hud-left">
          <button className="btn-back-hud" onClick={onBack}>
            ←
          </button>
          <HeartsDisplay hearts={state.hearts} maxHearts={state.maxHearts} />
        </div>
        <div className="hud-center">
          <span className="level-title">
            Level {level.levelNumber}: {level.title}
          </span>
        </div>
        <div className="hud-right">
          <span className="stat-display">{state.wpm} WPM</span>
          <span className="stat-display">{state.accuracy}%</span>
        </div>
      </div>

      {/* Runner / Game Canvas */}
      <Runner
        progress={progress}
        isStumbling={stumbling}
        promptText={promptText}
        currentIndex={state.currentIndex}
        stage={stage}
        highestLevelCompleted={highestLevelCompleted}
      />

      {/* Typing Area */}
      <div className="typing-area">
        <TypingPrompt
          promptText={promptText}
          currentIndex={state.currentIndex}
          typed={state.typed}
        />
        <input
          ref={inputRef}
          className="hidden-input"
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Type here"
        />
      </div>

      {/* Evolution Celebration */}
      {pendingEvolution && (
        <EvolutionCelebration
          newStage={pendingEvolution}
          highestLevelCompleted={highestLevelCompleted}
          onContinue={handleEvolutionContinue}
        />
      )}

      {/* Level Complete Overlay (shown after evolution dismissed) */}
      {(state.isComplete || state.isFailed) && result && !pendingEvolution && (
        <LevelComplete
          accuracy={state.accuracy}
          wpm={state.wpm}
          pointsAwarded={result.points}
          heartsRemaining={state.hearts}
          maxHearts={state.maxHearts}
          badge={result.badge}
          failed={state.isFailed}
          stage={stage}
          highestLevelCompleted={highestLevelCompleted}
          onNext={handleNext}
          onRetry={handleRetry}
          onBack={onBack}
        />
      )}
    </div>
  );
}
