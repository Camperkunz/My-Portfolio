import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";
import { personalInfo } from "@/data/personalInfo";
import { primaryNavLinks, navigateToSection, handleLogoClick } from "@/components/navigation";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Accent-tinted rather than solid accent: the solid red belongs to the
    // persistent "Let's talk" action (ContactFab), so the nav CTA stays the
    // second-strongest element instead of competing with it.
    const ctaClassName =
        "inline-flex shrink-0 whitespace-nowrap items-center justify-center rounded-lg border border-accent/30 bg-card/40 backdrop-blur-md px-5 py-2 text-base font-medium transition-all hover:shadow-lg hover:shadow-accent/10";
    const linkClassName =
        "shrink-0 whitespace-nowrap text-base transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 150);

        // Landing on /#contact from another page mounts the navbar already
        // scrolled, so read the position once instead of waiting for a scroll.
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        navigateToSection(href, location.pathname, navigate);
    };

    const isActive = (href: string) => location.hash === href;

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
                className={cn(
                    "fixed top-0 z-40 w-full transition-all duration-300",
                    // An open popup needs an opaque bar behind it, otherwise the
                    // card floats over hero copy with nothing separating them.
                    scrolled || menuOpen
                        ? "border-b bg-background/80 backdrop-blur-lg shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
                    <Link
                        to="/"
                        onClick={(e) => handleLogoClick(e, location, navigate)}
                        className="shrink-0 font-sans text-sm font-bold tracking-tight text-foreground"
                    >
                        <img
                            src={personalInfo.logo}
                            alt="Anna Nikiforova — home"
                            width={100}
                            height={100}
                            loading="eager"
                            decoding="async"
                            className="h-10 w-10 md:h-9 md:w-9"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop navigation — native anchors keep hrefs crawlable; clicks stay SPA. */}
                        <ul className="hidden items-center gap-6 lg:flex">
                            {primaryNavLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={`/${link.href}`}
                                        onClick={(e) => handleClick(e, link.href)}
                                        aria-current={isActive(link.href) ? "location" : undefined}
                                        data-track={link.variant === "cta" ? "nav_cta" : undefined}
                                        data-track-label={link.variant === "cta" ? link.label : undefined}
                                        className={cn(
                                            link.variant === "cta" ? ctaClassName : linkClassName,
                                            link.variant !== "cta" &&
                                            (isActive(link.href) ? "text-foreground" : "text-muted-foreground")
                                        )}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Social links — desktop only: on mobile they live in the
                            popup, so the bar keeps just the logo and the burger. */}
                        <div className="hidden items-center gap-3 lg:flex">
                            <a
                                href={personalInfo.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="text-muted-foreground transition-colors hover:text-accent"
                            >
                                <Github className="size-5 md:size-4" />
                            </a>
                            <a
                                href={personalInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-muted-foreground transition-colors hover:text-accent"
                            >
                                <Linkedin className="size-5 md:size-4" />
                            </a>
                        </div>

                        {/* Mobile navigation — a compact card anchored to the burger. */}
                        <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
                    </div>
                </div>
            </nav>
        </>
    );
}