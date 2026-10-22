import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query and re-renders when it changes.
 *
 * SSR-safe: returns `false` when `window` is unavailable, so the first client
 * render picks up the real value inside the `useState` initializer.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Re-sync in case the viewport changed between the first render and mount.
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
