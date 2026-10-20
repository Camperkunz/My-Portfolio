import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { promises as fs } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import type { ContactRequest, ContactResponse } from "./api/contact";

/**
 * Post-build HTML optimization (production builds only):
 *
 * 1. Inlines the emitted entry stylesheet into index.html so first paint no
 *    longer waits on a render-blocking CSS request (Lighthouse
 *    "Render-blocking requests", ~340 ms estimated savings on mobile).
 * 2. Injects <link rel="preload"> for the primary Montserrat woff2 subset so
 *    the brand font downloads alongside the HTML instead of only after the CSS
 *    is parsed. This keeps the hero text from repainting late on first visit
 *    (stabilizes LCP).
 *
 * Runs in `closeBundle`, after Vite has written dist/, so the hashed asset
 * names are known. Dev server output is untouched (`apply: "build"`).
 */
function inlineCssAndPreloadFonts(): Plugin {
  return {
    name: "portfolio:inline-css-and-preload-fonts",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const htmlPath = path.join(distDir, "index.html");

      let html: string;
      try {
        html = await fs.readFile(htmlPath, "utf-8");
      } catch {
        // Build wrote no HTML (failed early) — nothing to optimize.
        return;
      }

      // 1. Replace each render-blocking stylesheet <link> with inline <style>.
      const stylesheetLinks = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)];
      const inlinedCssFiles: string[] = [];
      for (const match of stylesheetLinks) {
        const href = match[1];
        const cssFile = path.resolve(distDir, href.replace(/^\//, ""));
        const css = (await fs.readFile(cssFile, "utf-8")).replace(/<\/style/gi, "<\\/style");
        html = html.replace(match[0], `<style>${css}</style>`);
        inlinedCssFiles.push(cssFile);
      }

      // 2. Preload the primary (latin) font subset — the subset every visible
      //    word on the site uses (latin covers ASCII + em dash / curly quotes).
      if (!html.includes('as="font"')) {
        const assetNames = await fs.readdir(path.join(distDir, "assets"));
        const primaryFonts = assetNames.filter((name) => /^montserrat-latin-wght-normal-.*\.woff2$/.test(name));
        const preloadTags = primaryFonts
          .map((name) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${name}">`)
          .join("");
        if (preloadTags) {
          html = html.replace("</head>", `${preloadTags}</head>`);
        }
      }

      await fs.writeFile(htmlPath, html);

      // The inlined stylesheets are no longer referenced — keep the deploy clean.
      await Promise.all(inlinedCssFiles.map((file) => fs.rm(file, { force: true })));
    },
  };
}

/**
 * Dev-only bridge for the Vercel function in api/.
 *
 * `vite dev` has no serverless runtime, so a fetch to /api/contact would fall
 * through to the SPA fallback and the form could never be exercised locally.
 * This middleware loads the real handler through Vite's SSR pipeline (the same
 * code Vercel runs) and adapts Node's req/res to the small surface it uses.
 */
function devApiBridge(mode: string): Plugin {
  return {
    name: "portfolio:dev-api-bridge",
    apply: "serve",
    configureServer(server) {
      // Vite only exposes .env values via import.meta.env; the function, like
      // on Vercel, reads process.env — so mirror them once at startup.
      const env = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use("/api/contact", (req, res, next) => {
        void handleContactRequest(server, req, res).catch(next);
      });
    },
  };
}

async function readJsonBody(req: IncomingMessage): Promise<{ body?: unknown; error?: string }> {
  let raw = "";
  try {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 16_384) return { error: "Request body is too large." };
    }
  } catch {
    return { error: "Could not read the request body." };
  }

  if (!raw) return { body: {} };
  try {
    return { body: JSON.parse(raw) as unknown };
  } catch {
    return { error: "Invalid JSON body." };
  }
}

async function handleContactRequest(
  server: ViteDevServer,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const parsed = await readJsonBody(req);

  if (parsed.error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: parsed.error }));
    return;
  }

  const module = (await server.ssrLoadModule("/api/contact.ts")) as {
    default: (request: ContactRequest, response: ContactResponse) => Promise<void>;
  };

  const response: ContactResponse = {
    status(code) {
      res.statusCode = code;
      return response;
    },
    json(payload) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(payload));
    },
    setHeader(name, value) {
      res.setHeader(name, value);
    },
    end() {
      res.end();
    },
  };

  await module.default(
    { method: req.method, body: parsed.body, headers: req.headers, socket: req.socket },
    response,
  );
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), devApiBridge(mode), inlineCssAndPreloadFonts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));