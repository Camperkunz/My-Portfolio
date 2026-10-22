interface SectionHeaderProps {
  preTitle: string;
  title: string;
  /** Heading level: pages pass "h1", home sections keep the default "h2". */
  as?: "h1" | "h2";
}

export default function SectionHeader({ preTitle, title, as: Heading = "h2" }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-16">
      <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent/80 mb-3">
        {preTitle}
      </span>
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-accent/30" />
        <Heading className="font-mono text-3xl font-bold tracking-tight text-accent sm:text-4xl">
          {title}
        </Heading>
        <span className="h-px w-12 bg-accent/30" />
      </div>
    </div>
  );
}
