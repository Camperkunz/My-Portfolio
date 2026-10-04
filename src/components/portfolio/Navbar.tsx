import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { personalInfo } from "@/data/personalInfo";
import { navLinks, navigateToSection } from "@/components/navigation";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const ctaClassName =
        "inline-flex shrink-0 whitespace-nowrap items-center justify-center rounded-lg border border-accent/30 bg-card/40 backdrop-blur-md px-5 py-2.5 text-sm font-medium transition-all hover:shadow-lg hover:shadow-accent/10";
    const linkClassName =
        "shrink-0 whitespace-nowrap text-base text-muted-foreground transition-colors hover:text-accent";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 150);

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        setOpen(false);
        navigateToSection(href, location.pathname, navigate);
    };

    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-foreground"
            >
                Skip to content
            </a>
            <nav
                aria-label="Primary"
                className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled
                    ? "border-b bg-background/80 backdrop-blur-lg shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link
                        to="/"
                        className="font-sans text-sm font-bold tracking-tight text-foreground"
                    >
                        <img
                            src={personalInfo.logo}
                            alt="Anna Nikiforova — home"
                            width={100}
                            height={100}
                            loading="eager"
                            decoding="async"
                            className="h-10 w-10 md:h-9 md:w-9 logo"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop navigation — native anchors keep hrefs crawlable; clicks stay SPA. */}
                        <ul className="hidden items-center gap-6 lg:flex">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={`/${link.href}`}
                                        onClick={(e) => handleClick(e, link.href)}
                                        aria-current={
                                            location.hash === link.href ? "true" : undefined
                                        }
                                        className={
                                            link.variant === "cta" ? ctaClassName : linkClassName
                                        }
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile navigation */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger
                                className="lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-8 w-8" />
                            </SheetTrigger>

                            <SheetContent side="right" className="w-64">
                                <SheetTitle className="sr-only">
                                    Navigation
                                </SheetTitle>

                                <ul className="mt-8 flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <li key={link.href}>
                                            <a
                                                href={`/${link.href}`}
                                                onClick={(e) => handleClick(e, link.href)}
                                                aria-current={
                                                    location.hash === link.href ? "true" : undefined
                                                }
                                                className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-accent"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </>
    );
}