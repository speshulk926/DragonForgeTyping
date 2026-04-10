import { useEffect, useState } from "react";

interface Props {
  hearts: number;
  maxHearts: number;
}

export default function HeartsDisplay({ hearts, maxHearts }: Props) {
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [prevHearts, setPrevHearts] = useState(hearts);

  useEffect(() => {
    if (hearts < prevHearts) {
      // Shake the heart that was just lost
      setShakeIndex(hearts);
      const timer = setTimeout(() => setShakeIndex(null), 400);
      setPrevHearts(hearts);
      return () => clearTimeout(timer);
    }
    setPrevHearts(hearts);
  }, [hearts, prevHearts]);

  return (
    <div className="hearts-display">
      {Array.from({ length: maxHearts }, (_, i) => (
        <span
          key={i}
          className={`heart ${i >= hearts ? "heart-lost" : ""} ${
            i === shakeIndex ? "heart-shake" : ""
          }`}
        >
          {i < hearts ? "❤️" : "🖤"}
        </span>
      ))}
    </div>
  );
}
