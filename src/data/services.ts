/**
 * Freelance packages, add-ons and the price estimate behind the /services page.
 *
 * Single source of truth for prices: the brief on the page shows a live
 * estimate from `estimateBrief`, and `api/contact.ts` recomputes the same
 * estimate on the server (the client never sends a price). Keep this file
 * dependency-free (no React, no `@/` aliases): the serverless function and the
 * build-time SEO code import it directly.
 *
 * Each package has one price range, and add-ons move a client inside it rather
 * than past its top. The client never chooses a platform: `builtOn` is shown for
 * information and the choice is made on the call. Copy describes results for the
 * client, not technology.
 */

export const CURRENCY = "CAD";

/** A price range; `to: null` means open-ended ("from $X"). */
export interface PriceRange {
  from: number;
  to: number | null;
}

export interface ServicePackage {
  id: string;
  name: string;
  /** Short qualifier shown above the name, e.g. "one page, one goal". */
  tagline: string;
  /** "website" packages get a card; "existing" ones only a line and a brief option. */
  group: "website" | "existing";
  /** The result the client gets, in one or two concrete sentences. */
  bestFor: string;
  /** A few words under the name in the brief's package picker. */
  shortFor: string;
  /** Only what is included; shown on the card and in the brief summary. */
  includes: string[];
  /** The one-line reason to pick this package, shown on its card. */
  bestFitIf?: string;
  /** What the site can be made with; information only, never a client's choice. */
  builtOn?: string;
  price: PriceRange;
  timeline: string;
  /** The next package up, suggested when add-ons outgrow this one. */
  nextPackageId?: string;
  /** Add-ons of which the package already includes one, at no charge. */
  includedOneOf?: string[];
  /** The one package highlighted as the default choice. */
  featured?: boolean;
}

/**
 * One comparison row for the package columns. `true` = included, `false` =
 * not included, a string = a short value ("Up to 6", "Add-on").
 */
export interface PackageFeature {
  label: string;
  values: Record<string, boolean | string>;
}

export interface ServiceAddon {
  id: string;
  label: string;
  description: string;
  /** Price per package; a package missing here cannot take the add-on. */
  prices: Record<string, number>;
}

export interface ServiceTimeline {
  id: string;
  label: string;
  description: string;
  /** Applied to the whole estimate (rush work costs more). */
  multiplier: number;
}

export interface ServiceImpression {
  id: string;
  label: string;
}

export interface CarePlan {
  id: string;
  name: string;
  pricePerMonth: number;
  includes: string;
}

/** Products a shop add-on can hold; more than the top limit means E-commerce. */
export const SHOP_PRODUCT_LIMITS: Record<string, number> = {
  "small-business": 15,
  "business-pro": 30,
};

/** Products loaded in the E-commerce package. */
export const ECOMMERCE_PRODUCTS = 30;

export const servicePackages: ServicePackage[] = [
  {
    id: "landing",
    name: "Landing",
    tagline: "single page, quick launch",
    group: "website",
    bestFor: "A clean, one-page website designed to do one thing really well: turn your visitors into bookings, inquiries, or leads.",
    shortFor: "One page, one goal",
    includes: [
      "1 custom-designed page",
      "Contact or lead inquiry form",
      "Easy text and picture updates on request",
      "Basic SEO setup"
    ],
    bestFitIf: "You’re launching a new service, running an event, or just need a simple, reliable page where local customers can reach you.",
    builtOn: "Wix, Squarespace or custom code",
    price: { from: 400, to: 800 },
    timeline: "~1–2 weeks",
    nextPackageId: "small-business",
  },
  {
    id: "small-business",
    name: "Small Business",
    tagline: "all you need to start",
    group: "website",
    bestFor: "Everything your business needs to show up professionally online, showcase your services, and make it easy for customers to get in touch.",
    shortFor: "A few pages about your business",
    includes: [
      "Up to 6 pages",
      "Individual visual design for your brand",
      "Easy dashboard to update your own text and photos anytime",
      "Contact & inquiry form",
      "Advanced SEO setup for Google search",
      "Google Maps & local business profile integration",
      `Option to sell up to ${SHOP_PRODUCT_LIMITS["small-business"]} products with the shop add-on`,
    ],
    bestFitIf: "You run a local salon, studio, tutoring practice, or service business and need a clear multi-page site that builds trust.",
    builtOn: "Wix, Squarespace, WordPress or custom code",
    price: { from: 1000, to: 2500 },
    timeline: "~2–6 weeks",
    nextPackageId: "business-pro",
    featured: true,
  },
  {
    id: "business-pro",
    name: "Business Pro",
    tagline: "full-featured website",
    group: "website",
    bestFor: "A unique, high-converting website built to fit your entire line of services, stand out from competitors, and handle business tasks automatically.",
    shortFor: "A bigger site with its own design",
    includes: [
      "Up to 12 pages",
      "Fully custom design built around your goal",
      "Easy text and photo editor",
      "Advanced SEO setup for Google search",
      "1 feature included for free: Online Booking, Ordering, or Payments",
      `Option to sell up to ${SHOP_PRODUCT_LIMITS["business-pro"]} products with the shop add-on`,
    ],
    bestFitIf: "You have a growing business with multiple services, want a distinct custom look, and need features like appointments or payments built right in.",
    builtOn: "Wix, Squarespace, WordPress or custom code",
    price: { from: 2600, to: 4500 },
    timeline: "~4–10 weeks",
    includedOneOf: ["booking", "online-ordering", "payments"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    tagline: "sell products 24/7",
    group: "website",
    bestFor: "A complete online store optimized for sales, built on Shopify so you can easily manage products, accept payments, and fulfill orders.",
    shortFor: `Selling online, ${ECOMMERCE_PRODUCTS}+ products`,
    includes: [
      "Full storefront + essential pages",
      "Store design matched to your brand",
      "Advanced SEO setup for Google search",
      `${ECOMMERCE_PRODUCTS} products set up and loaded for you (add unlimited products yourself)`,
      "Shopping cart and secure online checkout",
      "Simple dashboard to manage products, inventory, and orders",
    ],
    bestFitIf: `Your main goal is selling products online directly to customers with a smooth and fast checkout, and you have more than ${SHOP_PRODUCT_LIMITS["business-pro"]} products to sell. `,
    builtOn: "Shopify + custom code",
    price: { from: 1500, to: 2500 },
    timeline: "~4–6 weeks",
  },
  {
    id: "audit",
    name: "Website Audit",
    tagline: "health check",
    group: "existing",
    bestFor: "A clear, plain-English report explaining what is slowing your current website down and why it might not be bringing in clients.",
    shortFor: "Find out what's holding your site back",
    includes: [
      "Easy-to-read PDF review report",
      "30-minute video call to walk through the findings",
      "Speed, mobile usability, search (SEO), and accessibility check",
      "Action steps for fixing issues yourself or hiring help",
    ],
    price: { from: 150, to: null },
    timeline: "3–5 business days",
  },
  {
    id: "quick-fix",
    name: "Quick Fix",
    tagline: "fast technical boost",
    group: "existing",
    bestFor: "Hands-on technical improvements to make your current site faster, easier to use on phones, and more visible on Google—without starting from scratch.",
    shortFor: "Fix problems without a rebuild",
    includes: [
      "Fixes for all issues identified in the Audit",
      "Mobile usability and layout adjustments",
      "Search visibility fixes",
      "Page speed and performance tuning",
      "Basic search visibility (SEO) setup",
      "30-minute walkthrough call to review the results"
    ],
    price: { from: 400, to: 800 },
    timeline: "1–2 weeks",
  },
];

const websitePackages = servicePackages.filter((entry) => entry.group === "website");

/** A comparison row filled from the package data itself. */
const rowFrom = (read: (pkg: ServicePackage) => string): Record<string, string> =>
  Object.fromEntries(websitePackages.map((pkg) => [pkg.id, read(pkg)]));

/**
 * The comparison table under the cards. Values stay short enough to scan
 * across a row; the details live on the cards.
 */
export const packageFeatures: PackageFeature[] = [
  { label: "Price", values: rowFrom((pkg) => formatRange(pkg.price)) },
  { label: "Pages", values: { landing: "1", "small-business": "Up to 6", "business-pro": "Up to 12", ecommerce: "Store + key pages" } },
  { label: "Products", values: { landing: false, "small-business": `${SHOP_PRODUCT_LIMITS["small-business"]} (add-on)`, "business-pro": `${SHOP_PRODUCT_LIMITS["business-pro"]} (add-on)`, ecommerce: `${ECOMMERCE_PRODUCTS}+` } },
  { label: "Design", values: { landing: "Simple", "small-business": "Brand-matched", "business-pro": "Custom", ecommerce: "Brand-matched" } },
  { label: "Edit content yourself", values: { landing: "On a builder", "small-business": true, "business-pro": true, ecommerce: true } },
  { label: "Booking, ordering, payments", values: { landing: "Add-on (Booking)", "small-business": "Add-on (All)", "business-pro": "1 included (Any)", ecommerce: "Payments Included" } },
  { label: "SEO", values: { landing: "Basic", "small-business": "Advanced", "business-pro": "Advanced", ecommerce: "Advanced" } },
  { label: "Best for", values: { landing: "New service or event", "small-business": "Local service business", "business-pro": "Growing business", ecommerce: "Online stores" } },
];

export const serviceAddons: ServiceAddon[] = [
  {
    id: "extra-pages",
    label: "3 more pages",
    description: "Room for three more pages beyond the package limit.",
    prices: { "small-business": 200, "business-pro": 200, ecommerce: 200 },
  },
  {
    id: "menu-qr",
    label: "Digital menu with QR code",
    description: "A menu you can update and a print-ready QR code for your tables. Prices change without reprinting.",
    prices: { "small-business": 150, "business-pro": 150 },
  },
  {
    id: "booking",
    label: "Online booking",
    description: "Clients book appointments, classes, tables or rooms from your site. Any booking service fees are paid separately.",
    prices: { landing: 150, "small-business": 150, "business-pro": 150 },
  },
  {
    id: "online-ordering",
    label: "Online ordering",
    description: "Customers order for pickup or delivery from your site. Ordering service fees are paid separately.",
    prices: { "small-business": 200, "business-pro": 200 },
  },
  {
    id: "payments",
    label: "Payments and deposits",
    description: "Take payments or deposits online without a full shop. Payment fees are paid separately.",
    prices: { "small-business": 200, "business-pro": 200 },
  },
  {
    id: "shop",
    label: "Online shop",
    description: `Cart and payments for up to ${SHOP_PRODUCT_LIMITS["small-business"]} products on Small Business or ${SHOP_PRODUCT_LIMITS["business-pro"]} on Business Pro. Store plan and payment fees are paid separately.`,
    prices: { "small-business": 400, "business-pro": 600 },
  },
  {
    id: "blog",
    label: "Blog or news",
    description: "Share news and articles yourself, whenever you like.",
    prices: { "small-business": 150, "business-pro": 150, ecommerce: 150 },
  },
  {
    id: "extra-products",
    label: "25 more products loaded",
    description: `I load 25 more products beyond the ${ECOMMERCE_PRODUCTS} included.`,
    prices: { ecommerce: 125 },
  },
];

/** Upper bound on add-ons per brief (the server rejects anything above it). */
export const MAX_ADDONS = serviceAddons.length;

export const serviceTimelines: ServiceTimeline[] = [
  { id: "flexible", label: "Flexible", description: "No fixed deadline.", multiplier: 1 },
  { id: "standard", label: "Standard", description: "The usual timeline for the package.", multiplier: 1 },
  { id: "rush", label: "Rush", description: "Shorter timeline, +25%.", multiplier: 1.25 },
];

/** Answers to "what impression should the site make?" in the brief. */
export const serviceImpressions: ServiceImpression[] = [
  { id: "minimal", label: "Minimal & clean" },
  { id: "premium", label: "Premium & high-end" },
  { id: "warm", label: "Warm & friendly" },
  { id: "bold", label: "Bold & energetic" },
  { id: "playful", label: "Playful (for kids & families)" },
  { id: "unsure", label: "Not sure yet" },
];

export const carePlans: CarePlan[] = [
  { id: "care-basic", name: "Care Basic", pricePerMonth: 50, includes: "Updates, backups, 30 min of edits" },
  { id: "care-standard", name: "Care Standard", pricePerMonth: 100, includes: "1.5 h of edits + monthly report" },
  { id: "care-growth", name: "Care Growth", pricePerMonth: 200, includes: "4 h of edits + priority response" },
];

/** Hourly rate for edits and small features outside a package or care plan. */
export const HOURLY_RATE = 45;

export interface BriefSelection {
  packageId: string;
  addonIds: string[];
  timeline: string;
}

export interface Estimate {
  min: number;
  /** null when the package is open-ended ("from $X"). */
  max: number | null;
  /** True when the add-ons alone pass the top of the package's range. */
  exceedsPackage: boolean;
}

const roundTo25 = (value: number) => Math.round(value / 25) * 25;

const hasPrice = (addon: ServiceAddon, packageId: string) =>
  Object.prototype.hasOwnProperty.call(addon.prices, packageId);

export const findPackage = (id: string) => servicePackages.find((entry) => entry.id === id);
export const findAddon = (id: string) => serviceAddons.find((entry) => entry.id === id);
export const findTimeline = (id: string) => serviceTimelines.find((entry) => entry.id === id);
export const findImpression = (id: string) => serviceImpressions.find((entry) => entry.id === id);

export const addonsForPackage = (packageId: string) =>
  serviceAddons.filter((addon) => hasPrice(addon, packageId));

/**
 * Rough price range for a brief, or null if the selection is invalid: an
 * unknown id, a duplicate add-on, or an add-on that does not apply to the
 * package. Invalid selections are rejected rather than skipped, so the server
 * never emails an estimate for something the page cannot show.
 *
 * Add-ons raise the bottom of the range and leave its top alone. Only when they
 * pass the top does the estimate become that sum, flagged as `exceedsPackage`
 * so the page can suggest a bigger package. Rush applies to the result.
 */
export function estimateBrief({ packageId, addonIds, timeline }: BriefSelection): Estimate | null {
  const base = findPackage(packageId);
  const pace = findTimeline(timeline);
  if (!base || !pace) return null;
  if (addonIds.length > MAX_ADDONS || new Set(addonIds).size !== addonIds.length) return null;

  const range = base.price;

  let addonTotal = 0;
  for (const id of addonIds) {
    const addon = findAddon(id);
    if (!addon || !hasPrice(addon, packageId)) return null;
    addonTotal += addon.prices[packageId];
  }

  // The package already pays for one of these: the priciest chosen goes free.
  const includedPrices = addonIds
    .filter((id) => base.includedOneOf?.includes(id))
    .map((id) => findAddon(id)!.prices[packageId]);
  if (includedPrices.length > 0) addonTotal -= Math.max(...includedPrices);

  const min = range.from + addonTotal;
  const exceedsPackage = range.to !== null && min > range.to;
  const max = range.to === null ? null : Math.max(range.to, min);

  return {
    min: roundTo25(min * pace.multiplier),
    max: max === null ? null : roundTo25(max * pace.multiplier),
    exceedsPackage,
  };
}

/** "$1,200" — fixed locale so the server and the prerendered HTML agree. */
export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** "$800 – $1,200", "$150" or "from $3,500" (no currency). */
export function formatRange({ from, to }: PriceRange): string {
  if (to === null) return `from ${formatPrice(from)}`;
  if (to === from) return formatPrice(from);
  return `${formatPrice(from)} – ${formatPrice(to)}`;
}

/** "+$300" for a package, or the span across packages when none is given. */
export function formatAddonPrice(addon: ServiceAddon, packageId?: string): string {
  if (packageId !== undefined && hasPrice(addon, packageId)) {
    return `+${formatPrice(addon.prices[packageId])}`;
  }
  const prices = Object.values(addon.prices);
  return `+${formatRange({ from: Math.min(...prices), to: Math.max(...prices) })}`;
}

export function formatEstimate({ min, max }: Pick<Estimate, "min" | "max">): string {
  return `${formatRange({ from: min, to: max })} ${CURRENCY}`;
}
