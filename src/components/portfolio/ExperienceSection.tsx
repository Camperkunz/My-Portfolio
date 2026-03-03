import { experiences } from "@/data/portfolio";
import SectionHeader from "./SectionHeader";

export default function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader preTitle="Where I've worked" title="Work Experience" />
      <div className="mt-12 relative">
        <div className="absolute left-0 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-accent/20" />
        {experiences.map((exp, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} mb-12 last:mb-0`}>
              <div className={`md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"} pl-8 md:pl-0`}>
                <div className="group rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                  <p className="text-xs font-mono text-accent font-mono">{exp.period}</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground font-mono">{exp.role}</h3>
                  <p className="text-md font-medium text-muted-foreground font-mono">{exp.company}</p>
                  <div className="mt-3 text-md text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-5">
                      {exp.description.map((line, j) => (
                        <li className="mb-3 transition-all hover:text-foreground hover:pl-0.5" key={j}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 md:left-1/2 top-5 md:top-6 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-accent bg-background z-10" />
              <div className="hidden md:block md:w-1/2" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
