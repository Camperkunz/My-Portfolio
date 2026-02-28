import { useState } from "react";
import { projects } from "@/data/portfolio";
import { Project } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, Github } from "lucide-react";

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer border-border/50 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
      onClick={onClick}
    >
      <img src={project.imageUrl} alt={project.title}
        className="h-40 w-full rounded-t-lg object-cover bg-muted" loading="lazy" />
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground">{project.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {project.techStack.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectModal({ project, open, onClose }: { project: Project | null; open: boolean; onClose: () => void }) {
  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-mono">{project.title}</DialogTitle>
          <DialogDescription>{project.shortDescription}</DialogDescription>
        </DialogHeader>
        <img src={project.imageUrl} alt={project.title} className="mt-2 h-48 w-full rounded-md object-cover bg-muted" />
        <p className="mt-4 text-sm text-muted-foreground">{project.fullDescription}</p>
        <div className="mt-4">
          <h4 className="text-xs font-medium text-muted-foreground">Tech Stack</h4>
          <div className="mt-2 flex flex-wrap gap-1">
            {project.techStack.map((t) => (
              <Badge key={t} variant="outline" className="text-xs border-accent/20">{t}</Badge>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent">
              <Github className="h-4 w-4" /> Source
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <section id="projects" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="font-mono text-2xl font-bold text-accent">Projects</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
        ))}
      </div>
      <ProjectModal project={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
}
