import { Github, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { personalInfo } from "@/data/personalInfo";
import { navigateToSection } from "../navigation.ts";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
];

export default function Footer() {
    const location = useLocation();

    const handleClick = (href: string) => {
        navigateToSection(href, location.pathname);
    };

    return (
        <footer className="border-t border-border/50 py-12">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6">
                {/* Logo */}
                <a href="/#" className="group">
                    <img
                        src={personalInfo.logo}
                        alt="Top Navigation Logo"
                        className="h-8 w-8 opacity-60 transition-opacity group-hover:opacity-100 logo"
                    />
                </a>

                {/* Navigation */}
                <ul className="flex flex-wrap justify-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <button
                                onClick={() => handleClick(link.href)}
                                className="text-sm text-muted-foreground transition-colors hover:text-accent"
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Social */}
                <div className="flex gap-5">
                    <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="text-muted-foreground transition-colors hover:text-accent"
                    >
                        <Github className="h-6 w-6 md:h-4 md:w-4" />
                    </a>

                    <a
                        href={personalInfo.linkedin}
                        target="_blank"
                        rel="noreferrer"
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