import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/montserrat";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Production HTML is prerendered at build time (see `entry-server.tsx`), so
// hydrate it; the dev server serves an empty root and renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
