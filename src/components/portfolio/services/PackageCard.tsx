import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRange, type ServicePackage } from "@/data/services";

interface PackageCardProps {
  pkg: ServicePackage;
  onSelect: (packageId: string) => void;
}

/**
 * One package, kept scannable: name, price, timeline, who it fits, what is
 * included, one button. The longer pitch (`bestFor`) shows in the brief's
 * summary once the package is picked, and the platform lives in the comparison
 * table, so four cards side by side don't read as a wall of text. The
 * `featured` package gets the accent border, badge and solid button.
 */
export default function PackageCard({ pkg, onSelect }: PackageCardProps) {
  const featured = Boolean(pkg.featured);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-colors",
        featured
          ? "border-accent/30 bg-accent/[0.03]"
          : "border-border/50 bg-card/30 hover:border-accent/30",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground">
          Recommended
        </span>
      )}

      <span className="truncate font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80">
        {pkg.tagline}
      </span>
      <h3 className="mt-2 font-mono text-xl font-bold tracking-tight text-foreground">{pkg.name}</h3>

      <p className="mt-4 font-mono text-2xl font-bold leading-none text-foreground">
        {formatRange(pkg.price)}
      </p>
      <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {pkg.timeline}
      </span>

      {/* Who it fits: the line a visitor recognises themselves in. The minimum
          height keeps the lists below aligned across the row. */}
      {pkg.bestFitIf && (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground lg:min-h-[8.75rem]">
          {pkg.bestFitIf}
        </p>
      )}

      <ul className="mt-5 grid flex-1 content-start gap-2 border-t border-border/50 pt-5 text-sm text-foreground/90">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={featured ? "accent" : "outline"}
        className="mt-6 w-full gap-2"
        onClick={() => onSelect(pkg.id)}
        data-track="services_package_select"
        data-track-label={pkg.id}
      >
        Start with this
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </article>
  );
}
