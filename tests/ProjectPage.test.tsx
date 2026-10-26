// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { personalInfo } from "../src/data/personalInfo";
import { projects } from "../src/data/projects";
import ProjectPage from "../src/pages/ProjectPage";

// jsdom implements neither IntersectionObserver (used by the contact FAB that
// Layout renders) nor matchMedia, so both get minimal stubs.
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: number[] = [];

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

const renderProject = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/project/${id}`]}>
      <Routes>
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ProjectPage", () => {
  it("leads with the title, goal and three metrics", () => {
    renderProject("portfolio");

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Personal Portfolio");
    expect(screen.getByText("Goal of the collaboration")).toBeTruthy();
    expect(screen.getByText("case studies in one build")).toBeTruthy();
    expect(screen.getByText("templates used")).toBeTruthy();
    expect(screen.getByText("codebase to maintain")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "What I did" })).toBeTruthy();
  });

  it("opens gallery images in a modal that closes on Escape", () => {
    renderProject("portfolio");

    const thumbnails = screen.getAllByRole("button", { name: /open image/i });
    expect(thumbnails).toHaveLength(2);

    fireEvent.click(thumbnails[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("shows the section brief and links to the public repo", () => {
    const portfolio = projects.find((project) => project.id === "portfolio")!;

    renderProject("portfolio");

    expect(screen.getByText(portfolio.brief)).toBeTruthy();
    expect(screen.getByRole("link", { name: /view code/i }).getAttribute("href")).toBe(portfolio.githubUrl);
    // The eyebrow no longer labels every page as a "Case study".
    expect(screen.queryByText("Case study")).toBeNull();
  });

  it("falls back to the GitHub profile when a project has no repo", () => {
    renderProject("unique-ecommerce");

    expect(screen.getByRole("link", { name: /more code on github/i }).getAttribute("href")).toBe(
      personalInfo.github,
    );
  });

  it("keeps the More projects cards compact", () => {
    renderProject("portfolio");

    const section = screen.getByRole("region", { name: /more projects/i });
    const cards = within(section).getAllByRole("listitem");

    // Three previews, each a single link: no action buttons and no tech chips,
    // unlike the shared listing card used on the home and /projects pages.
    expect(cards).toHaveLength(3);
    expect(within(section).getAllByRole("heading", { level: 3 })).toHaveLength(3);

    for (const card of cards) {
      expect(within(card).getAllByRole("link")).toHaveLength(1);
      expect(within(card).queryByRole("link", { name: /^live preview$/i })).toBeNull();
      expect(within(card).queryByRole("link", { name: /^source$/i })).toBeNull();
      expect(within(card).queryByLabelText(/tech stack/i)).toBeNull();
    }
  });

  it("renders a not-found state for unknown ids", () => {
    renderProject("does-not-exist");

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Project not found");
  });
});
