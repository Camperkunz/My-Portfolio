import { Link } from "react-router-dom";

import { imageDimensions } from "@/data/imageDimensions";
import type { Project } from "@/types/portfolio";

interface MoreProjectsCardProps {
  project: Project;
}

/**
 * Compact preview used only by the "More projects" strip on a case-study page.
 *
 * Deliberately lighter than the shared ProjectCard: no tech chips and no action
 * buttons, so the closing section does not repeat the full weight of the home
 * and /projects listings. The whole card is a single link (one tab stop); the
 * delegated listener in lib/analytics.ts reads data-track from the closest
 * ancestor, so the click still reports project_open.
 */
export default function MoreProjectsCard({ project }: MoreProjectsCardProps) {
  const imageSrc = project.thumbnailImageUrl || project.imageUrl;
  const dimensions = imageDimensions[imageSrc];

  return (
    <Link
      to={`/project/${project.id}`}
      data-track="project_open"
      data-track-label={project.id}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card/30 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <img
        src={imageSrc}
        alt={`${project.title} — ${project.category} project preview`}
        width={dimensions?.w}
        height={dimensions?.h}
        className="aspect-[16/10] w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />

      <div className="flex flex-1 flex-col gap-1 p-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {project.category}
        </span>
        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.shortDescription}</p>
      </div>
    </Link>
  );
}
