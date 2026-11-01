import { personalInfo } from "@/data/personalInfo";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import SectionHeader from "../SectionHeader";
import ContactForm from "../ContactForm";
import ContactRow from "../ContactRow";

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

