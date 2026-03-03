import { useState } from "react";
import { personalInfo } from "@/data/portfolio";
import SectionHeader from "./SectionHeader";

export default function AboutSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader preTitle="Get to know me" title="About Me" />

      <div className="grid gap-12 md:grid-cols-2 items-center">
        {/* Text */}
        <div className="text-center md:text-left"> 
          <p className="text-muted-foreground leading-relaxed mb-4">
            Hi, I’m Anna - a Front-End Developer from Ottawa with 2+ years of experience.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            I craft sleek, responsive, and interactive web experiences using React, TypeScript, and modern JS libraries, and I’m equally comfortable working with CMS platforms like Shopify and WordPress, diving into PHP, Liquid, and server-side logic when projects demand it.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I successfully combine creativity and coding, guiding projects all the way from idea and design to final implementation, creating clean, fast, and user-friendly digital experiences that look great and work perfectly.
          </p>
        </div>

        {/* Photo with parallax */}
        <div
          className="flex justify-center md:justify-end"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="relative w-72 h-80 rounded-2xl overflow-hidden border border-border/50 shadow-lg shadow-accent/5 transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            }}
          >
            <img
              src={personalInfo.image}
              alt={personalInfo.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
