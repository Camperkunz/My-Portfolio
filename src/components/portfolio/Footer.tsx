import { Github, Linkedin, ArrowUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { personalInfo } from "@/data/personalInfo";
import {
    navLinks,
    navigateToSection,
    handleLogoClick,
    scrollToTop,
} from "@/components/navigation";
import { Button } from "../ui/button";

export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        navigateToSection(href, location.pathname, navigate);
    };

    return (
        <footer className="border-t border-border/50 py-12">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={(e) => handleLogoClick(e, location, navigate)}
                    className="group"
                    aria-label="Back to home"
                >
                    <img
                        src={personalInfo.logo}
                        alt="Anna Nikiforova — home"
                        width={100}
                        height={100}
                        loading="lazy"
                        decoding="async"
                        className="h-8 w-8 opacity-60 transition-opacity group-hover:opacity-100 logo"
                    />
                </Link>

                {/* Navigation — native anchors keep hrefs crawlable; clicks stay SPA. */}
                <nav aria-label="Footer">
                    <ul className="flex flex-wrap justify-center gap-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={`/${link.href}`}
                                    onClick={(e) => handleClick(e, link.href)}
                                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        {/* The case-study index is a real route, so it belongs in the
                            footer nav (keeps it crawlable from every page). */}
                        <li>
                            <Link
                                to="/projects"
                                className="text-sm text-muted-foreground transition-colors hover:text-accent"
                            >
                                All Projects
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Social */}
                <div className="flex gap-5">
                    <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-muted-foreground transition-colors hover:text-accent"
                    >
                        <Github className="h-6 w-6 md:h-4 md:w-4" />
                    </a>

                    <a
                        href={personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-muted-foreground transition-colors hover:text-accent"
                    >
                        <Linkedin className="h-6 w-6 md:h-4 md:w-4" />
                    </a>
                </div>

                {/* Back to top — sits at the end of the page, where it is needed.
                    It replaced the floating arrow so the bottom-right corner is
                    reserved for the "Let's talk" CTA. */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToTop}
                    data-track="back_to_top"
                >
                    Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </Button>

                {/* Copyright */}
                {/* The year is baked into the prerendered HTML at build time;
                    a build from last year must not fail hydration. */}
                <p className="text-xs text-muted-foreground/60" suppressHydrationWarning>
                    © {new Date().getFullYear()}. Made with love ❤️ by{" "}
                    {personalInfo.name}
                </p>
            </div>
        </footer>
    );
}