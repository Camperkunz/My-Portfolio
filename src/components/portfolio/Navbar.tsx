import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { personalInfo } from "@/data/portfolio";
import { Menu } from "lucide-react";
// 
const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
    // Projects link different styling
    {
        label: "Projects", href: "#projects",
        className: "rounded-lg border border-accent/30 bg-card/40 backdrop-blur-md px-4 py-2 transition-all hover:shadow-lg hover:shadow-accent/10"
    },
    // 
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 150);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (href: string) => {
        setOpen(false);

        if (location.pathname !== '/') {
            window.location.href = `/${href}`;
            return;
        }

        const element = document.querySelector(href);
        if (element) {
            const navbarHeight = 64;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className={`fixed top-0 z-40 w-full transition-all duration-300  ${scrolled ? "border-b bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <a href="/#" className="font-mono text-sm font-bold tracking-tight text-foreground">
                    <img src={personalInfo.logo} alt="Logo" className="h-10 w-10 md:h-9 md:w-9 logo" />
                </a>
                <div className="flex items-center gap-4">
                    <ul className="hidden gap-6 md:flex items-center">
                        {navLinks.map((l) => (
                            <li key={l.href}>
                                <button
                                    onClick={() => handleClick(l.href)}
                                    className={`${l.className || "text-md text-muted-foreground transition-colors hover:text-accent"}`}
                                >
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger className="md:hidden" aria-label="Open menu">
                            <Menu className="h-8 w-8" />
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <SheetTitle className="sr-only">Navigation</SheetTitle>
                            <ul className="mt-8 flex flex-col gap-4">
                                {navLinks.map((l) => (
                                    <li key={l.href}>
                                        <button onClick={() => handleClick(l.href)} className={`${l.className || "text-md text-muted-foreground transition-colors hover:text-accent"}`}>
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