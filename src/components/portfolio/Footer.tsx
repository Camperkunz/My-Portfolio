import { Github, Linkedin, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { personalInfo } from "@/data/personalInfo";
import { navLinks, navigateToSection } from "@/components/navigation";

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
                <Link to="/" className="group" aria-label="Back to home">
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

                {/* Copyright */}
                <p className="text-xs text-muted-foreground/60">
                    © {new Date().getFullYear()}. Made with love ❤️ by{" "}
                    {personalInfo.name}
                </p>
            </div>
        </footer>
    );
}