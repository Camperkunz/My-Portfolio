import { ReactNode, useState, useEffect } from "react";
import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail, Menu, Moon, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
      className="h-8 w-8"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <a href="#" className="font-mono text-sm font-bold tracking-tight text-foreground">
          {personalInfo.name}
        </a>

        <div className="flex items-center gap-4">
          {/* Desktop */}
          <ul className="hidden gap-6 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => handleClick(l.href)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <ul className="mt-8 flex flex-col gap-4">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => handleClick(l.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
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
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-sm text-muted-foreground">
        <div className="flex gap-4">
          <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github className="h-4 w-4 hover:text-foreground transition-colors" />
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4 hover:text-foreground transition-colors" />
          </a>
          <a href={`mailto:${personalInfo.email}`} aria-label="Email">
            <Mail className="h-4 w-4 hover:text-foreground transition-colors" />
          </a>
        </div>
        <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-14">{children}</main>
      <Footer />
    </div>
  );
}
