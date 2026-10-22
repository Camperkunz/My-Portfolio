// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { usePageMeta } from "../src/hooks/usePageMeta";
import { SITE_URL } from "../src/lib/seo";

const PageMeta = () => {
  usePageMeta();
  return null;
};

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PageMeta />
    </MemoryRouter>,
  );

const metaContent = (selector: string) =>
  document.head.querySelector<HTMLMetaElement>(selector)?.getAttribute("content") ?? null;

afterEach(() => {
  cleanup();
  document.head.querySelectorAll("link[rel='canonical'], script#route-jsonld").forEach((el) => el.remove());
});

describe("usePageMeta", () => {
  it("writes route-specific tags for a project page", () => {
    renderAt("/project/portfolio");

    expect(document.title).toBe("Portfolio Website — Frontend Case Study | Anna Nikiforova");
    expect(document.head.querySelector("link[rel='canonical']")?.getAttribute("href")).toBe(
      `${SITE_URL}/project/portfolio`,
    );
    expect(metaContent("meta[property='og:url']")).toBe(`${SITE_URL}/project/portfolio`);
    expect(metaContent("meta[property='og:title']")).toContain("Portfolio Website");
    expect(metaContent("meta[name='robots']")).toBe("index, follow");
    expect(metaContent("meta[property='og:image']")).toMatch(/^https:\/\//);
    expect(metaContent("meta[property='og:image:width']")).toMatch(/^\d+$/);
    expect(metaContent("meta[name='twitter:image']")).toMatch(/^https:\/\//);
  });

  it("parses the JSON-LD it injects", () => {
    renderAt("/projects");

    const script = document.getElementById("route-jsonld");
    expect(script).not.toBeNull();

    const parsed = JSON.parse(script!.textContent ?? "{}") as { "@graph": { "@type": string }[] };
    expect(parsed["@graph"].map((node) => node["@type"])).toEqual(
      expect.arrayContaining(["Person", "WebSite", "CollectionPage"]),
    );
  });

  it("drops the canonical and adds noindex on a 404", () => {
    renderAt("/definitely-not-a-page");

    expect(document.head.querySelector("link[rel='canonical']")).toBeNull();
    expect(metaContent("meta[name='robots']")).toBe("noindex, follow");
    expect(document.title).toContain("Not Found");
  });

  it("does not duplicate tags when the route changes", () => {
    renderAt("/");
    cleanup();
    renderAt("/projects");

    expect(document.head.querySelectorAll("link[rel='canonical']").length).toBe(1);
    expect(document.head.querySelectorAll("meta[name='description']").length).toBe(1);
    expect(document.querySelectorAll("script#route-jsonld").length).toBe(1);
    expect(document.head.querySelector("link[rel='canonical']")?.getAttribute("href")).toBe(
      `${SITE_URL}/projects`,
    );
  });
});
