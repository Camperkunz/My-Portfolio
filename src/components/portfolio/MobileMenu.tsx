import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Download, Github, Linkedin, Mail, Menu, X } from "lucide-react";

import { navigateToSection, primaryNavLinks } from "@/components/navigation";
import { personalInfo } from "@/data/personalInfo";
import { cn } from "@/lib/utils";

// Must match the `lg` breakpoint: the trigger is `lg:hidden`, so a popup left
// open while the viewport grows past it has to be dismissed.
const DESKTOP_QUERY = "(min-width: 1024px)";

const RESUME_HREF = "/anna-nikiforova-resume.pdf";

// 44px rows keep every target thumb-sized on a phone.
const rowClassName =
    "group flex h-11 items-center justify-between gap-3 rounded-xl px-3 text-[15px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

const iconClassName =
    "grid size-11 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

type MobileMenuProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

/**
 * Mobile navigation popup.
 *
 * A compact card anchored to the burger rather than a full-height drawer: the
 * page stays visible behind it, nothing is dimmed and scrolling is not locked.
 * This is the disclosure-navigation pattern — a button with `aria-expanded`
 * that reveals the same anchors the desktop bar uses — so no focus trap and no
 * modal semantics are needed.
 *
 * The panel stays mounted and toggles visibility classes, which lets the CSS
 * transition run in both directions (`invisible` keeps the links out of the
 * accessibility tree and the tab order while it is closed).
 */
export default function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Any route or hash change finishes the menu's job.
    useEffect(() => {
        onOpenChange(false);
    }, [location.pathname, location.hash, onOpenChange]);

    // Escape dismisses the panel and hands focus back to the burger, so a
    // keyboard user is never dropped onto <body> when it disappears.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            triggerRef.current?.focus();
            onOpenChange(false);
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    // A tap anywhere outside the card dismisses it.
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: PointerEvent) => {
            if (containerRef.current?.contains(event.target as Node)) return;
            onOpenChange(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open, onOpenChange]);

    // Growing to desktop hides the trigger; closing here means shrinking back
    // does not reveal a popup the visitor never reopened.
    useEffect(() => {
        if (!open) return;

        const query = window.matchMedia(DESKTOP_QUERY);
        const onChange = () => {
            if (query.matches) onOpenChange(false);
        };

        onChange();
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, [open, onOpenChange]);

    const handleNavigate = (event: React.MouseEvent, href: string) => {
        event.preventDefault();
        onOpenChange(false);
        navigateToSection(href, location.pathname, navigate);
    };

    const ctaLink = primaryNavLinks.find((link) => link.variant === "cta");
    const sectionLinks = primaryNavLinks.filter((link) => link.variant !== "cta");

    return (
        <div ref={containerRef} className="relative lg:hidden">
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                data-track="mobile_menu_toggle"
                data-track-label={open ? "close" : "open"}
                onClick={() => onOpenChange(!open)}
                className="-mr-2 grid size-11 place-items-center rounded-lg text-foreground transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                {/* Both icons are rendered and cross-faded, so the swap does not
                    rely on a layout change mid-tap. */}
                <span aria-hidden="true" className="relative block size-6">
                    <Menu
                        className={cn(
                            "absolute inset-0 size-6 transition-all duration-200 motion-reduce:transition-none",
                            open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
                        )}
                    />
                    <X
                        className={cn(
                            "absolute inset-0 size-6 transition-all duration-200 motion-reduce:transition-none",
                            open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
                        )}
                    />
                </span>
            </button>

            <div
                id="mobile-menu"
                className={cn(
                    "absolute right-0 top-[calc(100%_+_0.5rem)] z-50 w-[min(19rem,calc(100vw_-_3rem))] origin-top-right rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none",
                    open
                        ? "visible translate-y-0 scale-100 opacity-100"
                        : "invisible -translate-y-1 scale-95 opacity-0",
                )}
            >
                {/* Hairline top edge — the same quiet highlight the site's cards use. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <ul className="flex flex-col">
                    {sectionLinks.map((link) => {
                        const active = location.hash === link.href;

                        return (
                            <li key={link.href}>
                                <a
                                    href={`/${link.href}`}
                                    onClick={(event) => handleNavigate(event, link.href)}
                                    aria-current={active ? "location" : undefined}
                                    className={cn(rowClassName, active && "text-foreground")}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "size-1.5 rounded-full bg-accent transition-opacity",
                                                active ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                        {link.label}
                                    </span>
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-4 -translate-x-1 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                    />
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {ctaLink && (
                    <>
                        <div aria-hidden="true" className="my-1 h-px bg-border/70" />
                        <a
                            href={`/${ctaLink.href}`}
                            onClick={(event) => handleNavigate(event, ctaLink.href)}
                            data-track="nav_cta"
                            data-track-label={`mobile_${ctaLink.label.toLowerCase()}`}
                            className="group flex h-11 items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 px-3 text-[15px] font-medium text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                        >
                            {ctaLink.label}
                            <ChevronRight
                                aria-hidden="true"
                                className="size-4 transition-transform group-hover:translate-x-0.5"
                            />
                        </a>
                    </>
                )}

                <div aria-hidden="true" className="my-1 h-px bg-border/70" />

                <a
                    href={RESUME_HREF}
                    target="_blank"
                    rel="noopener"
                    data-track="resume_click"
                    data-track-label="mobile_menu"
                    className={rowClassName}
                >
                    <span className="flex items-center gap-2.5">
                        <Download aria-hidden="true" className="size-4 text-muted-foreground" />
                        Resume
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/50">
                        PDF
                    </span>
                </a>

                <div className="mt-1 flex items-center justify-center gap-1 border-t border-border/70 pt-2">
                    <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className={iconClassName}
                    >
                        <Github aria-hidden="true" className="size-4" />
                    </a>
                    <a
                        href={personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className={iconClassName}
                    >
                        <Linkedin aria-hidden="true" className="size-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
