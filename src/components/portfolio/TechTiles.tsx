import { motion } from "framer-motion";
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
} from "react-icons/si";

const techs = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "JavaScript", icon: SiJavascript },
  { name: "HTML", icon: SiHtml5 },
  { name: "CSS", icon: SiCss3 },
];

export default function TechTiles() {
  return (
    <motion.div
      className="mt-12 flex flex-wrap items-center justify-center gap-3"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
    >
      {techs.map((tech, i) => (
        <motion.div
          key={tech.name}
          className="group flex items-center gap-2 rounded-lg border border-border/50 bg-card/20 backdrop-blur-md px-4 py-2.5 transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:shadow-md hover:shadow-accent/10 hover:scale-105 cursor-default"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 2 + i * 0.08, ease: "easeOut" }}
        >
          <tech.icon className="h-4 w-4 text-accent/70 group-hover:text-accent transition-colors" />
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {tech.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
