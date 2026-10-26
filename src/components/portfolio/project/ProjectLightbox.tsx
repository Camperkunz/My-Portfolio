import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { imageDimensions } from "@/data/imageDimensions";
import type { ProjectMedia } from "@/types/portfolio";

interface ProjectLightboxProps {
  items: ProjectMedia[];
  index: number;
  title: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const controlClass =
  "absolute z-10 rounded-lg bg-black/40 p-2 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/**
 * Accessible image dialog: modal semantics, initial focus on Close, focus
 * trap, Escape/arrow keys, and focus restoration to the thumbnail that
 * opened it. Scroll locking happens in the page that owns the state.
 */
export default function ProjectLightbox({
  items,
  index,
  title,
  onClose,
  onPrev,
  onNext,
}: ProjectLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const getFocusable = useCallback(() => {
    const root = dialogRef.current;
    if (!root) return [] as HTMLElement[];
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      restoreFocusRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [getFocusable, onClose, onNext, onPrev]);

  const media = items[index];
  if (!media) return null;

  const dimensions = imageDimensions[media.src];
  const hasMultiple = items.length > 1;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image gallery`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className={`${controlClass} right-4 top-4 md:right-6 md:top-6`}
      >
        <X className="h-7 w-7" aria-hidden="true" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            className={`${controlClass} left-2 top-1/2 -translate-y-1/2 md:left-6`}
          >
            <ChevronLeft className="h-8 w-8" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className={`${controlClass} right-2 top-1/2 -translate-y-1/2 md:right-6`}
          >
            <ChevronRight className="h-8 w-8" aria-hidden="true" />
          </button>
        </>
      )}

      <figure
        className="flex max-h-[calc(100vh-2rem)] max-w-[90vw] flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={media.src}
          alt={media.alt}
          width={dimensions?.w}
          height={dimensions?.h}
          decoding="async"
          className="max-h-[72vh] w-auto max-w-full select-none rounded-lg object-contain sm:max-h-[80vh]"
        />
        <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm text-white/80">
          <span className="line-clamp-2">{media.alt}</span>
          <span className="shrink-0 tabular-nums" aria-live="polite">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
