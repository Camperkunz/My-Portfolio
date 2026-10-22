import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { scrollToSection } from "@/components/navigation";
import ProjectCard from "../ProjectCard";
import SectionHeader from "../SectionHeader";

export default function ProjectsSection() {
  const featuredProjects = projects.filter((p) => p.featured);
  const featured =
    featuredProjects.length > 0 ? featuredProjects.slice(0, 3) : projects.slice(0, 3);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader preTitle="What I've built" title="Projects" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Have a project in mind?{" "}
        <a
          href="/#contact"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("#contact");
          }}
          data-track="projects_contact_cta"
          className="font-medium text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Let's talk
        </a>
      </p>
    </section>
  );
}