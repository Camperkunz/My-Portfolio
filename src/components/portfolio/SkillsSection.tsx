import { skillGroups } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";

export default function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="font-mono text-2xl font-bold text-foreground">Skills</h2>
      <div className="mt-8 space-y-6">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-medium text-muted-foreground">{group.category}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <Badge key={skill} variant="outline">
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
