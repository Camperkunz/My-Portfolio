import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRouteMeta, type RouteMeta } from "@/lib/seo";

const upsertMeta = (key: string, content: string, attribute: "name" | "property" = "name") => {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!href) {
    existing?.remove();
    return;
  }

  const link = existing ?? document.createElement("link");
  link.setAttribute("rel", "canonical");
  link.setAttribute("href", href);
  if (!existing) document.head.appendChild(link);
};

const upsertJsonLd = (jsonLd: RouteMeta["jsonLd"]) => {
  let script = document.getElementById("route-jsonld") as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "route-jsonld";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
};

/**
 * Keeps `<title>`, description, canonical, Open Graph / Twitter tags and
 * structured data in sync with the current route.
 *
 * The same values are baked into the prerendered HTML at build time
 * (`vite.config.ts` -> `seoShellsAndCssInlining`), so crawlers that do not run
 * JS and social-preview bots see route-specific metadata without waiting for React.
 */
export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);

    document.title = meta.title;

    upsertMeta("description", meta.description);
    upsertMeta("robots", meta.robots);

    upsertMeta("og:type", meta.ogType, "property");
    upsertMeta("og:title", meta.title, "property");
    upsertMeta("og:description", meta.description, "property");
    upsertMeta("og:url", meta.canonical || window.location.href, "property");
    upsertMeta("og:image", meta.image, "property");
    upsertMeta("og:image:alt", meta.imageAlt, "property");
    upsertMeta("og:image:width", String(meta.imageWidth), "property");
    upsertMeta("og:image:height", String(meta.imageHeight), "property");

    upsertMeta("twitter:title", meta.title);
    upsertMeta("twitter:description", meta.description);
    upsertMeta("twitter:image", meta.image);
    upsertMeta("twitter:image:alt", meta.imageAlt);

    upsertCanonical(meta.canonical);
    upsertJsonLd(meta.jsonLd);
  }, [pathname]);
}
