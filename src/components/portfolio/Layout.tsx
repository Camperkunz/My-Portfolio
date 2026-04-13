import { ReactNode, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTopButton from "@/components/portfolio/animations/ScrollToTopButton";
import { useLocation } from "react-router-dom";
// Components
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const navbarHeight = 56; // h-14 = 3.5rem = 56px
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen - text-foreground">
      <Navbar />
      <main>{children}
        <Analytics />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
