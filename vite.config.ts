import { build, defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pathToFileURL } from "url";
import { promises as fs } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import type { ContactRequest, ContactResponse } from "./api/contact";
import {
  getSeoRoutes,
  notFoundRoute,
  SITE_URL,
  type RouteMeta,
  type SeoRoute,
} from "./src/lib/seo";

/** Escapes a value for use inside an HTML attribute. */
const escapeAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Replaces an existing <meta> tag in the built HTML (appends it if missing). */
function setMetaTag(
  html: string,
  key: string,
  content: string,
  attribute: "name" | "property" = "name",
) {
  const tag = `<meta ${attribute}="${key}" content="${escapeAttr(content)}" />`;
  const pattern = new RegExp(`<meta ${attribute}="${key}"[^>]*>`);
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `  ${tag}\n</head>`);
}

/**
 * Rewrites the shared built HTML into a route-specific shell: title,
 * description, canonical, robots, Open Graph, Twitter and JSON-LD.
 */
function applyRouteMeta(html: string, meta: RouteMeta): string {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
    .replace(
      /<link rel="canonical"[^>]*>/,
      meta.canonical ? `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />` : "",
    );

  out = setMetaTag(out, "description", meta.description);
  out = setMetaTag(out, "robots", meta.robots);

  out = setMetaTag(out, "og:type", meta.ogType, "property");
  out = setMetaTag(out, "og:title", meta.title, "property");
  out = setMetaTag(out, "og:description", meta.description, "property");
  out = setMetaTag(out, "og:url", meta.canonical || `${SITE_URL}/404`, "property");
  out = setMetaTag(out, "og:image", meta.image, "property");
  out = setMetaTag(out, "og:image:alt", meta.imageAlt, "property");
  out = setMetaTag(out, "og:image:width", String(meta.imageWidth), "property");
  out = setMetaTag(out, "og:image:height", String(meta.imageHeight), "property");

  out = setMetaTag(out, "twitter:title", meta.title);
  out = setMetaTag(out, "twitter:description", meta.description);
  out = setMetaTag(out, "twitter:image", meta.image);
  out = setMetaTag(out, "twitter:image:alt", meta.imageAlt);

  const jsonLd = JSON.stringify(meta.jsonLd, null, 2).replace(/<\//g, "<\\/");
  return out.replace(
    /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="route-jsonld">\n${jsonLd}\n  </script>`,
  );
}

/** Builds sitemap.xml from the same route list that gets static shells. */
function buildSitemap(routes: SeoRoute[], lastMods: Map<string, string>): string {
  const urls = routes
    .map(({ path: routePath, meta }) => {
      const loc = meta.canonical || `${SITE_URL}${routePath}`;
      const lastmod = lastMods.get(loc);
      const isProject = routePath.startsWith("/project/");
      const lines = [
        "  <url>",
        `    <loc>${escapeAttr(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeAttr(lastmod)}</lastmod>` : null,
        `    <changefreq>${isProject ? "yearly" : "monthly"}</changefreq>`,
        `    <priority>${routePath === "/" ? "1.0" : routePath === "/projects" ? "0.8" : "0.6"}</priority>`,
        "  </url>",
      ];
      return lines.filter(Boolean).join("\n");
    })
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * Reads <lastmod> values from the sitemap copied out of public/ so regenerating
 * the file adds new routes without resetting the dates of existing pages.
 */
async function readLastModified(distDir: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const xml = await fs.readFile(path.join(distDir, "sitemap.xml"), "utf-8");
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
      map.set(match[1], match[2]);
    }
  } catch {
    // No previous sitemap — the next build will pick the dates up.
  }
  return map;
}

/**
 * Builds `src/entry-server.tsx` as a Node bundle into `dist-ssr/` and loads it
 * so the build can render each route to HTML. Its own minimal config avoids
 * re-running this file's plugins; `close()` deletes the temporary bundle.
 */
async function loadPrerenderer(mode: string) {
  const outDir = path.resolve(__dirname, "dist-ssr");
  await build({
    configFile: false,
    root: __dirname,
    mode,
    logLevel: "error",
    publicDir: false,
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    build: { ssr: "src/entry-server.tsx", outDir, emptyOutDir: true },
  });
  const module = (await import(pathToFileURL(path.join(outDir, "entry-server.js")).href)) as {
    render: (url: string) => Promise<string>;
  };
  return { render: module.render, close: () => fs.rm(outDir, { recursive: true, force: true }) };
}

/** Puts the prerendered app markup into the empty `<div id="root">`. */
const injectAppHtml = (html: string, appHtml: string) =>
  html.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);

/**
 * Post-build optimization + static SEO shells (production builds only):
 *
 * 1. Inlines the emitted entry stylesheet into index.html so first paint no
 *    longer waits on a render-blocking CSS request (Lighthouse
 *    "Render-blocking requests", ~340 ms estimated savings on mobile).
 * 2. Injects <link rel="preload"> for the primary Montserrat woff2 subset so
 *    the brand font downloads alongside the HTML instead of only after the CSS
 *    is parsed. This keeps the hero text from repainting late on first visit
 *    (stabilizes LCP).
 * 3. Writes a static HTML page per route (`dist/projects/index.html`,
 *    `dist/project/<id>/index.html`, `dist/404.html`) with route-specific
 *    title/description/canonical/OG/Twitter/JSON-LD and the route's content
 *    prerendered into `#root` (hydrated by `main.tsx`), plus a fresh
 *    `dist/sitemap.xml`. Crawlers and link-preview bots that do not execute
 *    JavaScript get the real text, links and metadata, unknown URLs return a
 *    real 404, and the canonical no longer points every page at the homepage.
 *
 * Runs in `closeBundle`, after Vite has written dist/, so the hashed asset
 * names are known. Dev server output is untouched (`apply: "build"`).
 */
function seoShellsAndCssInlining(): Plugin {
  let mode = "production";
  return {
    name: "portfolio:seo-shells-and-css",
    apply: "build",
    configResolved(config) {
      mode = config.mode;
    },
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

      // 3. Prerendered pages, 404 page and sitemap. The homepage is
      //    dist/index.html itself, rewritten so its JSON-LD/OG tags come from
      //    the same source as every other route.
      const routes = getSeoRoutes();
      const prerenderer = await loadPrerenderer(mode);

      try {
        for (const route of [...routes, notFoundRoute]) {
          const target =
            route === notFoundRoute
              ? path.join(distDir, "404.html")
              : route.path === "/"
                ? htmlPath
                : path.join(distDir, route.path.replace(/^\//, ""), "index.html");
          const page = injectAppHtml(applyRouteMeta(html, route.meta), await prerenderer.render(route.path));
          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, page);
        }
      } finally {
        await prerenderer.close();
      }

      const lastMods = await readLastModified(distDir);
      await fs.writeFile(path.join(distDir, "sitemap.xml"), buildSitemap(routes, lastMods));
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
  plugins: [react(), devApiBridge(mode), seoShellsAndCssInlining()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));