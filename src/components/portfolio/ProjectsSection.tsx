import { projects } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

export default function ProjectsSection() {
  const featured = projects.slice(0, 3);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader preTitle="What I've built" title="Projects" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <Card
            key={p.id}
            className="group flex flex-col border-border/50 bg-card/30 backdrop-blur-md transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
          >
            <Link to={`/project/${p.id}`}>
              <img src={p.imageUrl} alt={p.title}
                className="h-60 w-full rounded-t-lg object-cover bg-muted" loading="lazy" />
            </Link>
            <CardContent className="flex flex-col flex-1 p-8">
              <div className="flex-1">
                <Link to={`/project/${p.id}`} className="hover:text-accent transition-colors">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{p.title}</h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{p.shortDescription}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.techStack.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs px-3 py-1.5 rounded-lg">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex gap-2 pt-6 border-t border-border/30">
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

      <div className="mt-12 flex justify-center">
        <Button
          variant="outline"
          className="gap-2 border-accent/40 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
          asChild
        >
          <Link to="/projects">
            Explore All Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
