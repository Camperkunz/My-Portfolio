import { useEffect, useRef, useState, type RefObject } from "react";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as
  | string
  | undefined;
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      appearance?: "always" | "execute" | "interaction-only";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScript: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  turnstileScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("Turnstile failed to initialise."));
    script.onerror = () => {
      turnstileScript = null;
      reject(new Error("Turnstile script failed to load."));
    };
    document.head.appendChild(script);
  });

  return turnstileScript;
}

/**
 * Cloudflare Turnstile widget for a form, shared by the contact form and the
 * project brief.
 *
 * The widget pulls ~1 MB from Cloudflare and runs its own scripts, so it loads
 * only once `triggerRef` (the form) is near the viewport or gets focus,
 * keeping it out of the initial page load (mobile TBT). It renders into
 * `containerRef`, which must stay mounted for the life of the form.
 */
export function useTurnstile(
  triggerRef: RefObject<HTMLElement>,
  containerRef: RefObject<HTMLElement>,
) {
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      console.warn("[contact] VITE_TURNSTILE_SITE_KEY is not configured.");
      return;
    }

    let cancelled = false;
    let requested = false;
    const trigger = triggerRef.current;

    const start = () => {
      if (requested) return;
      requested = true;
      observer?.disconnect();
      trigger?.removeEventListener("focusin", start);

      loadTurnstile()
        .then((turnstile) => {
          if (cancelled || !containerRef.current) return;
          widgetId.current = turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: "dark",
            appearance: "interaction-only",
            callback: setToken,
            "expired-callback": () => setToken(""),
            "error-callback": () => setToken(""),
          });
        })
        .catch((error: unknown) => {
          console.error("[contact]", error);
        });
    };

    const observer = trigger
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) start();
          },
          { rootMargin: "600px 0px" }
        )
      : null;
    if (trigger) {
      observer?.observe(trigger);
      trigger.addEventListener("focusin", start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      trigger?.removeEventListener("focusin", start);
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [triggerRef, containerRef]);

  // Tokens are single-use, so fetch a fresh one for any retry.
  const reset = () => {
    setToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  return { token, reset };
}
