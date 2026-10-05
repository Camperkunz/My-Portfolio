import { useState, useEffect, useRef } from "react";

interface Props {
  onNavigate: () => void;
}

const CODE_TEXT = '<Button> View Projects </Button>';
const TYPING_SPEED = 50;
const PAUSE_BEFORE_TRANSFORM = 700;
// Matches the fade-out-blur animation length — the button only mounts once the
// exit animation has finished (same "wait for exit, then enter" timing the old
// framer-motion AnimatePresence produced).
const EXIT_DURATION = 400;

type Phase = "typing" | "transforming" | "exiting" | "button";

export default function CodeToButton({ onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [charIndex, setCharIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // The sequence starts only once the button is on screen, so its timers
    // never churn the main thread for off-screen content.
    let interval: number | undefined;
    const timeouts: number[] = [];
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        let i = 0;
        interval = window.setInterval(() => {
          i++;
          setCharIndex(i);
          if (i >= CODE_TEXT.length) {
            if (interval !== undefined) window.clearInterval(interval);
            timeouts.push(
              window.setTimeout(() => setPhase("transforming"), PAUSE_BEFORE_TRANSFORM)
            );
            timeouts.push(
              window.setTimeout(() => setPhase("exiting"), PAUSE_BEFORE_TRANSFORM + 500)
            );
            timeouts.push(
              window.setTimeout(
                () => setPhase("button"),
                PAUSE_BEFORE_TRANSFORM + 500 + EXIT_DURATION
              )
            );
          }
        }, TYPING_SPEED);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (interval !== undefined) window.clearInterval(interval);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const displayedCode = CODE_TEXT.slice(0, charIndex);

  return (
    <div ref={rootRef} className="relative inline-flex items-center justify-center h-10">
      {phase !== "button" && (
        <span
          className={`font-mono text-accent/90 whitespace-nowrap select-none${
            phase === "exiting" ? " animate-fade-out-blur motion-reduce:animate-none" : ""
          }`}
          style={{ fontSize: 'clamp(10px, 2vw, 13px)' }}
        >
          {displayedCode}
          <span className="animate-pulse text-accent">|</span>
        </span>
      )}
      {phase === "button" && (
        <button
          onClick={onNavigate}
          className="animate-fade-in-blur motion-reduce:animate-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-accent/40 text-foreground bg-accent hover:bg-background hover:text-accent-foreground hover:border-accent/40 transition-all"
        >
          View Projects
        </button>
      )}
    </div>
  );
}