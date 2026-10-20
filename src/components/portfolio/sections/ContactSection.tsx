import { personalInfo } from "@/data/personalInfo";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import SectionHeader from "../SectionHeader";
import ContactForm from "../ContactForm";

const rowClass =
  "group flex items-center gap-4 rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-md transition-all hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

interface ContactRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function ContactRow({ icon: Icon, label, value, href, external = false }: ContactRowProps) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/15">
        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="mt-1 block break-words text-sm font-medium text-foreground">{value}</span>
      </span>
      {external && (
        <ArrowUpRight
          className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-accent"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (!href) {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <a href={href} className={rowClass} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {content}
    </a>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="w-full px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader preTitle="Let's connect" title="Contact" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          {/* Left: contact form */}
          <ContactForm />

          {/* Right: direct contact details */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-foreground">Or Reach me directly</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Prefer email or socials? Everything is one click away.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <ContactRow
                icon={Mail}
                label="Email"
                value={personalInfo.email}
                href={`mailto:${personalInfo.email}`}
              />
              <ContactRow icon={MapPin} label="Location" value={personalInfo.address} />
              <ContactRow
                icon={Github}
                label="GitHub"
                value="github.com/Camperkunz"
                href={personalInfo.github}
                external
              />
              <ContactRow
                icon={Linkedin}
                label="LinkedIn"
                value="linkedin.com/in/anna-nikiforova-ac"
                href={personalInfo.linkedin}
                external
              />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{personalInfo.contactNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

