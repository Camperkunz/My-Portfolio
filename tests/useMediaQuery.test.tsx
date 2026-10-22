// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMediaQuery } from "../src/hooks/useMediaQuery";

const MOBILE_QUERY = "(max-width: 767px)";

type Listener = (event: MediaQueryListEvent) => void;

/** jsdom does not implement `matchMedia`, so provide a controllable stub. */
const stubMatchMedia = (initialMatches: boolean) => {
  const listeners = new Set<Listener>();

  const mql = {
    media: MOBILE_QUERY,
    matches: initialMatches,
    onchange: null,
    addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
    addListener: (listener: Listener) => listeners.add(listener),
    removeListener: (listener: Listener) => listeners.delete(listener),
    dispatchEvent: () => false,
  };

  const matchMedia = vi.fn(() => mql as unknown as MediaQueryList);
  vi.stubGlobal("matchMedia", matchMedia);

  /** Simulates a viewport change across the breakpoint. */
  const emit = (matches: boolean) => {
    mql.matches = matches;
    act(() => {
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    });
  };

  return { matchMedia, listeners, emit };
};

const Probe = ({ query }: { query: string }) => {
  const matches = useMediaQuery(query);
  return <span data-testid="value">{matches ? "match" : "no-match"}</span>;
};

const value = () => screen.getByTestId("value").textContent;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("returns the matching state on the first render", () => {
    stubMatchMedia(true);

    render(<Probe query={MOBILE_QUERY} />);

    expect(value()).toBe("match");
  });

  it("returns false when the query does not match", () => {
    stubMatchMedia(false);

    render(<Probe query={MOBILE_QUERY} />);

    expect(value()).toBe("no-match");
  });

  it("re-renders when the media query result changes", () => {
    const { emit } = stubMatchMedia(false);

    render(<Probe query={MOBILE_QUERY} />);
    expect(value()).toBe("no-match");

    emit(true);
    expect(value()).toBe("match");

    emit(false);
    expect(value()).toBe("no-match");
  });

  it("removes its change listener on unmount", () => {
    const { listeners } = stubMatchMedia(false);

    const { unmount } = render(<Probe query={MOBILE_QUERY} />);
    expect(listeners.size).toBe(1);

    unmount();
    expect(listeners.size).toBe(0);
  });
});
