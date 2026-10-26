import type { ReactElement } from "react";
import { Droplets, Sparkles } from "lucide-react";
import {
  SiCloudflare,
  SiCss3,
  SiFigma,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiSanity,
  SiShopify,
  SiSquarespace,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
} from "react-icons/si";

import { cn } from "@/lib/utils";

/**
 * Brand glyph per label used in `Project.techStack`.
 *
 * `react-icons` ships no Liquid or "AI" mark, so those two fall back to neutral
 * lucide glyphs rather than borrowing an unrelated company logo.
 */
const techIcons: Record<string, ReactElement> = {
  React: <SiReact />,
  TypeScript: <SiTypescript />,
  JavaScript: <SiJavascript />,
  "Next.js": <SiNextdotjs />,
  "Tailwind CSS": <SiTailwindcss />,
  Sanity: <SiSanity />,
  Cloudflare: <SiCloudflare />,
  Figma: <SiFigma />,
  Shopify: <SiShopify />,
  Squarespace: <SiSquarespace />,
  HTML: <SiHtml5 />,
  CSS: <SiCss3 />,
  Vue: <SiVuedotjs />,
  Vite: <SiVite />,
  Vercel: <SiVercel />,
  Liquid: <SiShopify />,
  AI: <Sparkles />,
};

/**
 * Decorative logo for a single technology. Renders nothing for labels without
 * a glyph, so unknown tools degrade to plain text instead of an empty slot.
 */
export function TechIcon({ name }: { name: string }) {
  const icon = techIcons[name];
  if (!icon) return null;

  return (
    <span aria-hidden="true" className="inline-flex shrink-0 text-accent/90 [&>svg]:size-3.5">
      {icon}
    </span>
  );
}

interface ProjectTechStackProps {
  techStack: string[];
  className?: string;
}

/** Chip list of the tools behind a project, each paired with its logo. */
export default function ProjectTechStack({ techStack, className }: ProjectTechStackProps) {
  return (
    <ul aria-label="Tech stack" className={cn("flex flex-wrap gap-2", className)}>
      {techStack.map((tech) => (
        <li
          key={tech}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground"
        >
          <TechIcon name={tech} />
          {tech}
        </li>
      ))}
    </ul>
  );
}
