import { ArrowUpRight } from "lucide-react";

/** One "reach me directly" row: shared by the homepage contact section and /services. */

const rowClass =
  "group flex items-center gap-4 rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-md transition-all hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

interface ContactRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export default function ContactRow({ icon: Icon, label, value, href, external = false }: ContactRowProps) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/15">
        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="mt-1 block break-words text-sm font-medium text-foreground">{value}</span>
      </span>
      {external && (
        <ArrowUpRight
          className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-accent"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (!href) {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <a href={href} className={rowClass} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {content}
    </a>
  );
}
