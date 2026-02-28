import { educations } from "@/data/portfolio";

export default function EducationSection() {
  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-24">
      <h2 className="font-mono text-2xl font-bold text-accent">Education</h2>
      <div className="mt-12 relative">
        <div className="absolute left-0 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-accent/20" />
        
        {educations.map((edu, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} mb-12 last:mb-0`}>
              <div className={`md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"} pl-8 md:pl-0`}>
                <div className="group rounded-lg border border-border/50 bg-card/50 p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                  <p className="text-xs font-mono text-accent">{edu.period}</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
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
