// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CodeToButton from "../src/components/portfolio/animations/CodeToButton";

// Mirrors the constants inside the component: 31 characters typed at 50ms, then
// 700ms pause + 500ms transform + 400ms exit before the button mounts.
const FULL_TIMELINE = 31 * 50 + 700 + 500 + 400 + 1_000;

type IOCallback = IntersectionObserverCallback;

let observerCallback: IOCallback | null = null;
let observedTargets: Element[] = [];

/** jsdom has no IntersectionObserver; the component only needs the first hit. */
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

/** Sizing ghost: the invisible span that keeps the CTA row's footprint fixed. */
const getGhost = (container: HTMLElement) => container.querySelector("span.invisible");

const startAnimation = () => {
  act(() => {
    observerCallback?.(
      [{ target: observedTargets[0], isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
};

beforeEach(() => {
  observerCallback = null;
  observedTargets = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("CodeToButton", () => {
  it("reserves the full code footprint before the animation starts", () => {
    const { container } = render(<CodeToButton onNavigate={vi.fn()} />);

    const ghost = getGhost(container);
    expect(ghost).not.toBeNull();
    // The trailing cursor is part of the reserved footprint too.
    expect(ghost?.textContent).toBe("<Button> View Projects </Button>|");
    expect(ghost?.getAttribute("aria-hidden")).toBe("true");

    // The ghost is what sizes the box on mobile, so it must never wrap.
    expect(ghost?.className).toContain("whitespace-nowrap");

    // From `sm` up the CTA row never wraps, so the ghost is dropped and the
    // button keeps its natural width instead of sitting in a code-sized box.
    expect(ghost?.className).toContain("sm:hidden");
  });

  it("keeps the reserved footprint after the button replaces the code", () => {
    vi.useFakeTimers();
    const { container } = render(<CodeToButton onNavigate={vi.fn()} />);

    startAnimation();
    act(() => {
      vi.advanceTimersByTime(FULL_TIMELINE);
    });

    const button = screen.getByRole("button", { name: "View Projects" });
    expect(button.className).toContain("col-start-1");

    // The ghost stays mounted for the component's whole lifetime; removing it
    // when the button appears would resize the row and shift the hero.
    const ghost = getGhost(container);
    expect(ghost).not.toBeNull();
    expect(ghost?.textContent).toBe("<Button> View Projects </Button>|");
  });

  it("types the code only once it is on screen and then calls onNavigate", () => {
    vi.useFakeTimers();
    const onNavigate = vi.fn();
    const { container } = render(<CodeToButton onNavigate={onNavigate} />);

    expect(observerCallback).not.toBeNull();
    expect(observedTargets).toHaveLength(1);

    const typedCode = () => container.querySelector("span[aria-hidden='true']:not(.invisible)");

    // Before the observer fires only the cursor is rendered — no characters.
    expect(typedCode()?.textContent).toBe("|");

    startAnimation();
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(typedCode()?.textContent?.startsWith("<")).toBe(true);

    act(() => {
      vi.advanceTimersByTime(FULL_TIMELINE);
    });

    const button = screen.getByRole("button", { name: "View Projects" });
    fireEvent.click(button);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
