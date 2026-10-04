import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { projects } from "@/data/projects";

const SITE_TITLE = "Anna Nikiforova — React Frontend Developer";
const SITE_DESCRIPTION =
  "Ottawa-based React Frontend Developer building responsive, accessible and polished web experiences with React, JavaScript, TypeScript and Tailwind CSS.";

// Updates document.title and meta description per route in the SPA,
// where server meta tags stay the homepage ones (helps Google SEO).
export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = SITE_TITLE;
    let description = SITE_DESCRIPTION;

    if (pathname === "/projects") {
      title = "All Projects — Anna Nikiforova";
      description =
        "Browse all frontend projects by Anna Nikiforova: React, TypeScript, Shopify, Tailwind CSS and more.";
    } else if (pathname.startsWith("/project/")) {
      const project = projects.find((p) => `/project/${p.id}` === pathname);
      if (project) {
        title = `${project.title} — Anna Nikiforova`;
        description = project.shortDescription;
      } else {
        title = "Project Not Found — Anna Nikiforova";
        description = "This project does not exist.";
      }
    } else if (pathname !== "/") {
      title = "Page Not Found — Anna Nikiforova";
      description = "This page does not exist.";
    }

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [pathname]);
}
