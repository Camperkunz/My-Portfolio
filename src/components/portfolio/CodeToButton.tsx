import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onNavigate: () => void;
}

const CODE_TEXT = '<Button> View Projects </Button>';
const TYPING_SPEED = 50;
const PAUSE_BEFORE_TRANSFORM = 700;

export default function CodeToButton({ onNavigate }: Props) {
  const [phase, setPhase] = useState<"typing" | "transforming" | "button">("typing");
  const [charIndex, setCharIndex] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCharIndex(i);
      if (i >= CODE_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("transforming"), PAUSE_BEFORE_TRANSFORM);
        setTimeout(() => setPhase("button"), PAUSE_BEFORE_TRANSFORM + 500);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, []);

  const displayedCode = CODE_TEXT.slice(0, charIndex);

  return (
    <div className="relative inline-flex items-center justify-center min-w-[150px] h-10">
      <AnimatePresence mode="wait">
        {phase !== "button" ? (
          <motion.span
            key="code"
            className="font-mono text-sm text-accent/90 whitespace-nowrap select-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {displayedCode}
            <span className="animate-pulse text-accent">|</span>
          </motion.span>
        ) : (
          <motion.button
            key="button"
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-accent/40 text-foreground bg-accent hover:bg-background hover:text-accent-foreground hover:border-accent/40 transition-all"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            View Projects
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
