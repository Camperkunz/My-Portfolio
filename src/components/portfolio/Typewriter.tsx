import { useState, useEffect, useCallback } from "react";

interface Props {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function Typewriter({
  roles,
  typingSpeed = 100,
  deletingSpeed = 60,
  pauseDuration = 1800,
}: Props) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentRole = roles[roleIndex];

  const tick = useCallback(() => {
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
  }, [text, isDeleting, currentRole, roles.length, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <span className="font-mono text-sm tracking-widest uppercase text-accent">
      {text}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}
