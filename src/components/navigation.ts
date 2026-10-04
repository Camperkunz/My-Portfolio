import type { NavigateFunction } from "react-router-dom";

// h-16 = 4rem = 64px — must match the navbar height in Navbar.tsx
export const NAVBAR_HEIGHT = 64;

export type NavLink = {
    label: string;
    href: string;
    variant?: "cta";
};

// Single source of truth shared by Navbar and Footer.
export const navLinks: NavLink[] = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Get in touch", href: "#contact", variant: "cta" },
];

/**
 * Smoothly scroll to a section, accounting for the fixed navbar.
 * Uses getElementById so any hash is safe (no invalid-selector throws).
 */
export const scrollToSection = (hash: string) => {
    const id = hash.replace(/^#/, "");
    if (!id) return;

    const element = document.getElementById(id);
    if (!element) return;

    const offsetPosition =
        element.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
};

/**
 * Navigate to a section of the homepage from anywhere on the site.
 * - On the homepage: smooth-scroll directly (SPA).
 * - On any other page: client-side navigate home, then Layout scrolls
 *   to the hash once the homepage is mounted.
 */
export const navigateToSection = (
    href: string,
    currentPathname: string,
    navigate: NavigateFunction
) => {
    if (currentPathname !== "/") {
        navigate(`/${href}`);
        return;
    }

    scrollToSection(href);
};
