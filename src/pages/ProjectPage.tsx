import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Layout from "@/components/portfolio/Layout";

export default function ProjectPage() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-2xl font-mono font-bold text-foreground">Project not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">← Back home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-24">
        <Link to="/#projects">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground mb-10 hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Button>
        </Link>

        {/* Hero image */}
        <img src={project.imageUrl} alt={project.title} className="w-full h-72 rounded-xl object-cover bg-muted border border-border/50" />

        {/* Title & description */}
        <h1 className="mt-10 font-mono text-4xl font-bold text-foreground">{project.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{project.shortDescription}</p>

        {/* Action buttons */}
        <div className="mt-8 flex gap-3">
          {project.githubUrl && (
            <Button variant="outline" size="default" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" /> Source Code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="default" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
        </div>

        {/* About section */}
        <div className="mt-14">
          <h2 className="text-sm font-medium text-accent uppercase tracking-wider">About</h2>
          <p className="mt-4 text-foreground leading-relaxed text-base">{project.fullDescription}</p>
        </div>

        {/* Details section (fill later) */}
        {project.details && (
          <div className="mt-12">
            <h2 className="text-sm font-medium text-accent uppercase tracking-wider">Details</h2>
            <p className="mt-4 text-foreground leading-relaxed text-base">{project.details}</p>
          </div>
        )}

        {/* Notes section (fill later) */}
        {project.notes && (
          <div className="mt-12">
            <h2 className="text-sm font-medium text-accent uppercase tracking-wider">Notes</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base">{project.notes}</p>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-accent uppercase tracking-wider">Tech Stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <Badge key={t} variant="outline" className="border-accent/20 hover:border-accent/50 transition-colors px-3 py-1">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="mt-14">
            <h2 className="text-sm font-medium text-accent uppercase tracking-wider">Gallery</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full h-48 rounded-lg object-cover bg-muted border border-border/50 hover:border-accent/30 transition-colors"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
