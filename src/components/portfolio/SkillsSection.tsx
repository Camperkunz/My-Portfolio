import { skillGroups } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";

export default function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="font-mono text-2xl font-bold text-accent">Skills</h2>
      <div className="mt-10 space-y-8">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-medium text-muted-foreground">{group.category}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <Badge key={skill} variant="outline" className="border-accent/20 hover:border-accent/50 transition-colors">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
