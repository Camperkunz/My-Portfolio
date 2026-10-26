import type { ProjectMetric } from "@/types/portfolio";

/**
 * The three headline numbers of a case study.
 *
 * A description list keeps "value + label" as one semantic unit for screen
 * readers; `flex-col-reverse` puts the number above its caption visually
 * without changing the DOM order (label first). In a reversed column the main
 * axis ends at the top, so `justify-end` keeps the pair pinned to the top of
 * the card when the grid stretches it to match a taller sibling.
 */
export default function ProjectMetrics({ metrics }: { metrics: ProjectMetric[] }) {
  return (
    <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex flex-col-reverse justify-end rounded-xl border border-border/60 bg-card/60 p-3 backdrop-blur-sm sm:p-5"
        >
          <dt className="mt-2 text-[11px] leading-snug text-muted-foreground sm:text-sm">
            {metric.label}
          </dt>
          <dd className="break-words text-2xl font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-2xl lg:text-3xl">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
