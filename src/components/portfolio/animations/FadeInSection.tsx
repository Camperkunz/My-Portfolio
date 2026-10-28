import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Scroll-triggered fade-in built with IntersectionObserver + CSS transitions.
 * Drop-in replacement for the old framer-motion `whileInView` wrapper, so the
 * animation library no longer ships in the critical entry bundle.
 *
 * The prerendered HTML (and the hydration render) is fully visible: content
 * that is already on screen at load must not wait for JS, or it becomes a
 * late LCP candidate on slow phones. Only sections still below the viewport
 * are hidden after mount, and they fade in as they scroll into view.
 */
export default function FadeInSection({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Mirrors framer-motion's viewport={{ margin: "-80px" }}.
    const MARGIN = 80;
    if (el.getBoundingClientRect().top < window.innerHeight - MARGIN) return;

    setHidden(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          // `once: true` behaviour — reveal stays on after the first trigger.
          observer.disconnect();
        }
      },
      { rootMargin: `-${MARGIN}px` }
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
        hidden ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0",
        // Reduced-motion users get the content immediately, without movement.
        "motion-reduce:opacity-100 motion-reduce:translate-y-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
