import { Check, Minus } from "lucide-react";
import { packageFeatures, type ServicePackage } from "@/data/services";

function FeatureValue({ value }: { value: boolean | string | undefined }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto h-4 w-4 text-accent" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (!value) {
    return (
      <>
        <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-sm font-normal text-foreground">{value}</span>;
}

/** Side-by-side table of what differs; scrolls sideways on narrow screens. */
export default function PackageComparison({ packages }: { packages: ServicePackage[] }) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th scope="col" className="sticky left-0 bg-background py-3 pr-4 md:static md:bg-transparent text-left font-normal">
              <span className="sr-only">Feature</span>
            </th>
            {packages.map((pkg) => (
              <th key={pkg.id} scope="col" className="w-1/5 px-2 py-3 text-center font-semibold text-foreground">
                {pkg.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {packageFeatures.map((feature) => (
            <tr key={feature.label}>
              <th scope="row" className="sticky left-0 bg-background py-3 pr-4 md:static md:bg-transparent text-left font-normal text-muted-foreground">
                {feature.label}
              </th>
              {packages.map((pkg) => (
                <td key={pkg.id} className="px-2 py-3 text-center">
                  <FeatureValue value={feature.values[pkg.id]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
