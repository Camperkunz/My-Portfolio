import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/components/navigation";
import { cn } from "@/lib/utils";

type Capability = {
  title: string;
  description: string;
};

/**
 * Deliberately no pricing, packages or availability blocks: the site leads with
 * full-time work, so this section only shows the shape of the help — the same
 * skills apply inside a team or on a single project.
 */
const capabilities: Capability[] = [
  {
    title: "End-to-end product design",
    description:
      "Discovery, user flows and UI design carried through to a developer-ready handoff.",
  },
  {
    title: "UX/UI design",
    description:
      "Responsive interfaces, design systems and accessible layouts that hold up on every screen.",
  },
  {
    title: "Frontend development",
    description:
      "React, TypeScript and Tailwind, plus the API and CMS wiring to ship a feature end to end.",
  },
  {
    title: "WordPress & Shopify development",
    description:
      "Custom themes, storefronts and CMS setup your team can update without touching code.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        {/* Side heading: same eyebrow and mono type as SectionHeader, left-aligned. */}
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80">
            What I can do
          </span>
          <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Design and build, in one pair of hands.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            I work across design and front-end development, so a product can go
            from the first sketch to a shipped interface with one person owning
            the details. The same skills apply whether I'm embedded in a team or
            brought in for a single project.
          </p>
          <Button variant="accent" className="mt-8 gap-2" asChild>
            <a
              href="/#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("#contact");
              }}
              data-track="services_contact_cta"
            >
              Discuss a role or project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>

        {/* Four capabilities in one bordered block, split like a spec sheet. */}
        <ul className="grid overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md sm:grid-cols-2">
          {capabilities.map((capability, index) => (
            <li
              key={capability.title}
              className={cn(
                "border-border/50 p-6 transition-colors hover:bg-accent/5 sm:p-7",
                index < capabilities.length - 1 && "border-b",
                index % 2 === 0 && "sm:border-r",
                index >= 2 && "sm:border-b-0"
              )}
            >
              <span
                className="font-mono text-xs text-accent/80"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-mono text-xl font-semibold leading-snug text-foreground">
                {capability.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {capability.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
