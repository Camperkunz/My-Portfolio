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

// Shared by the animated code and the invisible sizing ghost below, so both
// measure exactly the same.
const CODE_STYLE = { fontSize: "clamp(10px, 2vw, 13px)" } as const;

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
    // `inline-grid` with every state stacked in one shared cell, so the box is
    // always as wide as its widest mounted child — no layout jump when the code
    // is swapped for the button. Below `sm` the invisible ghost below also
    // reserves the full code width, because there the CTA row wraps to two lines
    // and a width change would re-wrap it (shifting the hero copy). From `sm` up
    // the row stays on one line, so the ghost is dropped and the button keeps its
    // natural width instead of sitting inside a code-sized box.
    <div ref={rootRef} className="relative inline-grid h-10 max-w-full place-items-center">
      {/* Reserves the widest state (the full code line plus its cursor) for the
          component's whole lifetime on small screens. Invisible to sight and to
          assistive tech. */}
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 select-none whitespace-nowrap font-mono sm:hidden"
        style={CODE_STYLE}
      >
        {CODE_TEXT}
        <span>|</span>
      </span>

      {phase !== "button" && (
        // Decorative: the real CTA replaces it, so it stays out of the a11y tree
        // (same convention as the Typewriter role animation).
        <span
          aria-hidden="true"
          className={`col-start-1 row-start-1 whitespace-nowrap font-mono text-accent/90 select-none${
            phase === "exiting" ? " animate-fade-out-blur motion-reduce:animate-none" : ""
          }`}
          style={CODE_STYLE}
        >
          {displayedCode}
          <span className="animate-pulse text-accent">|</span>
        </span>
      )}
      {phase === "button" && (
        <button
          onClick={onNavigate}
          className="col-start-1 row-start-1 animate-fade-in-blur motion-reduce:animate-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-accent/40 text-foreground bg-accent hover:bg-background hover:text-accent-foreground hover:border-accent/40 transition-all"
        >
          View Projects
        </button>
      )}
    </div>
  );
}