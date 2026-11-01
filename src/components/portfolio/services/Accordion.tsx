import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  title: string;
  children: ReactNode;
  /** Use "h4" when the row sits under an h3 group label. */
  headingLevel?: "h3" | "h4";
}

/**
 * One expandable row that animates both ways. The height comes from animating
 * `grid-template-rows` (0fr to 1fr), so nothing is measured in JS. Closed content
 * stays in the HTML for the prerendered page, and `invisible` keeps it away from
 * keyboard and screen reader users.
 */
export default function Accordion({ title, children, headingLevel: Heading = "h3" }: AccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <Heading>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 rounded-2xl p-6 text-left font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {title}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </Heading>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
