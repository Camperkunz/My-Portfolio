import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The button stays mounted and is shown/hidden with CSS (was framer-motion
  // AnimatePresence), so no animation library is needed in the entry bundle.
  // `invisible` while hidden keeps it out of the tab order and a11y tree, and
  // CSS keeps `visibility: visible` for the whole fade-out (spec behaviour).
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full border border-accent/30 bg-card/60 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-accent-foreground hover:bg-accent transition-all duration-200 shadow-lg cursor-pointer motion-reduce:transition-none ${
        visible
          ? "opacity-100 scale-100 visible"
          : "opacity-0 scale-90 invisible pointer-events-none"
      }`}
    >
      <ArrowUp className="h-7 w-7" />
    </button>
  );
}
