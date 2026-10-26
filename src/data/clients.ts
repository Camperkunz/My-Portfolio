import type { Client } from "@/types/portfolio";

// Clients whose websites are live, shown as a compact logo strip on the home
// page. Order follows the featured projects, so the strip reads as a preview
// of the work below it.
export const clients: Client[] = [
  {
    name: "Unique Fabric Panels",
    logo: "/logos/unique-logo.png",
    url: "https://uniquefabricpanels.com/",
  },
  {
    name: "Diana Voloshina",
    logo: "/logos/diana-voloshina-logo.png",
    url: "https://dianavoloshina.com",
  },
  {
    name: "CICan",
    logo: "/logos/cican-logo.webp",
    url: "https://www.collegesinstitutes.ca/",
  },
  {
    name: "CAOT",
    logo: "/logos/caot-logo.svg",
    url: "https://caot.ca/",
  },
];
