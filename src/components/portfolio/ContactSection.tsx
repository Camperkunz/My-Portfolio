import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="font-mono text-2xl font-bold tracking-tight text-accent mb-4">
        Contact
      </h2>
      <p className="text-sm text-muted-foreground max-w-xl">
        Feel free to reach out — I'm always open to new opportunities and collaborations.
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {/* Contact Info */}
        <div>
          <h3 className="text-xs font-medium text-accent uppercase tracking-wider mb-6">Get in Touch</h3>
          <div className="flex flex-col gap-5">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent group"
            >
              <Mail className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors" />
              {personalInfo.email}
            </a>
            <a
              href={`tel:${personalInfo.phone}`}
              className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent group"
            >
              <Phone className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors" />
              {personalInfo.phone}
            </a>
            <div className="inline-flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 text-accent/60 shrink-0" />
              <div>
                <p>{personalInfo.city}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{personalInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xs font-medium text-accent uppercase tracking-wider mb-6">Social</h3>
          <div className="flex flex-col gap-5">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent group"
            >
              <Github className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors" />
              GitHub
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent group"
            >
              <Linkedin className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
