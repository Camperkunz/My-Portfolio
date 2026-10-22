import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageDimensions } from "@/data/imageDimensions";
import type { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
}

/**
 * Shared project preview card for the home "Projects" section and the
 * /projects listing, so layout and analytics attributes stay in sync.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const imageSrc = project.thumbnailImageUrl || project.imageUrl;
  const dimensions = imageDimensions[imageSrc];

  return (
    <Card className="group flex flex-col border-border/50 bg-card/30 backdrop-blur-md transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      {/* One link per card (single tab stop). The delegated analytics listener in
          lib/analytics.ts reads data-track from the closest ancestor, so clicks on
          the image, category or title all report project_open. */}
      <Link to={`/project/${project.id}`} data-track="project_open" data-track-label={project.id} className="block">
        <img
          src={imageSrc}
          alt={`${project.title} — ${project.category} project preview`}
          width={dimensions?.w}
          height={dimensions?.h}
          className="h-60 w-full rounded-t-lg object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="px-8 pt-8 md:pt-6">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {project.category}
          </span>
          <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-accent">
            {project.title}
          </h3>
        </div>
      </Link>

      <CardContent className="flex flex-col flex-1 px-8 pb-8">
        <div className="flex-1">
          <p className="mt-1 text-sm text-muted-foreground">{project.shortDescription}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs px-3 py-1.5 rounded-lg">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto flex gap-2 pt-6 border-t border-border/30">
          {project.liveUrl && (
            <Button variant="accent" size="sm" className="gap-1.5 text-xs" asChild>
              <a
                href={project.liveUrl}
                data-track="project_live_click"
                data-track-label={project.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live Preview
              </a>
            </Button>
          )}

          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs hover:bg-accent hover:text-accent-foreground transition-all"
              asChild
            >
              <a
                href={project.githubUrl}
                data-track="project_source_click"
                data-track-label={project.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3.5 w-3.5" /> Source
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
