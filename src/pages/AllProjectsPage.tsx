import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/portfolio/Layout";
import ProjectCard from "@/components/portfolio/ProjectCard";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function AllProjectsPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-24 mt-10">
        <Link to="/#projects">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground mb-8 transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Button>
        </Link>

        <SectionHeader preTitle="Everything I've built" title="All Projects" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
