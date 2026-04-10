import { useState, useCallback, useRef } from "react";

export interface TypingState {
  promptText: string;
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  hearts: number;
  maxHearts: number;
  isComplete: boolean;
  isFailed: boolean;
  wpm: number;
  accuracy: number;
  startTime: number | null;
  typed: { char: string; correct: boolean }[];
}

const MAX_HEARTS = 20;

export function useTypingEngine(promptText: string) {
  const [state, setState] = useState<TypingState>(() => createInitialState(promptText));
  const startTimeRef = useRef<number | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ignore modifier-only keys, tab, etc.
      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "CapsLock" ||
        e.key === "Backspace" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      setState((prev) => {
        if (prev.isComplete || prev.isFailed) return prev;

        // Start timer on first keystroke
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now();
        }

        const expectedChar = prev.promptText[prev.currentIndex];
        const isCorrect = e.key === expectedChar;

        const newCorrect = prev.correctCount + (isCorrect ? 1 : 0);
        const newIncorrect = prev.incorrectCount + (isCorrect ? 0 : 1);
        const newHearts = prev.hearts - (isCorrect ? 0 : 1);
        const newIndex = isCorrect ? prev.currentIndex + 1 : prev.currentIndex;
        const totalTyped = newCorrect + newIncorrect;
        const newAccuracy = totalTyped > 0 ? (newCorrect / totalTyped) * 100 : 100;

        // Calculate WPM
        const elapsedMs = Date.now() - (startTimeRef.current ?? Date.now());
        const elapsedMin = elapsedMs / 60000;
        const newWpm = elapsedMin > 0 ? newCorrect / 5 / elapsedMin : 0;

        const isComplete = newIndex >= prev.promptText.length;
        const isFailed = newHearts <= 0;

        const newTyped = [...prev.typed];
        if (isCorrect) {
          newTyped.push({ char: expectedChar, correct: true });
        } else {
          newTyped.push({ char: e.key, correct: false });
        }

        return {
          ...prev,
          currentIndex: newIndex,
          correctCount: newCorrect,
          incorrectCount: newIncorrect,
          hearts: newHearts,
          isComplete,
          isFailed,
          wpm: Math.round(newWpm),
          accuracy: Math.round(newAccuracy * 10) / 10,
          startTime: startTimeRef.current,
          typed: newTyped,
        };
      });
    },
    [promptText]
  );

  const reset = useCallback(() => {
    startTimeRef.current = null;
    setState(createInitialState(promptText));
  }, [promptText]);

  return { state, handleKeyDown, reset };
}

function createInitialState(promptText: string): TypingState {
  return {
    promptText,
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    isComplete: false,
    isFailed: false,
    wpm: 0,
    accuracy: 100,
    startTime: null,
    typed: [],
  };
}
