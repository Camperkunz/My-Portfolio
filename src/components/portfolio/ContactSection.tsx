import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

function InfoBlock({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="text-base font-medium text-foreground">{children}</div>
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="w-full px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeader preTitle="Let's connect" title="Contact" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <InfoBlock icon={Mail} label="Email">
            <a href={`mailto:${personalInfo.email}`} className="transition-colors hover:text-accent">
              {personalInfo.email}
            </a>
          </InfoBlock>

          <InfoBlock icon={MapPin} label="Location">
            <span>{personalInfo.address}</span>
          </InfoBlock>
        </div>

        {/* Social Links */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Social</span>
          <div className="flex justify-center gap-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 text-white items-center justify-center rounded-xl border border-border/50 bg-card/30 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 text-white items-center justify-center rounded-xl border border-border/50 bg-card/30 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
