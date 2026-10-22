import ReactGA from "react-ga4";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

const GA_ID = "G-5VDQD7BG9X";

let gaReady: Promise<void> | undefined;
export const ensureGA = (): Promise<void> => {
    if (!gaReady) {
        gaReady = new Promise((resolve) => {
            const start = () => {
                ReactGA.initialize(GA_ID, { gtagOptions: { send_page_view: false } });
                resolve();
            };
            if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 5000 });
            else globalThis.setTimeout(start, 3000);
        });
    }
    return gaReady;
};

export const track = (name: string, params: Record<string, unknown> = {}) => {
    ensureGA().then(() => ReactGA.event(name, params));
};

const sent = new Set<string>();
const once = (key: string, name: string, params: Record<string, unknown> = {}) => {
    if (sent.has(key)) return;
    sent.add(key);
    track(name, params);
};

function initClickTracking() {
    document.addEventListener(
        "click",
        (e) => {
            const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-track]");
            if (!el) return;

            const custom = el.closest<HTMLElement>("[data-track]");
            if (custom) {
                track(custom.dataset.track!, {
                    label: custom.dataset.trackLabel ?? custom.textContent?.trim().slice(0, 80),
                    page_path: location.pathname,
                });
            }

            if (!(el instanceof HTMLAnchorElement)) return;
            const href = el.getAttribute("href") ?? "";
            const text = el.textContent?.trim().slice(0, 80) || el.getAttribute("aria-label") || "";

            if (href.startsWith("mailto:")) {
                track("click_email", { link_text: text, page_path: location.pathname });
            } else if (href.startsWith("tel:")) {
                track("click_phone", { link_text: text, page_path: location.pathname });
            } else if (/\.(pdf|docx?|zip)$/i.test(href)) {
                track("file_download", { file_name: href.split("/").pop(), link_text: text, page_path: location.pathname });
            } else if (el.host && el.host !== location.host) {
                let network = "other";
                if (/github\.com/.test(el.host)) network = "github";
                else if (/linkedin\.com/.test(el.host)) network = "linkedin";
                else if (/figma\.com/.test(el.host)) network = "figma";
                track("outbound_click", {
                    link_url: el.href,
                    link_domain: el.host,
                    link_text: text,
                    network,
                    page_path: location.pathname,
                });
            }
        },
        { capture: true },
    );
}

function initScrollDepth() {
    const marks = [25, 50, 75, 90, 100];
    const onScroll = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        if (max <= 0) return;
        const pct = (window.scrollY / max) * 100;
        for (const m of marks) {
            if (pct >= m) once(`scroll:${location.pathname}:${m}`, "scroll_depth", { percent: m, page_path: location.pathname });
        }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
}

export function observeSections() {
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    once(`section:${entry.target.id}`, "section_view", { section: entry.target.id });
                }
            }
        },
        { threshold: 0.4 },
    );
    document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
}

function initEngagementTimers() {
    [15, 30, 60, 120, 300].forEach((sec) => {
        window.setTimeout(() => {
            if (document.visibilityState === "visible") once(`time:${sec}`, "time_on_site", { seconds: sec });
        }, sec * 1000);
    });
}

function initErrorTracking() {
    window.addEventListener("error", (e) =>
        once(`err:${e.message}`, "js_error", {
            message: String(e.message).slice(0, 100),
            source: String(e.filename).slice(-100),
            line: e.lineno,
            page_path: location.pathname,
        }),
    );
    window.addEventListener("unhandledrejection", (e) =>
        once(`rej:${String(e.reason)}`, "js_error", { message: String(e.reason).slice(0, 100), page_path: location.pathname }),
    );
}

function initWebVitals() {
    const send = ({ name, value, id, rating }: { name: string; value: number; id: string; rating: string }) =>
        track("web_vitals", {
            metric_name: name,
            metric_value: Math.round(name === "CLS" ? value * 1000 : value),
            metric_id: id,
            metric_rating: rating,
        });
    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
}

function trackContext() {
    const params = new URLSearchParams(location.search);
    track("visit_context", {
        referrer: document.referrer || "direct",
        utm_source: params.get("utm_source") ?? undefined,
        utm_medium: params.get("utm_medium") ?? undefined,
        utm_campaign: params.get("utm_campaign") ?? undefined,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${innerWidth}x${innerHeight}`,
        language: navigator.language,
        theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
        reduced_motion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        touch: "ontouchstart" in window,
        connection: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType,
    });
}

let started = false;
export function initAutoTracking() {
    if (started) return;
    started = true;
    initClickTracking();
    initScrollDepth();
    initEngagementTimers();
    initErrorTracking();
    initWebVitals();
    trackContext();
}