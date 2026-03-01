interface SectionHeaderProps {
  preTitle: string;
  title: string;
}

export default function SectionHeader({ preTitle, title }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-16">
      <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent/70 mb-3">
        {preTitle}
      </span>
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-accent/30" />
        <h2 className="font-mono text-3xl font-bold tracking-tight text-accent sm:text-4xl">
          {title}
        </h2>
        <span className="h-px w-12 bg-accent/30" />
      </div>
    </div>
  );
}
