import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
      if (trailRef.current) {
        trailRef.current.style.left = `${e.clientX}px`;
        trailRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, hsl(0 84% 60%) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        ref={trailRef}
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, hsl(0 84% 60%) 0%, transparent 70%)",
          filter: "blur(20px)",
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }}
      />
    </>
  );
}
