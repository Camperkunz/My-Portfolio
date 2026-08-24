import { Github, Linkedin } from "lucide-react";
import { personalInfo } from "@/data/personalInfo";


const navLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

export default function Footer() {
    const navLinks_ = [
        { label: "About", href: "/#about" },
        { label: "Experience", href: "/#experience" },
        { label: "Education", href: "/#education" },
        { label: "Skills", href: "/#skills" },
        { label: "Projects", href: "/#projects" },
        { label: "Contact", href: "/#contact" },
    ];

    return (
        <footer className="border-t border-border/50 py-12">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6">
                {/* Logo */}
                <a href="/#" className="group">
                    <img src={personalInfo.logo} alt="Top Navigation Logo" className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity logo" />
                </a>

                {/* Navigation */}
                <ul className="flex flex-wrap justify-center gap-6">
                    {navLinks_.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                className="text-sm text-muted-foreground hover:text-accent transition-colors"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Social */}
                <div className="flex gap-5">
                    <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub"
                        className="text-muted-foreground hover:text-accent transition-colors">
                        <Github className="h-6 w-6 md:h-4 md:w-4" />
                    </a>
                    <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                        className="text-muted-foreground hover:text-accent transition-colors">
                        <Linkedin className="h-6 w-6 md:h-4 md:w-4" />
                    </a>
                </div>

                <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} {personalInfo.name}. Made with love ❤️</p>
            </div>
        </footer>
    );
}