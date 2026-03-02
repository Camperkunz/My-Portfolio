import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader preTitle="Let's connect" title="Contact" />

        <div className="mt-12 rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-10 space-y-10">
          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold text-accent uppercase tracking-widest">Get in Touch</h3>
            <div className="flex flex-col items-center gap-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 text-accent" />
                {personalInfo.email}
              </a>
              <a
                href={`tel:${personalInfo.phone}`}
                className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4 text-accent" />
                {personalInfo.phone}
              </a>
              <span className="inline-flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                {personalInfo.address}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-24 mx-auto bg-border/50" />

          {/* Social Links */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold text-accent uppercase tracking-widest">Social</h3>
            <div className="flex justify-center gap-6">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
