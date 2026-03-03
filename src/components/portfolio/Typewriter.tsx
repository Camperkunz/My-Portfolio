import { useState, useEffect, useCallback } from "react";

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

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
      setIsDeleting(true)
    }, initialDelay);

    return () => clearTimeout(startTimer);
  }, [initialDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, deletingSpeed, typingSpeed, hasStarted]);

  return (
    <span className="text-md tracking-widest uppercase text-accent font-medium">
      {text}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}