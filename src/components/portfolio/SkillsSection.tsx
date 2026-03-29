import React from "react";
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiGit,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAffinity,
  SiAmazonwebservices,
  SiBlender,
  SiVite,
  SiShopify,
  SiAdobepremierepro,
  SiCss3,
  SiHtml5,
  SiWordpress,
  SiCanva,
  SiVercel

} from "react-icons/si";
import SectionHeader from "./SectionHeader";

type Skill = {
  name: string;
  icon: React.ReactNode;
};

const technicalSkills: Skill[] = [
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "React", icon: <SiReact /> },
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  { name: "Node.js", icon: <SiNodedotjs /> },
  { name: "Git", icon: <SiGit /> },
  { name: "HTML", icon: <SiHtml5 /> },
  { name: "CSS", icon: <SiCss3 /> },
  { name: "Vite", icon: <SiVite /> },
  { name: "AWS", icon: <SiAmazonwebservices /> },
  { name: "Liquid", icon: <SiShopify /> },
  { name: "Wordpress", icon: <SiWordpress /> },
  { name: "Vercel", icon: <SiVercel /> },

];

const designSkills: Skill[] = [
  { name: "Photoshop", icon: <SiAdobephotoshop /> },
  { name: "Illustrator", icon: <SiAdobeillustrator /> },
  { name: "Affinity", icon: <SiAffinity /> },
  { name: "Canva", icon: <SiCanva /> },
  { name: "Figma", icon: <SiFigma /> },
  { name: "Blender", icon: <SiBlender /> },
  { name: "Premier Pro", icon: <SiAdobepremierepro /> },
];

interface MarqueeRowProps {
  items: Skill[];
  direction?: "left" | "right";
  duration?: number;
}

function MarqueeRow({
  items,
  direction = "left",
  duration = 25,
}: MarqueeRowProps) {
  const animationClass =
    direction === "left"
      ? "animate-marquee-left"
      : "animate-marquee-right";
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden group py-5">
      {/* Fade Left */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10" />
      {/* Fade Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10" />
      <div
        className={`flex w-max gap-6 ${animationClass} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="
            /* Basic and mobile */
            flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 backdrop-blur-md 
            px-5 py-3 text-sm font-medium text-foreground whitespace-nowrap transition-all duration-300 
            /* Interaction States */
            hover:scale-105 hover:border-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20 active:scale-95
            /* Desktop */
            sm:gap-3 sm:px-8 sm:py-5 sm:text-base"
          >
            <span className="text-2xl text-accent md:text-3xl">
              {skill.icon}
            </span>
            <span className="text-lg">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader preTitle="What I use" title="Skills" />
        <div>
          <MarqueeRow items={technicalSkills} direction="left" duration={70} />
          <MarqueeRow items={designSkills} direction="right" duration={50} />
        </div>
      </div>
    </section>
  );
}