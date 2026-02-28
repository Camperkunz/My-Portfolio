import { useEffect, useRef } from "react";

const technicalSkills = [
  "TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "HTML", "CSS",
  "Node.js", "Git", "Docker", "Vite", "Webpack", "Jest", "Figma",
];

const softSkills = [
  "Problem Solving", "Communication", "Team Leadership", "Agile", "UI/UX Design",
  "Code Review", "Mentoring", "Project Management", "Research", "Accessibility",
];

function MarqueeRow({ items, direction = "left", speed = 30 }: { items: string[]; direction?: "left" | "right"; speed?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let pos = 0;
    const totalWidth = el.scrollWidth / 2;

    const animate = () => {
      pos += direction === "left" ? 0.5 : -0.5;
      if (direction === "left" && pos >= totalWidth) pos = 0;
      if (direction === "right" && pos <= -totalWidth) pos = 0;
      el.style.transform = `translateX(${-pos}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [direction]);

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div ref={scrollRef} className="flex gap-4 w-max">
        {doubled.map((skill, i) => (
          <div
            key={`${skill}-${i}`}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground whitespace-nowrap transition-all hover:border-accent/50 hover:shadow-md hover:shadow-accent/10"
          >
            <span className="h-2 w-2 rounded-full bg-accent/60" />
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="font-mono text-2xl font-bold text-accent justify-self-center mb-20">Skills</h2>
      </div>
      <div className="mt-12 space-y-4">
        <MarqueeRow items={technicalSkills} direction="left" />
        <MarqueeRow items={softSkills} direction="right" />
      </div>
    </section>
  );
}
