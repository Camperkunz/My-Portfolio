import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // `instant` overrides the global `html { scroll-behavior: smooth }` so a
    // route change jumps straight to the top instead of smooth-scrolling, which
    // otherwise collides with the anchor scrolling handled in Layout.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
