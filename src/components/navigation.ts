import type { MouseEvent as ReactMouseEvent } from "react";
import type { NavigateFunction } from "react-router-dom";

// h-20 = 5rem = 80px — must match the navbar height in Navbar.tsx
export const NAVBAR_HEIGHT = 80;

export type NavLink = {
    label: string;
    href: string;
    variant?: "cta";
};

// Full section list — shared by the footer, which keeps every anchor (including
// Education) so each section stays one crawlable link away from any page.
export const navLinks: NavLink[] = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
    { label: "Projects", href: "#projects", variant: "cta" }
];

/**
 * Primary navigation: the desktop row in the navbar and the mobile popup.
 *
 * Five items only — Education stays on the page and in the footer, but it was
 * the weakest entry for the recruiters this site is built for, and every extra
 * link makes the header harder to scan.
 *
 * The `cta` item renders last and carries the only accent treatment in the nav
 * ("see the work"). It is intentionally *not* a solid accent button: the solid
 * accent belongs to the persistent Let's talk action (ContactFab), so the two
 * never compete for the same click.
 */
export const primaryNavLinks: NavLink[] = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
    { label: "Projects", href: "#projects", variant: "cta" }
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
 * Smoothly scroll back to the top of the current page.
 * The global `html { scroll-behavior: smooth }` ignores reduced-motion
 * preferences, so the explicit scroll honours them here.
 */
export const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
    });
};

/**
 * Click handler for the site logo, which always leads home.
 * - On any other page the router navigates home as usual.
 * - On the homepage there is nothing to navigate to, so scroll back to the
 *   top instead (dropping any #section hash so active-link state resets).
 */
export const handleLogoClick = (
    e: ReactMouseEvent,
    location: { pathname: string; hash: string },
    navigate: NavigateFunction
) => {
    // Let modifier/middle clicks open a new tab as usual.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (location.pathname !== "/") return;

    e.preventDefault();
    if (location.hash) navigate("/", { replace: true });
    scrollToTop();
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
