// @vitest-environment jsdom
import { execFileSync } from "child_process";
import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../src/App";
import { getSeoRoutes, notFoundRoute } from "../src/lib/seo";

// jsdom implements neither IntersectionObserver nor matchMedia.
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

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
  window.scrollTo = vi.fn();
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const paths = [...getSeoRoutes().map((route) => route.path), notFoundRoute.path];

// Prerenders every page in a separate Node process, the way the build does.
// Running react-dom/server and react-dom/client in this one process would let
// the server renderer's context values leak into hydration.
const PRERENDER_SCRIPT = `
  import { createServer } from "vite";
  import react from "@vitejs/plugin-react-swc";
  const root = process.cwd();
  const server = await createServer({
    configFile: false, root, logLevel: "error", appType: "custom",
    server: { middlewareMode: true, hmr: false },
    plugins: [react()],
    resolve: { alias: { "@": root + "/src" } },
  });
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const out = {};
  for (const path of JSON.parse(process.argv[1])) out[path] = await render(path);
  await server.close();
  process.stdout.write(JSON.stringify(out));
`;

let serverHtml: Record<string, string> = {};
beforeAll(() => {
  const output = execFileSync(
    process.execPath,
    ["--input-type=module", "-e", PRERENDER_SCRIPT, JSON.stringify(paths)],
    { encoding: "utf-8", env: { ...process.env, NODE_ENV: "development" }, maxBuffer: 64 * 1024 * 1024 },
  );
  serverHtml = JSON.parse(output);
}, 60_000);

describe("prerendered HTML", () => {
  it("puts the page content and crawlable links into the HTML", async () => {
    const html = serverHtml["/projects"];

    expect(html).toContain("<h1");
    expect(html).toMatch(/href="\/project\/[^"]+"/);
  });

  it.each(paths)("hydrates %s without mismatches", async (path) => {
    const container = document.createElement("div");
    container.innerHTML = serverHtml[path];
    document.body.appendChild(container);

    const recoverableErrors: unknown[] = [];
    const consoleErrors = vi.spyOn(console, "error").mockImplementation(() => {});

    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(
        container,
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>,
        { onRecoverableError: (error) => recoverableErrors.push(error) },
      );
      // Let lazy route chunks resolve and their Suspense boundaries hydrate.
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(recoverableErrors).toEqual([]);
    expect(consoleErrors).not.toHaveBeenCalled();
    expect(container.querySelector("h1")).not.toBeNull();

    act(() => root?.unmount());
  });
});
