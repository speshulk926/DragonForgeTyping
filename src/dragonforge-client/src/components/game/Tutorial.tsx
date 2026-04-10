import { useState, useRef, useEffect, useCallback } from "react";
import DragonAvatar from "../shared/DragonAvatar";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  "story1",
  "story2",
  "story3",
  "fingers",
  "practice",
  "hearts",
  "ready",
] as const;

type Step = (typeof STEPS)[number];

export default function Tutorial({ onComplete }: Props) {
  const [step, setStep] = useState<Step>("story1");
  const [practiceTarget] = useState("fjfjfjfj");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceErrors, setPracticeErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEPS.indexOf(step);

  const next = useCallback(() => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) {
      setStep(STEPS[i + 1]);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  // Enter key to advance on non-practice steps
  useEffect(() => {
    if (step === "practice") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step === "ready") {
          onComplete();
        } else {
          next();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, next, onComplete]);

  // Focus input on practice step
  useEffect(() => {
    if (step === "practice") {
      inputRef.current?.focus();
      const interval = setInterval(() => inputRef.current?.focus(), 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handlePracticeKey = (e: React.KeyboardEvent) => {
    if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta" || e.key === "Tab") {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    if (practiceIndex >= practiceTarget.length) return;

    const expected = practiceTarget[practiceIndex];
    if (e.key === expected) {
      setPracticeIndex((prev) => prev + 1);
    } else {
      setPracticeErrors((prev) => prev + 1);
    }
  };

  const practiceComplete = practiceIndex >= practiceTarget.length;

  return (
    <div className="tutorial-screen">
      <div className="tutorial-card">
        <button className="tutorial-skip" onClick={onComplete}>
          Skip Tutorial
        </button>
        {/* Progress dots */}
        <div className="tutorial-dots">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`tutorial-dot ${i === stepIndex ? "active" : ""} ${i < stepIndex ? "done" : ""}`}
            />
          ))}
        </div>

        {step === "story1" && (
          <div className="tutorial-step">
            <DragonAvatar stage="Egg" highestLevelCompleted={0} size={140} className="tutorial-avatar" />
            <h2 className="tutorial-title">Meet Jimothy</h2>
            <p className="tutorial-text">
              Jimothy was exploring a mystical land far from home when he stumbled
              upon something strange — a glowing egg, sitting all alone in an
              ancient cave.
            </p>
            <p className="tutorial-text">
              There was nobody around. No dragon. No nest. Just this warm, pulsing
              egg that seemed to hum with hidden power.
            </p>
          </div>
        )}

        {step === "story2" && (
          <div className="tutorial-step">
            <DragonAvatar stage="Egg" highestLevelCompleted={1} size={140} className="tutorial-avatar" />
            <h2 className="tutorial-title">A Long Journey Home</h2>
            <p className="tutorial-text">
              Jimothy couldn't just leave it there. He carefully picked up the egg
              and began the long journey home — running through forests, over
              mountains, and across rivers.
            </p>
            <p className="tutorial-text">
              But this egg is special. It only grows stronger when Jimothy types
              correctly. Every keystroke powers his journey forward!
            </p>
          </div>
        )}

        {step === "story3" && (
          <div className="tutorial-step">
            <DragonAvatar stage="Hatchling" highestLevelCompleted={5} size={140} className="tutorial-avatar" />
            <h2 className="tutorial-title">What's Inside?</h2>
            <p className="tutorial-text">
              With enough practice, the egg will crack... and hatch into a baby
              dragon! As you type faster and more accurately, your dragon will
              grow and evolve into more powerful forms.
            </p>
            <p className="tutorial-text">
              But first, Jimothy needs your help. Let's learn where to put your
              fingers!
            </p>
          </div>
        )}

        {step === "fingers" && (
          <div className="tutorial-step">
            <h2 className="tutorial-title">Home Row Position</h2>
            <p className="tutorial-text">
              Place your fingers on the middle row of the keyboard — this is
              called the <strong>home row</strong>.
            </p>
            <div className="keyboard-diagram">
              <div className="key-row">
                <span className="key hint-left">A<br /><small>pinky</small></span>
                <span className="key hint-left">S<br /><small>ring</small></span>
                <span className="key hint-left">D<br /><small>middle</small></span>
                <span className="key hint-left bump">F<br /><small>index</small></span>
                <span className="key dim">G</span>
                <span className="key dim">H</span>
                <span className="key hint-right bump">J<br /><small>index</small></span>
                <span className="key hint-right">K<br /><small>middle</small></span>
                <span className="key hint-right">L<br /><small>ring</small></span>
                <span className="key hint-right">;<br /><small>pinky</small></span>
              </div>
            </div>
            <p className="tutorial-text">
              Notice the little bumps on <strong>F</strong> and <strong>J</strong>?
              Those help your index fingers find home without looking. Your left
              index finger goes on F, right index on J.
            </p>
          </div>
        )}

        {step === "practice" && (
          <div className="tutorial-step" onClick={() => inputRef.current?.focus()}>
            <h2 className="tutorial-title">Try It Out!</h2>
            <p className="tutorial-text">
              Type <strong>f</strong> with your left index finger and <strong>j</strong> with
              your right index finger. Go!
            </p>
            <div className="practice-display">
              {practiceTarget.split("").map((char, i) => (
                <span
                  key={i}
                  className={`practice-char ${
                    i < practiceIndex ? "correct" : i === practiceIndex ? "current" : "pending"
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
            {practiceErrors > 0 && (
              <p className="tutorial-hint">
                Wrong key! Remember: left index = F, right index = J
              </p>
            )}
            {practiceComplete && (
              <p className="tutorial-success">Great job! You've got it!</p>
            )}
            <input
              ref={inputRef}
              className="hidden-input"
              onKeyDown={handlePracticeKey}
              autoFocus
            />
          </div>
        )}

        {step === "hearts" && (
          <div className="tutorial-step">
            <h2 className="tutorial-title">Hearts</h2>
            <div className="tutorial-hearts-demo">
              ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
            </div>
            <p className="tutorial-text">
              You start each level with <strong>20 hearts</strong>. Every wrong
              keystroke costs you one heart. If you lose them all, the level fails
              and you'll need to try again.
            </p>
            <p className="tutorial-text">
              But don't worry — just take your time and focus on accuracy. Speed
              will come naturally with practice!
            </p>
          </div>
        )}

        {step === "ready" && (
          <div className="tutorial-step">
            <DragonAvatar stage="Egg" highestLevelCompleted={0} size={140} className="tutorial-avatar" />
            <h2 className="tutorial-title">Ready to Go!</h2>
            <p className="tutorial-text">
              Jimothy is counting on you. Help him get the egg home safely by
              typing your way through each level. The egg will grow stronger with
              every keystroke!
            </p>
            <p className="tutorial-text-bold">
              Remember: fingers on the home row, eyes on the screen.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="tutorial-nav">
          {stepIndex > 0 && (
            <button className="btn btn-retry" onClick={() => setStep(STEPS[stepIndex - 1])}>
              Back
            </button>
          )}
          {step === "practice" ? (
            <button className="btn btn-next" onClick={next} disabled={!practiceComplete}>
              {practiceComplete ? "Continue" : "Complete the practice"}
            </button>
          ) : (
            <button className="btn btn-next" onClick={step === "ready" ? onComplete : next}>
              {step === "ready" ? "Start Playing!" : "Next"}
            </button>
          )}
        </div>
        {step !== "practice" && (
          <p className="enter-hint">Press Enter to continue</p>
        )}
      </div>
    </div>
  );
}
