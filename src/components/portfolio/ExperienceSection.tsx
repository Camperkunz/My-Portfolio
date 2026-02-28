import { experiences } from "@/data/portfolio";

export default function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="font-mono text-2xl font-bold text-accent">Experience</h2>
      <div className="mt-10 space-y-10 border-l border-accent/20 pl-6">
        {experiences.map((exp, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[30.5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
            <p className="text-xs text-muted-foreground">{exp.period}</p>
            <h3 className="mt-1 font-semibold text-foreground">{exp.role}</h3>
            <p className="text-sm text-muted-foreground">{exp.company}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
