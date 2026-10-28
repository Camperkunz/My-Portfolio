import { Suspense, lazy, useEffect } from "react";
import ReactGA from "react-ga4";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ScrollToTop from "./components/portfolio/animations/ScrollToTop";
import { usePageMeta } from "./hooks/usePageMeta";
import { ensureGA, initAutoTracking, observeSections } from "@/lib/analytics";

// Route-level code splitting: ProjectPage and AllProjectsPage (and their
// heavy deps like react-icons/si) load only when those routes are visited.
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const AllProjectsPage = lazy(() => import("./pages/AllProjectsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));


// 2. Tracking component — sends a pageview for every SPA route change once
// the deferred GA initialization above has completed.
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAutoTracking();
  }, []);

  useEffect(() => {
    ensureGA().then(() => {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search + location.hash,
        title: document.title,
      });
    });
    const t = window.setTimeout(observeSections, 500);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return null;
};

// Keeps document.title and meta description in sync with the current route.
const PageMeta = () => {
  usePageMeta();
  return null;
};

// Reserves the viewport while a lazy route chunk loads, so navigating to a
// project page does not flash an empty document (and the footer does not jump).
const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center" aria-busy="true" />
);

/**
 * Everything inside the router. Shared by the browser entry (`main.tsx`, wrapped
 * in BrowserRouter) and the build-time prerender (`entry-server.tsx`, wrapped in
 * StaticRouter), so the static HTML and the hydrated app are the same tree.
 */
export const AppRoutes = () => (
  <>
    {/* PageMeta runs before AnalyticsTracker so document.title is already
        updated when the pageview is sent. */}
    <PageMeta />
    <AnalyticsTracker />
    <ScrollToTop />
    <Toaster />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
