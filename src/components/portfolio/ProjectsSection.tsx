import { projects } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="font-mono text-2xl font-bold text-accent justify-self-center mb-20">Projects</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card
            key={p.id}
            className="group flex flex-col border-border/50 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 backdrop-blur-xl"
          >
            <Link to={`/project/${p.id}`}>
              <img src={p.imageUrl} alt={p.title}
                className="h-40 w-full rounded-t-lg object-cover bg-muted" loading="lazy" />
            </Link>
            <CardContent className="flex flex-col flex-1 p-8">
              <div className="flex-1">
                <Link to={`/project/${p.id}`} className="hover:text-accent transition-colors">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{p.title}</h3>
                </Link>
                <p className="mt-1 text-s text-muted-foreground">{p.shortDescription}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.techStack.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs px-3 py-1.5 rounded-lg">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-2 pt-4 border-t border-border/30">
                {p.githubUrl && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs border-accent/20 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                    <a href={p.githubUrl} target="_blank" rel="noreferrer">
                      <Github className="h-3.5 w-3.5" /> Source
                    </a>
                  </Button>
                )}
                {p.liveUrl && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs border-accent/20 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                    <a href={p.liveUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
