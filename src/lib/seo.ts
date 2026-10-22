import { projects } from "../data/projects";
import { personalInfo } from "../data/personalInfo";
import { imageDimensions } from "../data/imageDimensions";

/**
 * Single source of truth for per-route SEO metadata.
 *
 * Used twice:
 *  - at runtime by `hooks/usePageMeta.ts` (client-side navigations), and
 *  - at build time by the Vite plugin in `vite.config.ts`, which writes static
 *    HTML shells for every route (`dist/projects/index.html`,
 *    `dist/project/<id>/index.html`, `dist/404.html`) so crawlers that do not
 *    execute JavaScript still get the right title, description, canonical,
 *    Open Graph tags and structured data.
 *
 * Keep it dependency-free (no React, no `@/` aliases) so the build can bundle it.
 */

export const SITE_URL = "https://annanikiforova.vercel.app";
export const SITE_NAME = "Anna Nikiforova — Portfolio";
export const PERSON_NAME = personalInfo.name;

export const DEFAULT_TITLE = "Anna Nikiforova — React Frontend Developer in Ottawa";
export const DEFAULT_DESCRIPTION =
  "Ottawa-based React Frontend Developer building responsive, accessible and polished web experiences with React, JavaScript, TypeScript and Tailwind CSS.";

export const OG_IMAGE = {
  url: `${SITE_URL}/portfolio/portfolio-og.jpg`,
  width: 1200,
  height: 630,
  alt: "Anna Nikiforova — React Frontend Developer Portfolio",
};

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

/** `/projects/` -> `/projects`, `/?x=1` -> `/`, keeps `/` as `/`. */
export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  if (!clean) return "/";
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export interface RouteMeta {
  title: string;
  description: string;
  /** Empty string means "do not emit a canonical link" (404 page). */
  canonical: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  robots: string;
  ogType: "website" | "article";
  jsonLd: Record<string, unknown>;
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_NAME,
  url: `${SITE_URL}/`,
  image: absoluteUrl(personalInfo.image),
  jobTitle: personalInfo.title,
  email: `mailto:${personalInfo.email}`,
  description: DEFAULT_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ottawa",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Shopify",
    "Frontend Development",
    "Web Accessibility",
    "Web Performance",
  ],
  sameAs: [personalInfo.github, personalInfo.linkedin],
};

const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

/** Trims to a SERP-friendly length on a word boundary. */
function toDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.-]$/, "")}…`;
}

const notFoundMeta = (): RouteMeta => ({
  title: "Page Not Found — Anna Nikiforova",
  description: "This page does not exist.",
  canonical: "",
  image: OG_IMAGE.url,
  imageAlt: OG_IMAGE.alt,
  imageWidth: OG_IMAGE.width,
  imageHeight: OG_IMAGE.height,
  robots: "noindex, follow",
  ogType: "website",
  jsonLd: { "@context": "https://schema.org", "@graph": [personNode, websiteNode] },
});

const homeMeta = (): RouteMeta => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: `${SITE_URL}/`,
  image: OG_IMAGE.url,
  imageAlt: OG_IMAGE.alt,
  imageWidth: OG_IMAGE.width,
  imageHeight: OG_IMAGE.height,
  robots: "index, follow",
  ogType: "website",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      websiteNode,
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
      },
    ],
  },
});

const projectsMeta = (): RouteMeta => {
  const url = `${SITE_URL}/projects`;
  return {
    title: "Frontend Projects — Anna Nikiforova | React & TypeScript",
    description:
      "Case studies of frontend projects by Anna Nikiforova: React, TypeScript, Shopify, Tailwind CSS and AI-assisted workflows — with goals, solutions and results.",
    canonical: url,
    image: OG_IMAGE.url,
    imageAlt: OG_IMAGE.alt,
    imageWidth: OG_IMAGE.width,
    imageHeight: OG_IMAGE.height,
    robots: "index, follow",
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        personNode,
        websiteNode,
        {
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          url,
          name: "Frontend Projects — Anna Nikiforova",
          description: "All frontend projects and case studies built by Anna Nikiforova.",
          isPartOf: { "@id": WEBSITE_ID },
          about: { "@id": PERSON_ID },
          hasPart: projects.map((project) => ({
            "@type": "CreativeWork",
            name: project.title,
            url: `${SITE_URL}/project/${project.id}`,
          })),
        },
      ],
    },
  };
};

const projectMeta = (project: (typeof projects)[number]): RouteMeta => {
  const url = `${SITE_URL}/project/${project.id}`;
  const imagePath = project.thumbnailImageUrl || project.imageUrl;
  const image = absoluteUrl(imagePath);
  const dimensions = imageDimensions[imagePath];
  return {
    title: `${project.title} — Frontend Case Study | Anna Nikiforova`,
    description: toDescription(project.shortDescription),
    canonical: url,
    image,
    imageAlt: `Screenshot of the ${project.title} project`,
    // Real screenshot size so link previews are not cropped by wrong hints.
    imageWidth: dimensions?.w ?? OG_IMAGE.width,
    imageHeight: dimensions?.h ?? OG_IMAGE.height,
    robots: "index, follow",
    ogType: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        personNode,
        websiteNode,
        {
          "@type": "CreativeWork",
          "@id": `${url}#work`,
          url,
          name: project.title,
          headline: project.title,
          description: project.shortDescription,
          image,
          inLanguage: "en",
          genre: project.category,
          keywords: project.techStack.join(", "),
          creator: { "@id": PERSON_ID },
          author: { "@id": PERSON_ID },
          isPartOf: { "@id": WEBSITE_ID },
          mainEntityOfPage: url,
        },
      ],
    },
  };
};

export function getRouteMeta(pathname: string): RouteMeta {
  const path = normalizePath(pathname);

  if (path === "/") return homeMeta();
  if (path === "/projects") return projectsMeta();

  const match = /^\/project\/([^/]+)$/.exec(path);
  if (match) {
    const project = projects.find((entry) => entry.id === match[1]);
    if (project) return projectMeta(project);
  }

  return notFoundMeta();
}

export interface SeoRoute {
  path: string;
  meta: RouteMeta;
}

/** Every route that gets its own static HTML shell + sitemap entry. */
export function getSeoRoutes(): SeoRoute[] {
  return [
    { path: "/", meta: homeMeta() },
    { path: "/projects", meta: projectsMeta() },
    ...projects.map((project) => ({
      path: `/project/${project.id}`,
      meta: projectMeta(project),
    })),
  ];
}

export const notFoundRoute: SeoRoute = { path: "/404", meta: notFoundMeta() };
