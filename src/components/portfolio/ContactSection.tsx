import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="font-mono text-2xl font-bold tracking-tight text-foreground">
        Contact
      </h2>
      <p className="mt-4 text-sm text-muted-foreground">
        Feel free to reach out — I'm always open to new opportunities and collaborations.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <a
          href={`mailto:${personalInfo.email}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          {personalInfo.email}
        </a>
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
      </div>
    </section>
  );
}
