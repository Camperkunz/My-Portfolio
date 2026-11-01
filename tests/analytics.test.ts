// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE_URL } from "../src/lib/seo";

const ga = vi.hoisted(() => ({ initialize: vi.fn(), event: vi.fn(), send: vi.fn() }));
vi.mock("react-ga4", () => ({ default: ga }));

const PROD = SITE_URL;
const LOCAL = "http://localhost:8080/";

/** Simulates a fresh page load at `url`: new URL and a new copy of the module. */
const load = async (url: string) => {
  vi.stubGlobal("location", new URL(url));
  vi.resetModules();
  return import("../src/lib/analytics");
};

const flush = () => new Promise((resolve) => setTimeout(resolve));

describe("analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal("requestIdleCallback", (cb: () => void) => {
      cb();
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends nothing from a host other than production", async () => {
    const { track, trackPageview, initAutoTracking } = await load(LOCAL);
    initAutoTracking();
    track("test_event");
    trackPageview("/", () => "Title");
    await flush();

    expect(ga.initialize).not.toHaveBeenCalled();
    expect(ga.event).not.toHaveBeenCalled();
    expect(ga.send).not.toHaveBeenCalled();
  });

  it("sends events and pageviews from the production host", async () => {
    const { track, trackPageview } = await load(PROD);
    track("test_event", { a: 1 });
    trackPageview("/projects", () => "Projects");
    await flush();

    expect(ga.initialize).toHaveBeenCalledTimes(1);
    expect(ga.event).toHaveBeenCalledWith("test_event", { a: 1 });
    expect(ga.send).toHaveBeenCalledWith({ hitType: "pageview", page: "/projects", title: "Projects" });
  });

  it("keeps ?notrack across page loads until ?track reverses it", async () => {
    (await load(`${PROD}/?notrack`)).track("opted_out");
    (await load(PROD)).track("still_opted_out");
    await flush();
    expect(ga.event).not.toHaveBeenCalled();

    (await load(`${PROD}/?track`)).track("opted_in");
    await flush();
    expect(ga.event).toHaveBeenCalledWith("opted_in", {});

    ga.event.mockClear();
    (await load(PROD)).track("stays_opted_in");
    await flush();
    expect(ga.event).toHaveBeenCalledWith("stays_opted_in", {});
  });

  it("reports the failing script as error_source, not the reserved source", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { initAutoTracking } = await load(PROD);
    initAutoTracking();
    window.dispatchEvent(new ErrorEvent("error", { message: "boom", filename: "http://x/chunk.js", lineno: 3 }));
    await flush();

    const call = ga.event.mock.calls.find(([name, params]) => name === "js_error" && params.message === "boom");
    expect(call?.[1]).toMatchObject({ error_source: "http://x/chunk.js" });
    expect(call?.[1]).not.toHaveProperty("source");
  });
});
