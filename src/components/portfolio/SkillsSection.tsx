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


} from "react-icons/si";

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
];

const designSkills: Skill[] = [
  { name: "Photoshop", icon: <SiAdobephotoshop /> },
  { name: "Illustrator", icon: <SiAdobeillustrator /> },
  { name: "Affinity", icon: <SiAffinity /> },
  { name: "Canva", icon: <SiGit /> },
  { name: "Figma", icon: <SiFigma /> },
  { name: "Blender", icon: <SiBlender /> },
  { name: "Premier Pro", icon: <SiAdobepremierepro /> },
  { name: "Figma", icon: <SiFigma /> },
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
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10" />
      {/* Fade Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div
        className={`flex w-max gap-6 ${animationClass} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-8 py-5 text-medium font-medium text-foreground whitespace-nowrap transition-all duration-300 hover:scale-100 hover:border-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20"
>
            <span className="text-2xl text-accent ">
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
        <h2 className="font-mono text-2xl font-bold text-accent justify-self-center mb-20">
          Skills
        </h2>
        <div>
          <MarqueeRow items={technicalSkills} direction="left" duration={70} />
          <MarqueeRow items={designSkills} direction="right" duration={50} />
        </div>
      </div>
    </section>
  );
}