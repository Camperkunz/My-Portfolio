import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ProjectPage from "./pages/ProjectPage";
import AllProjectsPage from "./pages/AllProjectsPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/portfolio/animations/ScrollToTop";
import { usePageMeta } from "./hooks/usePageMeta";

// Google Analytics is the single analytics source (loaded once via react-ga4).
// Vercel Analytics is mounted separately inside Layout — both are tiny and async.
ReactGA.initialize("G-5VDQD7BG9X");

// 2. Tracking component — sends pageviews on every SPA route change.
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search + location.hash,
      title: document.title,
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
    <AnalyticsTracker />
    <PageMeta />
    <ScrollToTop />
    <Toaster />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/projects" element={<AllProjectsPage />} />
      <Route path="/project/:id" element={<ProjectPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
