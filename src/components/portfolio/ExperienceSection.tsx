import { experiences } from "@/data/portfolio";

export default function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-mono text-2xl font-bold text-accent justify-self-center mb-20">Work Experience</h2>
      <div className="mt-12 relative">
        {/* Central timeline line */}
        <div className="absolute left-0 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-accent/20" />

        {experiences.map((exp, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} mb-12 last:mb-0`}>
              {/* Content */}
              <div className={`md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"} pl-8 md:pl-0`}>
                <div className="group rounded-lg border border-border/50 bg-card/50 p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                  <p className="text-xs font-mono text-accent">{exp.period}</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{exp.role}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-5">
                      {exp.description.map((line, i) => (
                        <li className="mb-3 transition-all hover:text-white hover:pl-0.5" key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Dot */}
              <div className="absolute left-0 md:left-1/2 top-5 md:top-6 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-accent bg-background z-10" />
              {/* Empty side */}
              <div className="hidden md:block md:w-1/2" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
