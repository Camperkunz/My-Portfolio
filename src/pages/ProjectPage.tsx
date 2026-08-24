import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "@/components/portfolio/Layout";
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiNextdotjs,
  SiStripe,
  SiVercel,
  SiFigma,
  SiSquarespace,
  SiShopify,
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiVite,
  SiFirebase,
  SiVuedotjs,
} from "react-icons/si";
import { Brain } from "lucide-react";
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
  Vue: <SiVuedotjs className="h-5 w-5" />,
  AI: <Brain className="h-5 w-5" />,
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
  const otherProjects = projects
    .filter((p) => p.id !== id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // State for the gallery lightbox
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

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
    { title: "Overview", content: project.fullDescription, imageUrl: project.overviewImageUrl || project.imageUrl || project.thumbnailImageUrl },
    { title: "The Problem", content: project.problem, imageUrl: project.problemImageUrl || project.imageUrl },
    { title: "The Solution", content: project.solution, imageUrl: project.solutionImageUrl || project.imageUrl },
    { title: "Implementation", content: project.implementation, imageUrl: project.implementationImageUrl || project.imageUrl },
    { title: "Results", content: project.results, imageUrl: project.resultsImageUrl || project.imageUrl },
  ].filter((b) => b.content);

  // Images that can be opened in the gallery (hero excluded for now)
  const galleryImages = contentBlocks
    .map((b) => b.imageUrl)
    .filter(Boolean) as string[];

  // Buttons to navigate through the gallery images
  const showPrev = () => {
    setOpenIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + galleryImages.length) % galleryImages.length;
    });
  };

  const showNext = () => {
    setOpenIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % galleryImages.length;
    });
  };

  // Keyboard navigation for the gallery lightbox
  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, galleryImages.length]);

  // Lock page scroll while the lightbox is open
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        showPrev();
      } else {
        showNext();
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-16 mt-8">
        <Link to="/#projects">
          <Button variant="ghost" size="sm" className="gap-3 text-muted-foreground mb-8 transition-colors hover:text-foreground">
            <ArrowLeft className="h-5 w-5" /> Back to projects
          </Button>
        </Link>

        {/* Hero Header */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="mb-32"
        >
          <div
            className="group relative rounded-2xl border border-border/50 overflow-hidden
               bg-card/30 backdrop-blur-md 
               shadow-xl shadow-black/10 
               transition-all duration-500 
               hover:shadow-2xl hover:shadow-black/30"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={project.imageUrl || project.thumbnailImageUrl || "/placeholder-project.jpg"}
                alt={project.title}
                className="w-full h-[70vh] md:h-[65vh] object-cover object-top
                   transition-transform duration-700 ease-out
                   group-hover:scale-[1.01]"
              />

              {/* gradient overlay */}
              <div
                className="absolute -inset-[1px] bg-gradient-to-t from-black/80 via-black/30 to-black/10 
                pointer-events-none
                transition-opacity duration-500 group-hover:opacity-90"
              />
              {/* subtle dark layer */}
              <div className="absolute inset-0 bg-black/40 md:bg-black/35 pointer-events-none" />
            </div>

            {/* CONTENT */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <motion.div variants={fadeUp} custom={0}>
                {/* meta */}
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    variant="outline"
                    className="border-white/20 bg-black/40 backdrop-blur text-white text-sm px-3 py-1
                       transition-all duration-300 group-hover:bg-black/60
                       md:text-xs"
                  >
                    {project.category}
                  </Badge>
                  <span
                    className="text-sm font-mono text-white/80 bg-black/40 px-2 py-1 rounded-md backdrop-blur
                    transition-all duration-300 group-hover:bg-black/60
                    md:text-xs"
                  >
                    {project.year}
                  </span>
                </div>

                {/* title */}
                <h1
                  className="font-mono text-3xl md:text-5xl font-bold text-white 
                     leading-tight max-w-2xl "
                >
                  {project.title}
                </h1>

                {/* description */}
                <p className="mt-4 text-white/85 text-lg leading-relaxed max-w-xl">
                  {project.shortDescription}
                </p>
              </motion.div>

              {/* bottom row */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* buttons */}
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  {project.liveUrl && (
                    <Button
                      variant="accent"
                      className="gap-2 bg-accent text-accent-foreground 
                         transition-all duration-300 
                         hover:shadow-lg hover:shadow-accent/30"
                      asChild
                    >
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" /> Live Preview
                      </a>
                    </Button>
                  )}

                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      className="gap-2 border-white/30 text-white
                         hover:bg-white hover:text-black 
                         transition-all duration-300 "
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noreferrer">
                        <Github className="h-4 w-4" /> Source
                      </a>
                    </Button>
                  )}
                </div>

                {/* tech stack */}
                <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
                  {project.techStack.slice(0, 6).map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg 
                         bg-black/50 backdrop-blur-md border border-white/10 text-white"
                    >
                      {techIcons[t] && (
                        <span className="text-accent">{techIcons[t]}</span>
                      )}
                      {t}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* subtle accent glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl 
                 opacity-0 group-hover:opacity-100 
                 transition-opacity duration-500
                 bg-gradient-to-tr from-accent/10 via-transparent to-transparent"
            />
          </div>
        </motion.section>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-accent uppercase tracking-wider font-mono">
                Highlights
              </h2>
            </div>

            <div className="space-y-4">
              {project.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="group flex items-start gap-4 rounded-xl 
                     border border-border/50 
                     bg-card/30 backdrop-blur-md 
                     p-4 transition-all duration-300
                     hover:border-accent/30 hover:bg-card/50"
                >
                  {/* number */}
                  <span className="text-accent font-mono text-md mt-1 opacity-70 group-hover:opacity-100">
                    0{i + 1}
                  </span>

                  {/* content */}
                  <p className="text-foreground leading-relaxed">
                    {h}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Alternating Content Blocks — each with its own image */}
        {contentBlocks.map((block, i) => {
          const isReversed = i % 2 !== 0;
          const imageIndex = block.imageUrl ? galleryImages.indexOf(block.imageUrl) : -1;

          return (
            <motion.section key={block.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="grid md:grid-cols-2 gap-10 items-center mb-40">
              <div className={isReversed ? "md:order-2" : ""}>
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider font-mono mb-4">{block.title}</h2>
                <p className="text-foreground leading-relaxed">{block.content}</p>
              </div>
              <div className={isReversed ? "md:order-1" : ""}>
                <img
                  src={block.imageUrl}
                  alt={`${project.title} — ${block.title}`}
                  onClick={() => imageIndex !== -1 && setOpenIndex(imageIndex)}
                  className="w-full aspect-[16/9] rounded-xl object-cover cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                />
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
                <img
                  src={p.thumbnailImageUrl || p.imageUrl || "/placeholder-project.jpg"}
                  alt={p.title}
                  className="w-full h-40 object-cover object-top"
                  loading="eager"
                />
                <div className="p-5">
                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Gallery Lightbox */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 touch-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenIndex(null);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white p-2 z-10"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <img
            src={galleryImages[openIndex]}
            alt="Full-size preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg select-none pointer-events-none"
          />
        </div>
      )}
    </Layout>
  );
}