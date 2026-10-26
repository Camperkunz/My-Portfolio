import { clients } from "@/data/clients";
import { imgSize } from "@/data/imageDimensions";

/**
 * "Trusted by" strip between About and Projects.
 *
 * The heading is deliberately reduced to the small mono kicker used by the other
 * sections, so the block reads as a quiet divider instead of a full section.
 * On phones the four logos sit in a 2x2 grid; from `sm` they become one row.
 *
 * The logos are forced to a white silhouette (`brightness-0 invert`) so that a
 * black monogram, a blue wordmark and a white one all read with the same weight
 * on the dark background. They are kept at full opacity so they stay bright.
 */
export default function ClientsSection() {
  return (
    <section id="clients" className="mx-auto max-w-6xl px-6">
      <h2 className="mb-10 text-center text-xs font-mono uppercase tracking-[0.3em] text-accent/80">
        Clients & partners
      </h2>

      <ul className="grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 md:gap-x-12 lg:gap-x-14">
        {clients.map((client) => {
          // Intrinsic size keeps the aspect ratio while CSS fixes the height,
          // so the strip never shifts layout while the logos load.
          const size = imgSize(client.logo);

          return (
            <li key={client.name}>
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${client.name} website (opens in a new tab)`}
                data-track="client_logo_click"
                data-track-label={client.name}
                className="inline-flex items-center justify-center rounded-md transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={size?.w}
                  height={size?.h}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-auto max-w-full object-contain brightness-0 invert md:h-14"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
