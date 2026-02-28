import { useEffect, useRef, useState } from "react";

export default function CursorDelayed() {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }

      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animateFollower = () => {
      setFollowerPos(p => ({
        x: p.x + (targetRef.current.x - p.x) * 0.12,
        y: p.y + (targetRef.current.y - p.y) * 0.12
      }));
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Убрал glow полностью */}

      <div ref={trailRef} className="pointer-events-none fixed z-50 w-3 h-3 bg-red-500 rounded-full opacity-90"
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
          transform: "translate(-50%, -50%)"
        }} />
    </>
  );
}
