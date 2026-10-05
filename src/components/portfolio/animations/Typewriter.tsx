import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  initialDelay?: number;
}

export default function Typewriter({
  roles,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  initialDelay = 5000,
}: Props) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState(roles[0] || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [everSeen, setEverSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  const currentRole = roles[roleIndex];

  const tick = useCallback(() => {
    if (!hasStarted) return;

    if (!isDeleting) {
      if (text.length < currentRole.length) {
        setText(currentRole.slice(0, text.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      if (text.length > 0) {
        setText(currentRole.slice(0, text.length - 1));
      } else {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }
    }
  }, [text, isDeleting, currentRole, roles.length, pauseDuration, hasStarted]);

  // The animation only runs while the hero is on screen — off-screen ticks are
  // wasted main-thread work (and a forced-reflow source during long loads).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEverSeen(true);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Kick off the first deletion after the initial delay, once the hero has
  // been on screen at least once.
  useEffect(() => {
    if (!everSeen) return;
    const timeout = window.setTimeout(() => {
      setHasStarted(true);
      setIsDeleting(true);
    }, initialDelay);
    return () => window.clearTimeout(timeout);
  }, [everSeen, initialDelay]);

  useEffect(() => {
    if (!hasStarted || !inView) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = window.setTimeout(tick, speed);
    return () => window.clearTimeout(timer);
  }, [tick, isDeleting, deletingSpeed, typingSpeed, hasStarted, inView]);

  return (
    <span ref={rootRef} className="text-md tracking-widest uppercase text-accent font-medium">
      {text}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}