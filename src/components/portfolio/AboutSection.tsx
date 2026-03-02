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
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Hi, I'm Anna - a passionate frontend developer and designer based in {personalInfo.address}. 
            I love crafting clean, performant, and user-centered web experiences using modern technologies.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            With a background in interactive media design and fine arts, I bring a unique blend of 
            technical skill and creative vision to every project I work on.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When I'm not coding, you'll find me exploring new design trends, experimenting with creative tools, 
            or working on personal projects that push my skills further.
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
              transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            }}
          >
            <img
              src="/placeholder.svg"
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
