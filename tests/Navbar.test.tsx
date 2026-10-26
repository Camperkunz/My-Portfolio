// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";

import Navbar from "../src/components/portfolio/Navbar";

const DESKTOP_QUERY = "(min-width: 1024px)";

type MediaListener = (event: MediaQueryListEvent) => void;

let emitViewport: (matches: boolean) => void = () => undefined;

/** jsdom implements neither `matchMedia` nor `scrollTo`, so both get stubs. */
const stubBrowserApis = () => {
  const listeners = new Set<MediaListener>();

  const mql = {
    media: DESKTOP_QUERY,
    matches: false,
    onchange: null,
    addEventListener: (_type: string, listener: MediaListener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: MediaListener) => listeners.delete(listener),
    addListener: (listener: MediaListener) => listeners.add(listener),
    removeListener: (listener: MediaListener) => listeners.delete(listener),
    dispatchEvent: () => false,
  };

  vi.stubGlobal("matchMedia", vi.fn(() => mql as unknown as MediaQueryList));

  /** Simulates the viewport crossing the `lg` breakpoint. */
  emitViewport = (matches) => {
    mql.matches = matches;
    act(() => {
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    });
  };

  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
};

const LocationDisplay = () => {
  const { pathname, hash } = useLocation();
  return <span data-testid="location">{`${pathname}${hash}`}</span>;
};

const renderNavbar = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
      <LocationDisplay />
      <div id="about" />
      <div id="skills" />
      <div id="projects" />
    </MemoryRouter>,
  );

const getTrigger = () => screen.getByRole("button", { name: /menu/i });
const getPanel = () => document.getElementById("mobile-menu")!;
const getMobileLink = (name: string) => within(getPanel()).getByRole("link", { name });
const openMenu = () => fireEvent.click(getTrigger());
const isOpen = () => getTrigger().getAttribute("aria-expanded") === "true";

beforeEach(stubBrowserApis);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Navbar", () => {
  it("keeps the mobile popup closed until the burger is pressed", () => {
    renderNavbar();

    expect(isOpen()).toBe(false);
    expect(getTrigger().getAttribute("aria-controls")).toBe("mobile-menu");
    expect(getPanel().className).toContain("invisible");
    expect(getPanel().className).toContain("opacity-0");
  });

  it("opens a compact card holding the five primary links", () => {
    renderNavbar();
    openMenu();

    expect(isOpen()).toBe(true);
    expect(getPanel().className).toContain("visible");
    expect(getPanel().className).not.toContain("invisible");

    const panel = within(getPanel());
    const labels = panel
      .getAllByRole("link")
      .map((link) => link.textContent?.trim());

    // Education lives on the page and in the footer, not in the primary nav.
    expect(panel.queryByRole("link", { name: "Education" })).toBeNull();
    expect(labels.slice(0, 5)).toEqual([
      "About",
      "Skills",
      "Experience",
      "Contact",
      "Projects",
    ]);
  });

  it("closes on Escape and hands focus back to the burger", () => {
    renderNavbar();
    openMenu();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(getTrigger());
  });

  it("closes on an outside press but not on a press inside the card", () => {
    renderNavbar();
    openMenu();

    fireEvent.pointerDown(getMobileLink("About"));
    expect(isOpen()).toBe(true);

    fireEvent.pointerDown(document.body);
    expect(isOpen()).toBe(false);
  });

  it("scrolls to the section and closes when a link is used on the homepage", () => {
    renderNavbar();
    openMenu();

    fireEvent.click(getMobileLink("About"));

    expect(isOpen()).toBe(false);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("navigates home from a project page", () => {
    renderNavbar("/project/portfolio");
    openMenu();

    fireEvent.click(getMobileLink("Skills"));

    expect(screen.getByTestId("location").textContent).toBe("/#skills");
    expect(isOpen()).toBe(false);
  });

  it("marks the section the visitor came from", () => {
    renderNavbar("/#about");

    expect(getMobileLink("About").getAttribute("aria-current")).toBe("location");
    expect(getMobileLink("Skills").getAttribute("aria-current")).toBeNull();
  });

  it("exposes Projects as the only tracked call to action", () => {
    renderNavbar();
    openMenu();

    const cta = getMobileLink("Projects");

    expect(cta.getAttribute("href")).toBe("/#projects");
    expect(cta.getAttribute("data-track")).toBe("nav_cta");
    expect(cta.getAttribute("data-track-label")).toBe("mobile_projects");
    expect(getMobileLink("About").hasAttribute("data-track")).toBe(false);
  });

  it("closes when the viewport grows past the mobile breakpoint", () => {
    renderNavbar();
    openMenu();

    emitViewport(true);

    expect(isOpen()).toBe(false);
  });
});
