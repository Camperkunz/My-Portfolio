import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Sparkles } from "lucide-react";
import Layout from "@/components/portfolio/Layout";
import { SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiNextdotjs, SiStripe, SiVercel, SiFigma, SiSquarespace, SiShopify, SiCss3, SiHtml5, SiJavascript, SiVite, SiFirebase } from "react-icons/si";
import { motion } from "framer-motion";

const techIcons: Record<string, React.ReactNode> = {
  React: <SiReact className="h-5 w-5" />,
  TypeScript: <SiTypescript className="h-5 w-5" />,
  "Tailwind CSS": <SiTailwindcss className="h-5 w-5" />,
  "Node.js": <SiNodedotjs className="h-5 w-5" />,
  "Next.js": <SiNextdotjs className="h-5 w-5" />,
  Stripe: <SiStripe className="h-5 w-5" />,
  Vercel: <SiVercel className="h-5 w-5" />,
  Figma: <SiFigma className="h-5 w-5" />,
  Squarespace: <SiSquarespace className="h-5 w-5" />,
  Shopify: <SiShopify className="h-5 w-5" />,
  CSS: <SiCss3 className="h-5 w-5" />,
  HTML: <SiHtml5 className="h-5 w-5" />,
  JavaScript: <SiJavascript className="h-5 w-5" />,
  Vite: <SiVite className="h-5 w-5" />,
  Firebase: <SiFirebase className="h-5 w-5" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ProjectPage() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const otherProjects = projects.filter((p) => p.id !== id).slice(0, 3);

  if (!project) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-2xl font-mono font-bold text-foreground">Project not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">← Back home</Link>
        </div>
      </Layout>
    );
  }

  const contentBlocks = [
    { title: "Overview", content: project.fullDescription, imageUrl: project.imageUrl },
    { title: "The Problem", content: project.problem, imageUrl: project.problemImageUrl || project.imageUrl },
    { title: "The Solution", content: project.solution, imageUrl: project.solutionImageUrl || project.imageUrl },
    { title: "Implementation", content: project.implementation, imageUrl: project.implementationImageUrl || project.imageUrl },
    { title: "Results", content: project.results, imageUrl: project.resultsImageUrl || project.imageUrl },
  ].filter((b) => b.content);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-16 mt-10">
        <Link to="/#projects">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground mb-8 transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Button>
        </Link>

        {/* Hero Header */}
        <motion.section initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-10 items-center mb-40">
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="border-accent/30 text-accent text-xs px-3 py-1">
                {project.category}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{project.year}</span>
            </div>
            <h1 className="font-mono text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {project.shortDescription}
            </p>
            <div className="mt-8 flex gap-3">
              {project.liveUrl && (
                <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" /> Live Preview
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" className="gap-2 border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" /> Source Code
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}>
            <img src={project.imageUrl} alt={project.title} className="w-full aspect-[3/2] rounded-xl object-cover bg-muted border border-border/50" />
          </motion.div>
        </motion.section>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-accent uppercase tracking-wider font-mono">Highlights</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.highlights.map((h, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md p-5 text-sm text-foreground leading-relaxed">
                  <span className="inline-flex w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold items-center justify-center mb-3">
                    {i + 1}
                  </span>
                  {h}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Tools & Technologies */}
        <section className="mb-20">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider font-mono mb-8">Tools & Technologies</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {project.techStack.map((t) => (
              <div key={t} className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-md px-5 py-3 text-sm text-foreground hover:border-accent/40 hover:scale-105 transition-all">
                {techIcons[t] && <span className="text-accent">{techIcons[t]}</span>}
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* Alternating Content Blocks — each with its own image */}
        {contentBlocks.map((block, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <motion.section key={block.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="grid md:grid-cols-2 gap-10 items-center mb-40">
              <div className={isReversed ? "md:order-2" : ""}>
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider font-mono mb-4">{block.title}</h2>
                <p className="text-foreground leading-relaxed">{block.content}</p>
              </div>
              <div className={isReversed ? "md:order-1" : ""}>
                <img src={block.imageUrl} alt={`${project.title} — ${block.title}`} className="w-full aspect-[3/2] rounded-xl object-cover bg-muted border border-border/50" />
              </div>
            </motion.section>
          );
        })}

        {/* Explore More Projects */}
        <section className="pt-16 border-t border-border/30">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider font-mono mb-8 text-center">Explore More Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((p) => (
              <Link key={p.id} to={`/project/${p.id}`}
                className="group rounded-xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all">
                <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover bg-muted" loading="lazy" />
                <div className="p-5">
                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
