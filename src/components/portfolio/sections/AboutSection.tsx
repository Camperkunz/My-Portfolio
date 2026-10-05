import { useState, useEffect, useRef } from "react";
import { personalInfo } from "@/data/personalInfo";
import SectionHeader from "../SectionHeader";

function useCountUp(target: number, duration = 1500, startCounting = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let start = 1;
    // ~10 updates/sec instead of one React commit per frame (the old 16 ms
    // interval ran three counters at 60 commits/sec each). Those frequent
    // commits interleaved with layout reads are what Lighthouse reports as
    // "Forced reflow".
    const TICK_MS = 100;
    const step = target / (duration / TICK_MS);
    const timer = window.setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [startCounting, target, duration]);

  return count;
}

const statCardClass =
  "w-full rounded-xl border border-accent/30 bg-card/50 backdrop-blur-md p-4 transition-all hover:shadow-lg hover:shadow-accent/10";

export default function AboutSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const tiltRafRef = useRef<number | null>(null);

  const years = useCountUp(personalInfo.experienceYears, 1000, inView);
  const projects = useCountUp(personalInfo.realProjects, 1500, inView);
  const certs = useCountUp(personalInfo.certifications, 1200, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Cancel any pending tilt frame on unmount.
  useEffect(() => () => {
    if (tiltRafRef.current !== null) window.cancelAnimationFrame(tiltRafRef.current);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // At most one layout read + state update per animation frame — doing it on
    // every mousemove event forces synchronous reflows. `currentTarget` must
    // be captured now (it is null after the event finishes dispatching).
    if (tiltRafRef.current !== null) return;
    const { clientX, clientY, currentTarget } = e;
    tiltRafRef.current = window.requestAnimationFrame(() => {
      tiltRafRef.current = null;
      const rect = currentTarget.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((clientY - rect.top) / rect.height - 0.5) * -10;
      setTilt({ x, y });
    });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader preTitle="Get to know me" title="About Me" />

      <div className="grid gap-12 md:grid-cols-2 items-center">
        {/* Text */}
        <div className="text-center md:text-left">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Hi, I'm Anna — a Front-End Developer who builds polished web experiences and isn't afraid to push them further with AI. With {personalInfo.experienceYears}+ years of experience in React, TypeScript, and various CMS platforms, I bridge the gap between creative design and maintainable code.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            I believe a great product is seen in the details — from the first wireframe to the final deploy. My goal is simple: to build interfaces that aren't just beautiful, but are accessible, performant, and solve real-world challenges.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Let’s build something together ❤️
          </p>

          <div
            ref={statsRef}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-12 md:mt-12 text-center md:text-start"
          >
            <div className={statCardClass}>
              <p className="font-mono text-3xl font-bold">{years}+</p>
              <p className="text-muted-foreground text-sm mt-1">Years of experience</p>
            </div>
            <div className={statCardClass}>
              <p className="font-mono text-3xl font-bold">{projects}+</p>
              <p className="text-muted-foreground text-sm mt-1">Projects Built</p>
            </div>
            <div className={`${statCardClass} col-span-2 sm:col-span-1`}>
              <p className="font-mono text-3xl font-bold">{certs}+</p>
              <p className="text-muted-foreground text-sm mt-1">Certifications Earned</p>
            </div>
          </div>
        </div>

        {/* Photo with parallax */}
        <div
          className="flex justify-center md:justify-end"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="relative w-72 h-80 rounded-2xl overflow-hidden border border-border/50 shadow-lg shadow-accent/5 transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            }}
          >
            <img
              src={personalInfo.image}
              alt={personalInfo.name}
              width={512}
              height={768}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}