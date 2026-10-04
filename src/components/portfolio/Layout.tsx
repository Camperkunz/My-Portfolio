import { ReactNode, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTopButton from "@/components/portfolio/animations/ScrollToTopButton";
import { useLocation } from "react-router-dom";
// Components
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import { scrollToSection } from "@/components/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  // When arriving at /#section from another page, scroll to it
  // with the navbar offset (NAVBAR_HEIGHT = 64px).
  useEffect(() => {
    if (!location.hash) return;

    const timer = setTimeout(() => scrollToSection(location.hash), 0);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <main id="main-content">
        {children}
        <Analytics />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
