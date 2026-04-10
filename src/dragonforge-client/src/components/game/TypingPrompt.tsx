import { useMemo } from "react";

interface Props {
  promptText: string;
  currentIndex: number;
  typed: { char: string; correct: boolean }[];
}

const MAX_LINE_LENGTH = 40;

// Break text into lines at word boundaries, max ~MAX_LINE_LENGTH chars per line
function breakIntoLines(text: string): { start: number; end: number }[] {
  const lines: { start: number; end: number }[] = [];
  let pos = 0;

  while (pos < text.length) {
    if (pos + MAX_LINE_LENGTH >= text.length) {
      lines.push({ start: pos, end: text.length });
      break;
    }

    // Find the last space within the max length
    let breakAt = pos + MAX_LINE_LENGTH;
    while (breakAt > pos && text[breakAt] !== " ") {
      breakAt--;
    }

    // If no space found (one giant word), just break at max
    if (breakAt === pos) {
      breakAt = pos + MAX_LINE_LENGTH;
    }

    lines.push({ start: pos, end: breakAt });
    // Skip the space at the break point
    pos = text[breakAt] === " " ? breakAt + 1 : breakAt;
  }

  return lines;
}

export default function TypingPrompt({ promptText, currentIndex }: Props) {
  const lines = useMemo(() => breakIntoLines(promptText), [promptText]);

  // Find which line the cursor is on
  const currentLineIdx = lines.findIndex(
    (line) => currentIndex >= line.start && currentIndex < line.end
  );
  const activeLine = currentLineIdx === -1 ? lines.length - 1 : currentLineIdx;

  // Show the current line and the next line (2 visible rows)
  const visibleStart = activeLine;
  const visibleEnd = Math.min(activeLine + 2, lines.length);
  const visibleLines = lines.slice(visibleStart, visibleEnd);

  return (
    <div className="typing-prompt">
      {visibleLines.map((line, lineIdx) => (
        <div key={visibleStart + lineIdx} className="typing-prompt-line">
          {renderLine(promptText, line.start, line.end, currentIndex)}
          {/* Show the trailing space between words if this isn't the last line */}
          {visibleStart + lineIdx < lines.length - 1 && line.end < promptText.length && promptText[line.end] === " " && (
            <span className={line.end < currentIndex ? "char-correct" : line.end === currentIndex ? "char-current" : "char-pending"}>
              {"\u00A0"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function renderLine(text: string, start: number, end: number, currentIndex: number) {
  const chars = [];
  for (let i = start; i < end; i++) {
    let className = "char-pending";
    if (i < currentIndex) {
      className = "char-correct";
    } else if (i === currentIndex) {
      className = "char-current";
    }
    chars.push(
      <span key={i} className={className}>
        {text[i] === " " ? "\u00A0" : text[i]}
      </span>
    );
  }
  return chars;
}
