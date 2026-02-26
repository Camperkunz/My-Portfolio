import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {personalInfo.name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{personalInfo.title}</p>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">{personalInfo.tagline}</p>
      <div className="mt-6 flex gap-4">
        <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub"
          className="text-muted-foreground transition-colors hover:text-foreground">
          <Github className="h-5 w-5" />
        </a>
        <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
          className="text-muted-foreground transition-colors hover:text-foreground">
          <Linkedin className="h-5 w-5" />
        </a>
        <a href={`mailto:${personalInfo.email}`} aria-label="Email"
          className="text-muted-foreground transition-colors hover:text-foreground">
          <Mail className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
