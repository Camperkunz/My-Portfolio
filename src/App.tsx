import { Suspense, lazy, useEffect } from "react";
import ReactGA from "react-ga4";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ScrollToTop from "./components/portfolio/animations/ScrollToTop";
import { usePageMeta } from "./hooks/usePageMeta";

// Route-level code splitting: ProjectPage and AllProjectsPage (and their
// heavy deps like react-icons/si) load only when those routes are visited.
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const AllProjectsPage = lazy(() => import("./pages/AllProjectsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Google Analytics is the single analytics source (loaded once via react-ga4).
// Vercel Analytics is mounted separately inside Layout — both are tiny.
// Initialization is deferred until the browser is idle so gtag.js never
// competes with the entry bundle for bandwidth or main-thread time during
// page load. `send_page_view: false` disables gtag's automatic initial
// page_view so the landing page is not counted twice (the tracker below
// sends it manually).
let gaReady: Promise<void> | undefined;
const ensureGA = (): Promise<void> => {
  if (!gaReady) {
    gaReady = new Promise((resolve) => {
      const start = () => {
        ReactGA.initialize("G-5VDQD7BG9X", {
          gtagOptions: { send_page_view: false },
        });
        resolve();
      };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(start, { timeout: 5000 });
      } else {
        globalThis.setTimeout(start, 3000);
      }
    });
  }
  return gaReady;
};

// 2. Tracking component — sends a pageview for every SPA route change once
// the deferred GA initialization above has completed.
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ensureGA().then(() => {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search + location.hash,
        title: document.title,
      });
    });
  }, [location]);

  return null;
};

// Keeps document.title and meta description in sync with the current route.
const PageMeta = () => {
  usePageMeta();
  return null;
};

const App = () => (
  <BrowserRouter>
    {/* PageMeta runs before AnalyticsTracker so document.title is already
        updated when the pageview is sent. */}
    <PageMeta />
    <AnalyticsTracker />
    <ScrollToTop />
    <Toaster />
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
