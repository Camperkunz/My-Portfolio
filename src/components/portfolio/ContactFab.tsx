import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigateToSection } from "@/components/navigation";
import { cn } from "@/lib/utils";

/**
 * Persistent "Let's talk" call to action.
 *
 * - Lives in the bottom-right corner on every route (Layout mounts it).
 * - Renders through the shared <Button variant="accent"> so it keeps exactly
 *   the same shape, colours and hover state as every other primary CTA on the
 *   site instead of hand-rolling a second accent style.
 * - Uses a real `/#contact` href so the contact form stays crawlable and the
 *   link works without JS; the click is intercepted to keep the SPA transition
 *   (smooth scroll on the homepage, client-side navigate from other routes).
 * - Hides itself while the contact section or the footer is on screen: the
 *   form's own "Send message" button and the footer's "Back to top" control
 *   need that corner, and a CTA that scrolls to where you already are is noise.
 */
export default function ContactFab() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // A new route means a new page: show the CTA again until proven otherwise.
    setHidden(false);

    if (typeof IntersectionObserver === "undefined") return;

    const observers: IntersectionObserver[] = [];
    let retryTimer: number | undefined;
    let attempts = 0;

    // Entries only report changed targets, so keep the full set to avoid a
    // target that is still on screen being forgotten between callbacks.
    const intersecting = new Set<Element>();

    // Layout (and therefore the contact section / footer) mounts in the same
    // commit as this effect, so the targets are usually there right away. The
    // short retry only covers pages that render them later, and avoids the
    // 150 ms flash of the CTA on top of the footer when landing on /#contact.
    const onEntries = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target);
        else intersecting.delete(entry.target);
      }
      setHidden(intersecting.size > 0);
    };

    const attach = () => {
      const contact = document.getElementById("contact");
      const footer = document.querySelector("footer");

      if (!contact && !footer) {
        if (attempts < 5) {
          attempts += 1;
          retryTimer = window.setTimeout(attach, 150);
        }
        return;
      }

      // The form counts as "on screen" only once it crosses the middle band of
      // the viewport. With a plain edge check the CTA vanished as soon as a
      // sliver of the section peeked in at the bottom and came back when a
      // sliver was left at the top, which read as random flicker.
      if (contact) {
        const observer = new IntersectionObserver(onEntries, {
          rootMargin: "-35% 0px -35% 0px",
        });
        observer.observe(contact);
        observers.push(observer);
      }

      // The footer needs the corner as soon as it arrives (Back to top).
      if (footer) {
        const observer = new IntersectionObserver(onEntries, { threshold: 0 });
        observer.observe(footer);
        observers.push(observer);
      }
    };

    attach();

    return () => {
      window.clearTimeout(retryTimer);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [location.pathname]);

  return (
    <Button
      variant="accent"
      size="default"
      asChild
      className={cn(
        // Only positioning + motion live here: shape, colour and hover come
        // from the shared accent variant, so the CTA stays identical to the
        // hero / contact buttons. `bottom` respects the iOS safe area.
        "fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 gap-2 shadow-lg shadow-accent/25 transition-all duration-200 motion-reduce:transition-none ",
        hidden
          ? "pointer-events-none invisible scale-90 opacity-0"
          : "visible scale-100 opacity-100",
      )}
    >
      <a
        href="/#contact"
        onClick={(event) => {
          event.preventDefault();
          navigateToSection("#contact", location.pathname, navigate);
        }}
        aria-label="Contact me — jump to the contact form"
        tabIndex={hidden ? -1 : 0}
        data-track="contact_fab"
        data-track-label="Let's talk"
      >
        <MessageCircle aria-hidden="true" />
        Let's talk
      </a>
    </Button>
  );
}
