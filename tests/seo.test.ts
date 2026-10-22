import { describe, expect, it } from "vitest";

import { SITE_URL, getRouteMeta, getSeoRoutes, normalizePath, notFoundRoute } from "../src/lib/seo";
import { projects } from "../src/data/projects";

const graphTypes = (jsonLd: Record<string, unknown>) =>
  ((jsonLd["@graph"] as { "@type": string }[]) ?? []).map((node) => node["@type"]);

describe("normalizePath", () => {
  it("keeps the root path", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("")).toBe("/");
  });

  it("strips trailing slashes, query strings and hashes", () => {
    expect(normalizePath("/projects/")).toBe("/projects");
    expect(normalizePath("/project/portfolio/?ref=x")).toBe("/project/portfolio");
    expect(normalizePath("/project/portfolio#gallery")).toBe("/project/portfolio");
  });
});

describe("getRouteMeta", () => {
  it("gives the homepage a self-referencing canonical and indexable robots", () => {
    const meta = getRouteMeta("/");

    expect(meta.canonical).toBe(`${SITE_URL}/`);
    expect(meta.robots).toBe("index, follow");
    expect(meta.title).toContain("Anna Nikiforova");
    expect(graphTypes(meta.jsonLd)).toEqual(
      expect.arrayContaining(["Person", "WebSite", "ProfilePage"]),
    );
  });

  it("gives /projects its own canonical instead of the homepage URL", () => {
    const meta = getRouteMeta("/projects/");

    expect(meta.canonical).toBe(`${SITE_URL}/projects`);
    expect(meta.ogType).toBe("website");
    expect(graphTypes(meta.jsonLd)).toContain("CollectionPage");
    expect(graphTypes(meta.jsonLd)).not.toContain("BreadcrumbList");
  });

  it("gives every project page a unique canonical, title and absolute OG image", () => {
    const canonicals = new Set<string>();
    const titles = new Set<string>();

    for (const project of projects) {
      const meta = getRouteMeta(`/project/${project.id}`);

      expect(meta.canonical).toBe(`${SITE_URL}/project/${project.id}`);
      expect(meta.ogType).toBe("article");
      expect(meta.image.startsWith("https://")).toBe(true);
      expect(meta.imageAlt).toContain(project.title);
      expect(graphTypes(meta.jsonLd)).toContain("CreativeWork");
      expect(graphTypes(meta.jsonLd)).not.toContain("BreadcrumbList");

      canonicals.add(meta.canonical);
      titles.add(meta.title);
    }

    expect(canonicals.size).toBe(projects.length);
    expect(titles.size).toBe(projects.length);
  });

  it("keeps descriptions within a SERP-friendly length and on one line", () => {
    for (const route of getSeoRoutes()) {
      expect(route.meta.description.length).toBeLessThanOrEqual(160);
      expect(route.meta.description).not.toMatch(/[\r\n]/);
    }
  });

  it("marks unknown routes as noindex and emits no canonical", () => {
    const meta = getRouteMeta("/project/does-not-exist");

    expect(meta.canonical).toBe("");
    expect(meta.robots).toBe("noindex, follow");
    expect(meta.title).toContain("Not Found");
  });
});

describe("getSeoRoutes", () => {
  it("covers the homepage, the project index and every project detail page", () => {
    const paths = getSeoRoutes().map((route) => route.path);

    expect(paths).toEqual([
      "/",
      "/projects",
      ...projects.map((project) => `/project/${project.id}`),
    ]);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("exposes a noindex 404 route for the static 404.html shell", () => {
    expect(notFoundRoute.meta.robots).toBe("noindex, follow");
    expect(notFoundRoute.meta.canonical).toBe("");
  });
});
