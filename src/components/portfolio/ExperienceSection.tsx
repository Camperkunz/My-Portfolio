import { experiences } from "@/data/portfolio";

export default function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="font-mono text-2xl font-bold text-foreground">Experience</h2>
      <div className="mt-8 space-y-8 border-l border-border pl-6">
        {experiences.map((exp, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[30.5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-foreground bg-background" />
            <p className="text-xs text-muted-foreground">{exp.period}</p>
            <h3 className="mt-1 font-semibold text-foreground">{exp.role}</h3>
            <p className="text-sm text-muted-foreground">{exp.company}</p>
            <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
