import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, MessageCircle } from "lucide-react";

import Layout from "@/components/portfolio/Layout";
import MoreProjectsCard from "@/components/portfolio/project/MoreProjectsCard";
import ProjectLightbox from "@/components/portfolio/project/ProjectLightbox";
import ProjectMeta from "@/components/portfolio/project/ProjectMeta";
import ProjectMetrics from "@/components/portfolio/project/ProjectMetrics";
import ProjectTechStack from "@/components/portfolio/project/ProjectTechStack";
import { navigateToSection } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { imageDimensions } from "@/data/imageDimensions";
import { personalInfo } from "@/data/personalInfo";
import { projects } from "@/data/projects";

// Same eyebrow type as SectionHeader, so project pages read like the rest of the site.
const labelClass = "font-mono text-xs uppercase tracking-[0.3em] text-accent/80";

export default function ProjectPage() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const location = useLocation();
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Stable pick of "other projects" per id — a random sort on every render
  // reshuffled the cards whenever state changed (e.g. opening the lightbox).
  const otherProjects = useMemo(
    () =>
      [...projects]
        .filter((p) => p.id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3),
    [id]
  );

  const gallery = useMemo(() => project?.gallery ?? [], [project]);
  const galleryCount = gallery.length;

  const showPrev = useCallback(() => {
    setOpenIndex((prev) => {
      if (prev === null || galleryCount === 0) return prev;
      return (prev - 1 + galleryCount) % galleryCount;
    });
  }, [galleryCount]);

  const showNext = useCallback(() => {
    setOpenIndex((prev) => {
      if (prev === null || galleryCount === 0) return prev;
      return (prev + 1) % galleryCount;
    });
  }, [galleryCount]);

  // Lock page scroll while the dialog is open, restoring the previous value.
  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex]);

  if (!project) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-6 py-24 mt-10 text-center">
          <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
          <p className="mt-3 text-muted-foreground">This project may have been renamed or removed.</p>
          <Button variant="ghost" className="mt-6 gap-2" asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All projects
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const heroSrc = project.imageUrl || project.thumbnailImageUrl;
  const heroDimensions = heroSrc ? imageDimensions[heroSrc] : undefined;
  const liveLabel = project.liveUrl?.includes("figma.com")
    ? "View the prototype"
    : "Visit the live site";
  // Projects without a public repo still get a code link, pointing at the profile.
  const codeUrl = project.githubUrl ?? personalInfo.github;
  const codeLabel = project.githubUrl ? "View code" : "More code on GitHub";

  return (
    <Layout>
      <article className="mx-auto max-w-7xl px-6 py-24 mt-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-8 gap-2 text-muted-foreground"
          asChild
        >
          <Link to="/projects">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </Link>
        </Button>

        {/* Hero: title first, image second — the fastest possible orientation. */}
        <header>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </p>

          <h1 className="mt-5 max-w-5xl text-pretty text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <Button variant="accent" className="gap-2" asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="project_live_click"
                  data-track-label={project.id}
                >
                  {liveLabel}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            )}

            <Button variant="outline" className="gap-2" asChild>
              <a
                href={codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="project_source_click"
                data-track-label={project.id}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {codeLabel}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Button>
          </div>

          <ProjectTechStack techStack={project.techStack} className="mt-6" />
        </header>

        {/* Natural aspect ratio: screenshots are never cropped, whatever their shape. */}
        <figure className="relative mt-10 overflow-hidden rounded-lg border border-border/60 bg-card/30">
          {/* Lowercase attribute: React 18 does not map camelCase fetchPriority. */}
          <img
            src={heroSrc}
            alt={`${project.title} — homepage`}
            width={heroDimensions?.w}
            height={heroDimensions?.h}
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="h-auto w-full"
          />
          {/* Most screenshots are light; a hint of shade keeps them from glaring. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent"
          />
        </figure>

        {/* At a glance: facts on the left, the one-sentence goal + numbers on the right. */}
        <section aria-labelledby="project-goal" className="mt-16 border-t border-border/60 pt-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <ProjectMeta project={project} />
            </div>

            <div className="lg:col-span-8 lg:border-l lg:border-border/60 lg:pl-12">
              <h2 id="project-goal" className={labelClass}>
                Goal of the collaboration
              </h2>
              {/* Standfirst: the context that makes the one-liner below land. */}
              <p className="mt-5 text-pretty text-2xl font-medium leading-[1.3] tracking-tight text-foreground sm:text-3xl">
                {project.goal}
              </p>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {project.brief}
              </p>

              <ProjectMetrics metrics={project.metrics} />
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {project.liveUrl && (
                  <Button variant="accent" className="gap-2" asChild>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="project_live_click"
                      data-track-label={project.id}
                    >
                      {liveLabel}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href={codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="project_source_click"
                    data-track-label={project.id}
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    {codeLabel}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </Button>
              </div>
            </div>

          </div>
        </section>

        <section
          aria-labelledby="project-challenge"
          className="mt-20 grid gap-4 border-t border-border/60 pt-12 md:grid-cols-12 md:gap-12"
        >
          <h2 id="project-challenge" className={`${labelClass} md:col-span-4`}>
            The challenge
          </h2>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foreground/90 md:col-span-8">
            {project.challenge}
          </p>
        </section>

        <section
          aria-labelledby="project-approach"
          className="mt-12 grid gap-6 border-t border-border/60 pt-12 md:grid-cols-12 md:gap-12"
        >
          <h2 id="project-approach" className={`${labelClass} md:col-span-4`}>
            What I did
          </h2>
          <ol className="md:col-span-8">
            {project.approach.map((item, index) => (
              <li
                key={item}
                className="flex items-baseline gap-4 border-b border-border/40 py-4 first:pt-0 last:border-0 last:pb-0"
              >
                <span className="text-xs font-semibold tabular-nums text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-relaxed text-foreground/90">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {galleryCount > 0 && (
          <section aria-labelledby="project-gallery" className="mt-20 border-t border-border/60 pt-12">
            <h2 id="project-gallery" className={labelClass}>
              Selected screens
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Open any image for a larger view — arrow keys move between shots.
            </p>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {gallery.map((item, index) => {
                const dimensions = imageDimensions[item.src];

                return (
                  <li key={item.src}>
                    {/* A button (not a clickable img) keeps the gallery reachable by keyboard. */}
                    <button
                      type="button"
                      onClick={() => setOpenIndex(index)}
                      className="block w-full overflow-hidden rounded-lg border border-border/60 bg-card/30 text-left transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={`Open image ${index + 1} of ${galleryCount}: ${item.alt}`}
                    >
                      {/* object-contain keeps every screenshot whole instead of cropping it. */}
                      <img
                        src={item.src}
                        alt={item.alt}
                        width={dimensions?.w}
                        height={dimensions?.h}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/10] w-full bg-card/60 object-contain"
                      />
                      <span className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
                        <span className="line-clamp-1">{item.alt}</span>
                        <span className="shrink-0 tabular-nums">
                          {index + 1} / {galleryCount}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section
          aria-labelledby="project-outcome"
          className="mt-20 rounded-xl border border-accent/30 bg-accent/[0.06] p-6 sm:p-10"
        >
          <h2 id="project-outcome" className={labelClass}>
            The outcome
          </h2>
          <p className="mt-4 max-w-3xl text-pretty text-xl leading-relaxed text-foreground sm:text-2xl">
            {project.outcome}
          </p>
        </section>

        <section
          aria-labelledby="project-cta"
          className="mt-12 flex flex-col gap-5 rounded-xl border border-border/60 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <h2 id="project-cta" className="text-xl font-semibold text-foreground">
              Building something similar?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              I'm open to front-end roles and freelance work. Tell me what you're shipping.
            </p>
          </div>
          <Button variant="accent" size="lg" className="shrink-0 gap-2" asChild>
            <a
              href="/#contact"
              onClick={(event) => {
                event.preventDefault();
                navigateToSection("#contact", location.pathname, navigate);
              }}
              data-track="project_contact_cta"
              data-track-label={project.id}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Let&rsquo;s talk
            </a>
          </Button>
        </section>

        <section aria-labelledby="more-projects" className="mt-24 border-t border-border/60 pt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="more-projects" className={labelClass}>
              More projects
            </h2>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" asChild>
              <Link to="/projects">
                All projects
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Intentionally lighter than the shared listing card: no tech chips or
              action buttons, so this closing strip stays secondary to the case study. */}
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((other) => (
              <li key={other.id}>
                <MoreProjectsCard project={other} />
              </li>
            ))}
          </ul>
        </section>
      </article>
      {openIndex !== null && (
        <ProjectLightbox
          items={gallery}
          index={openIndex}
          title={project.title}
          onClose={() => setOpenIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </Layout>
  );
}
