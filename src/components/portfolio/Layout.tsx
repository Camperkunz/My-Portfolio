import { ReactNode, useState, useEffect } from "react";
import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Menu, Moon, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    if (location.pathname.includes('/project/')) {
      window.location.href = `/#${href.replace('#', '')}`;
      return;
    }
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 z-40 w-full transition-all duration-300  ${scrolled ? "border-b bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a href="/#" className="font-mono text-sm font-bold tracking-tight text-foreground">
          <img src={personalInfo.logo} alt="Logo" className="h-8 w-8 logo" />
        </a>
        <div className="flex items-center gap-4">
          <ul className="hidden gap-6 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => handleClick(l.href)}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <ul className="mt-8 flex flex-col gap-4">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <button onClick={() => handleClick(l.href)} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-sm text-muted-foreground">
        <div className="flex gap-4">
          <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github className="h-4 w-4 hover:text-accent transition-colors" />
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4 hover:text-accent transition-colors" />
          </a>
          <a href={`mailto:${personalInfo.email}`} aria-label="Email">
            <Mail className="h-4 w-4 hover:text-accent transition-colors" />
          </a>
        </div>
        <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

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
      <main>{children}</main>
      <Footer />
    </div>
  );
}
