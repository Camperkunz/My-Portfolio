import { projects } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-4xl px-6 py-24">
      <h2 className="font-mono text-2xl font-bold text-accent">Projects</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card
            key={p.id}
            className="group border-border/50 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
          >
            <Link to={`/project/${p.id}`}>
              <img src={p.imageUrl} alt={p.title}
                className="h-40 w-full rounded-t-lg object-cover bg-muted" loading="lazy" />
            </Link>
            <CardContent className="p-4">
              <Link to={`/project/${p.id}`} className="hover:text-accent transition-colors">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{p.title}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{p.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.techStack.slice(0, 3).map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <Github className="h-3.5 w-3.5" /> Source
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Demo
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
