import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRange, type ServicePackage } from "@/data/services";

interface PackageCardProps {
  pkg: ServicePackage;
  onSelect: (packageId: string) => void;
}

/**
 * One package: who it is for, what is included, when it is the best fit and what
 * it can be built on. Only what is included is listed; `PackageComparison`
 * handles side-by-side comparison. The `featured` package gets the accent
 * border, badge and solid button.
 */
export default function PackageCard({ pkg, onSelect }: PackageCardProps) {
  const featured = Boolean(pkg.featured);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 backdrop-blur-md transition-colors",
        featured
          ? "border-accent/20 bg-accent/[0.01] shadow-lg shadow-accent/10"
          : "border-border/50 bg-card/30 hover:border-accent/40",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground">
          Recommended
        </span>
      )}

      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent/80">
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

      {/* Minimum heights keep the rows aligned across columns. */}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:min-h-[7rem]">{pkg.bestFor}</p>

      <div className="mt-5 flex-1 border-t border-border/50 pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What you get</p>
        <ul className="mt-3 grid gap-2 text-sm text-foreground">
          {pkg.includes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {pkg.bestFitIf && (
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground lg:min-h-[6rem]">
          <span className="font-semibold text-foreground">Best fit if: </span>
          {pkg.bestFitIf}
        </p>
      )}

      {pkg.builtOn && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground lg:min-h-[3rem]">
          <span className="font-semibold text-foreground">Can be built on: </span>
          {pkg.builtOn}
        </p>
      )}

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
