import { Writable } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./App";

/**
 * Build-time prerender of one route (used only by the `seoShellsAndCssInlining`
 * plugin in `vite.config.ts`, never shipped to the browser).
 *
 * Waits for `onAllReady` so lazy route chunks resolve and the HTML contains the
 * full page instead of the Suspense fallback. Crawlers that do not run
 * JavaScript then get the real text and links; `main.tsx` hydrates it.
 */
export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
    });
    sink.on("finish", () => resolve(html));

    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink);
        },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
