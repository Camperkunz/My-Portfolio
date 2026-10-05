import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Scroll-triggered fade-in built with IntersectionObserver + CSS transitions.
 * Drop-in replacement for the old framer-motion `whileInView` wrapper, so the
 * animation library no longer ships in the critical entry bundle.
 */
export default function FadeInSection({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // `once: true` behaviour — reveal stays on after the first trigger.
          observer.disconnect();
        }
      },
      // Mirrors framer-motion's viewport={{ margin: "-80px" }}.
      { rootMargin: "-80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={[
        className ?? "",
        // duration 1200ms / ease-out match the previous framer-motion transition.
        "transition-[opacity,transform] duration-1200 ease-out motion-reduce:transition-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        // Reduced-motion users get the content immediately, without movement.
        "motion-reduce:opacity-100 motion-reduce:translate-y-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
