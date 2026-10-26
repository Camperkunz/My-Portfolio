import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { imageDimensions } from "../src/data/imageDimensions";
import { projects } from "../src/data/projects";

const CATEGORIES = ["Work", "Freelance", "Personal", "Study"];
const wordCount = (text: string) => text.trim().split(/\s+/).length;

describe("project case-study data", () => {
  it("ships all nine case studies with unique ids", () => {
    expect(projects).toHaveLength(9);

    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z0-9-]+$/.test(id))).toBe(true);
  });

  it.each(projects)("$id follows the card contract", (project) => {
    expect(project.title.trim().length).toBeGreaterThan(0);
    expect(project.shortDescription.length).toBeGreaterThanOrEqual(80);
    expect(project.shortDescription.length).toBeLessThanOrEqual(155);
    expect(project.year).toMatch(/^\d{4}$/);
    expect(CATEGORIES).toContain(project.category);
    expect(project.sector.trim().length).toBeGreaterThan(0);
    expect(project.techStack.length).toBeGreaterThan(0);
  });

  it.each(projects)("$id keeps the scannable copy short", (project) => {
    expect(wordCount(project.goal)).toBeLessThanOrEqual(30);
    expect(wordCount(project.challenge)).toBeLessThanOrEqual(35);
    expect(wordCount(project.outcome)).toBeLessThanOrEqual(35);

    expect(project.approach).toHaveLength(3);
    expect(new Set(project.approach).size).toBe(3);

    for (const step of project.approach) {
      expect(step.trim().length).toBeGreaterThan(0);
      expect(wordCount(step)).toBeLessThanOrEqual(12);
    }
  });

  it.each(projects)("$id ships a brief for the goal section", (project) => {
    expect(project.brief.length).toBeGreaterThanOrEqual(60);
    expect(project.brief.length).toBeLessThanOrEqual(160);
    expect(wordCount(project.brief)).toBeLessThanOrEqual(25);
  });

  it.each(projects)("$id exposes exactly three metrics", (project) => {
    expect(project.metrics).toHaveLength(3);
    expect(new Set(project.metrics.map((metric) => metric.label)).size).toBe(3);

    for (const metric of project.metrics) {
      expect(metric.value.trim().length).toBeGreaterThan(0);
      expect(wordCount(metric.value)).toBeLessThanOrEqual(2);
      expect(metric.label.trim().length).toBeGreaterThan(5);
      expect(wordCount(metric.label)).toBeLessThanOrEqual(6);
    }
  });

  it.each(projects)("$id points at real, non-duplicated gallery images", (project) => {
    const gallery = project.gallery ?? [];

    expect(gallery.length).toBeGreaterThanOrEqual(2);
    expect(gallery.length).toBeLessThanOrEqual(3);
    expect(new Set(gallery.map((item) => item.src)).size).toBe(gallery.length);

    for (const item of gallery) {
      expect(item.src).toMatch(/^\/.+\.(webp|png|jpe?g)$/);
      expect(item.alt.trim().length).toBeGreaterThanOrEqual(15);
      expect(imageDimensions[item.src], `${item.src} has no registered dimensions`).toBeDefined();
      expect(existsSync(path.join(process.cwd(), "public", item.src))).toBe(true);
      expect(item.src).not.toBe(project.imageUrl);
    }
  });

  it("uses every gallery image exactly once across the site", () => {
    const seen = new Set<string>();

    for (const project of projects) {
      for (const item of project.gallery ?? []) {
        expect(seen.has(item.src), `${item.src} is reused by another project`).toBe(false);
        seen.add(item.src);
      }
    }
  });

  it.each(projects)("$id has a resolvable hero image", (project) => {
    const heroSrc = project.imageUrl || project.thumbnailImageUrl;

    expect(heroSrc).toBeTruthy();
    expect(imageDimensions[heroSrc as string]).toBeDefined();
    expect(existsSync(path.join(process.cwd(), "public", heroSrc as string))).toBe(true);
  });
});
