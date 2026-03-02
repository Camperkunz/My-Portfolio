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
      <div className="mx-auto max-w-5xl px-6 py-24">
        <Link to="/#projects">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground mb-10 transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Button>
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-mono text-4xl sm:text-5xl font-bold text-foreground">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{project.shortDescription}</p>
          <div className="mt-8 flex justify-center gap-3">
            {project.githubUrl && (
              <Button variant="outline" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" /> Source Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <img src={project.imageUrl} alt={project.title} className="w-full h-80 rounded-xl object-cover bg-muted border border-border/50 mb-20" />

        {/* Overview — text left, image right */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Overview</h2>
            <p className="text-foreground leading-relaxed">{project.fullDescription}</p>
          </div>
          <img src={project.imageUrl} alt={`${project.title} overview`} className="w-full h-64 rounded-xl object-cover bg-muted border border-border/50" />
        </div>

        {/* Problem — image left, text right */}
        {project.details && (
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <img src={project.imageUrl} alt={`${project.title} problem`} className="w-full h-64 rounded-xl object-cover bg-muted border border-border/50 md:order-1" />
            <div className="md:order-2">
              <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Problem</h2>
              <p className="text-foreground leading-relaxed">{project.details}</p>
            </div>
          </div>
        )}

        {/* Solution — text left, image right */}
        {project.notes && (
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <div>
              <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Solution</h2>
              <p className="text-foreground leading-relaxed">{project.notes}</p>
            </div>
            <img src={project.imageUrl} alt={`${project.title} solution`} className="w-full h-64 rounded-xl object-cover bg-muted border border-border/50" />
          </div>
        )}

        {/* Technologies */}
        <div className="mb-20">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-6">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <Badge key={t} variant="outline" className="border-accent/20 hover:border-accent/50 transition-colors px-4 py-1.5 text-sm">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Results / Images */}
        <div className="mb-20">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-6">Results</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <img src={project.imageUrl} alt={`${project.title} result 1`} className="w-full h-56 rounded-xl object-cover bg-muted border border-border/50 hover:border-accent/30 transition-colors" />
            <img src={project.imageUrl} alt={`${project.title} result 2`} className="w-full h-56 rounded-xl object-cover bg-muted border border-border/50 hover:border-accent/30 transition-colors" />
            <img src={project.imageUrl} alt={`${project.title} result 3`} className="w-full h-56 rounded-xl object-cover bg-muted border border-border/50 hover:border-accent/30 transition-colors" />
            <img src={project.imageUrl} alt={`${project.title} result 4`} className="w-full h-56 rounded-xl object-cover bg-muted border border-border/50 hover:border-accent/30 transition-colors" />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-10 border-t border-border/30">
          <p className="text-muted-foreground text-sm mb-4">Interested in this project?</p>
          <div className="flex justify-center gap-3">
            {project.githubUrl && (
              <Button variant="outline" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" /> View Source
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Try Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
