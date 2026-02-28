import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";

const roles = ["Frontend Developer", "UX/UI Designer", "Web Creator"];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Brighter red gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-accent/[0.03] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/[0.06] blur-3xl" /> */}

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Typewriter roles={roles} />
        <h1 className="mt-4 font-mono text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          {personalInfo.name}
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-base text-muted-foreground leading-relaxed">
          {personalInfo.tagline}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-accent">
            <Github className="h-5 w-5" />
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-accent">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={`mailto:${personalInfo.email}`} aria-label="Email"
            className="text-muted-foreground transition-colors hover:text-accent">
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            className="gap-2 border-accent/40 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
            asChild
          >
            <a href="/resume.pdf" download>
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
