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
      <div className="mx-auto max-w-3xl px-6 py-24">
        <Link to="/#projects">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-accent mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Button>
        </Link>

        <img src={project.imageUrl} alt={project.title} className="w-full h-64 rounded-lg object-cover bg-muted" />

        <h1 className="mt-8 font-mono text-3xl font-bold text-foreground">{project.title}</h1>
        <p className="mt-2 text-muted-foreground">{project.shortDescription}</p>

        <div className="mt-6 flex gap-3">
          {project.githubUrl && (
            <Button variant="outline" size="sm" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground" asChild>
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" /> Source Code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="sm" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground" asChild>
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">About</h2>
          <p className="mt-3 text-foreground leading-relaxed">{project.fullDescription}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <Badge key={t} variant="outline" className="border-accent/20 hover:border-accent/50 transition-colors">{t}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
