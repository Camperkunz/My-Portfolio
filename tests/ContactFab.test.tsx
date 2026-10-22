// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";

import ContactFab from "../src/components/portfolio/ContactFab";

type IOCallback = IntersectionObserverCallback;

let observerCallback: IOCallback | null = null;
let observedTargets: Element[] = [];

// jsdom does not implement IntersectionObserver; the FAB only needs it to know
// when the contact form / footer is on screen, so a minimal stub is enough.
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: number[] = [];

  constructor(callback: IOCallback) {
    observerCallback = callback;
  }

  observe(target: Element) {
    observedTargets.push(target);
  }

  unobserve(target: Element) {
    observedTargets = observedTargets.filter((observed) => observed !== target);
  }

  disconnect() {
    observedTargets = [];
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

const LocationDisplay = () => {
  const { pathname, hash } = useLocation();
  return <span data-testid="location">{`${pathname}${hash}`}</span>;
};

const renderFab = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ContactFab />
      <LocationDisplay />
      <div id="contact" />
      <footer />
    </MemoryRouter>,
  );

const getFab = () => screen.getByRole("link", { name: /contact me/i });

const intersect = (target: Element, isIntersecting: boolean) =>
  act(() => {
    observerCallback?.(
      [{ target, isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

beforeEach(() => {
  observerCallback = null;
  observedTargets = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ContactFab", () => {
  it("renders a crawlable link to the contact section", () => {
    renderFab("/");

    const fab = getFab();
    expect(fab.getAttribute("href")).toBe("/#contact");
    expect(fab.hasAttribute("data-track")).toBe(true);
    expect(fab.className).not.toContain("invisible");
  });

  it("hides while the contact section is on screen and returns afterwards", async () => {
    renderFab("/");

    const contactSection = document.getElementById("contact")!;
    await waitFor(() => expect(observerCallback).not.toBeNull());
    expect(observedTargets).toEqual(expect.arrayContaining([contactSection]));

    intersect(contactSection, true);

    const hiddenFab = getFab();
    expect(hiddenFab.className).toContain("invisible");
    expect(hiddenFab.className).toContain("opacity-0");
    expect(hiddenFab.getAttribute("tabindex")).toBe("-1");

    intersect(contactSection, false);

    const visibleFab = getFab();
    expect(visibleFab.className).toContain("visible");
    expect(visibleFab.getAttribute("tabindex")).toBe("0");
  });

  it("scrolls to the form instead of navigating when clicked on the homepage", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    renderFab("/");

    fireEvent.click(getFab());

    expect(scrollTo).toHaveBeenCalledTimes(1);
    const [{ behavior }] = scrollTo.mock.calls[0] as unknown as [{ behavior: string }];
    expect(behavior).toBe("smooth");
  });

  it("navigates to /#contact from a project page", () => {
    renderFab("/project/portfolio");

    expect(screen.getByTestId("location").textContent).toBe("/project/portfolio");

    fireEvent.click(getFab());

    expect(screen.getByTestId("location").textContent).toBe("/#contact");
  });
});
