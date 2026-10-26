import type { Project } from "@/types/portfolio";

interface MetaRowProps {
  label: string;
  value: string;
}

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="border-t border-border/60 py-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 text-lg font-medium leading-snug text-foreground">{value}</dd>
    </div>
  );
}

/**
 * Client / sector / platform facts shown next to the project goal.
 * Rendered as a description list so assistive tech keeps label–value pairs.
 * Empty optional fields are dropped instead of leaving blank rows.
 */
export default function ProjectMeta({ project }: { project: Project }) {
  const rows = [
    { label: "Client", value: project.client },
    { label: "Sector", value: project.sector },
    { label: "Location", value: project.location },
    { label: "Timeline", value: project.timeline },
    { label: "Platform", value: project.platform },
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
  ].filter((row): row is MetaRowProps => Boolean(row.value));

  return (
    <dl className="grid grid-cols-2 gap-x-6 sm:gap-x-8 lg:grid-cols-1 lg:gap-x-0">
      {rows.map((row) => (
        <MetaRow key={row.label} label={row.label} value={row.value} />
      ))}
    </dl>
  );
}
