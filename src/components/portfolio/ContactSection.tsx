import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader preTitle="Let's connect" title="Contact" />

        <div className="mx-auto max-w-4xl grid gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-8">
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-8">Get in Touch</h3>
            <div className="flex flex-col gap-6">
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-4 text-sm text-muted-foreground transition-colors hover:text-accent group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-accent/5 group-hover:bg-accent/10 transition-colors">
                  <Mail className="h-4 w-4 text-accent" />
                </span>
                {personalInfo.email}
              </a>
              <a
                href={`tel:${personalInfo.phone}`}
                className="inline-flex items-center gap-4 text-sm text-muted-foreground transition-colors hover:text-accent group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-accent/5 group-hover:bg-accent/10 transition-colors">
                  <Phone className="h-4 w-4 text-accent" />
                </span>
                {personalInfo.phone}
              </a>
              <div className="inline-flex items-start gap-4 text-sm text-muted-foreground">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-accent/5">
                  <MapPin className="h-4 w-4 text-accent" />
                </span>
                <div className="pt-2">
                  <p className="font-medium text-foreground">{personalInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-8">
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-8">Social</h3>
            <div className="flex flex-col gap-6">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-4 text-sm text-muted-foreground transition-colors hover:text-accent group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-accent/5 group-hover:bg-accent/10 transition-colors">
                  <Github className="h-4 w-4 text-accent" />
                </span>
                GitHub
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-4 text-sm text-muted-foreground transition-colors hover:text-accent group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-accent/5 group-hover:bg-accent/10 transition-colors">
                  <Linkedin className="h-4 w-4 text-accent" />
                </span>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
