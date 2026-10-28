import { personalInfo } from "@/data/personalInfo";
import { Github, Linkedin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Typewriter from "../animations/Typewriter";
import CodeToButton from "../animations/CodeToButton";

const roles = ["Frontend Developer", "Web Developer", "UI Engineer"];
const stackItems = ["React", "TypeScript", "Shopify", "AWS"];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] lg:min-h-[95vh] flex-col items-center justify-center px-6 pt-20 text-center overflow-hidden">
      {/* CSS entrance animation (was framer-motion) — keeps the animation
          library out of the critical entry bundle. `animate-rise` slides the
          block in without fading it: text first painted at opacity 0 is not
          an LCP candidate, which pushed mobile LCP onto a JS-revealed element
          further down the page. */}
      <div className="relative z-10 animate-rise motion-reduce:animate-none">
        <Typewriter roles={roles} />
        <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight text-foreground sm:text-7xl">
          {personalInfo.name}
          {/* Gives the single H1 a descriptive, keyword-relevant tail for search
              engines and screen readers without changing the visual design. */}
          <span className="sr-only"> — React Frontend Developer in Ottawa</span>
        </h1>
        <p className="mt-4 max-w-md mx-auto text-muted-foreground leading-relaxed text-base sm:text-xl">
          {personalInfo.tagline}
        </p>

        {/* Tech Stack Line */}
        <p
          className="mt-4 text-sm tracking-widest text-muted-foreground/70"
        >
          {stackItems.map((item, i) => (
            <span key={item}>
              <span className="text-accent/80 font-medium text-md">{item}</span>
              {i < stackItems.length - 1 && (
                <span className="mx-2 text-border">·</span>
              )}
            </span>
          ))}
        </p>

        <div className="mt-7 flex items-center justify-center gap-5">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)"
            className="text-muted-foreground transition-colors hover:text-accent">
            <Github className="size-5 md:size-6" />
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)"
            className="text-muted-foreground transition-colors hover:text-accent">
            <Linkedin className="size-5 md:size-6" />
          </a>
        </div>

        {/* CTA row: on mobile `min-h-10` + CodeToButton's reserved footprint keep
            this block a fixed-size island, so the typing animation cannot reflow
            the hero copy above it. From `sm` up the row never wraps, so the
            button goes back to its natural width there. */}
        <div className="mt-8 flex min-h-10 flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Button
            variant="outline"
            className="gap-2 border-accent/40 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all px-2 sm:px-4"
            asChild
          >
            <a href="/anna-nikiforova-resume.pdf" data-track="resume_click" data-track-label="hero" target="_blank" rel="noopener">
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </Button>
          <CodeToButton
            onNavigate={() =>
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </div>
    </section>
  );
}
