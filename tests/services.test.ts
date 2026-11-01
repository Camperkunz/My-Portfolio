import { describe, expect, it } from "vitest";
import {
  ECOMMERCE_PRODUCTS,
  MAX_ADDONS,
  SHOP_PRODUCT_LIMITS,
  addonsForPackage,
  carePlans,
  estimateBrief,
  findAddon,
  findPackage,
  formatAddonPrice,
  formatEstimate,
  formatRange,
  packageFeatures,
  serviceAddons,
  serviceImpressions,
  servicePackages,
  serviceTimelines,
} from "../src/data/services";

const standard = { timeline: "standard" };
const websitePackages = servicePackages.filter((entry) => entry.group === "website");

describe("service price list", () => {
  it("uses unique ids within each list", () => {
    for (const list of [servicePackages, serviceAddons, serviceTimelines, serviceImpressions, carePlans]) {
      const ids = list.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("says what every package includes", () => {
    for (const pkg of servicePackages) expect(pkg.includes.length).toBeGreaterThan(0);
  });

  it("keeps package prices positive and ordered", () => {
    for (const pkg of servicePackages) {
      expect(pkg.price.from).toBeGreaterThan(0);
      if (pkg.price.to !== null) expect(pkg.price.from).toBeLessThanOrEqual(pkg.price.to);
    }
  });

  it("gives every card a tagline and says what it can be built on", () => {
    for (const pkg of websitePackages) {
      expect(pkg.tagline).toBeTruthy();
      expect(pkg.builtOn).toBeTruthy();
    }
  });

  it("fills every comparison row for every website package", () => {
    const websiteIds = websitePackages.map((entry) => entry.id);
    for (const feature of packageFeatures) {
      expect(Object.keys(feature.values).sort()).toEqual([...websiteIds].sort());
    }
  });

  it("keeps comparison values short enough to scan", () => {
    for (const feature of packageFeatures) {
      for (const value of Object.values(feature.values)) {
        if (typeof value === "string") expect(value.length).toBeLessThanOrEqual(24);
      }
    }
  });

  it("keeps the page to four package cards", () => {
    expect(websitePackages).toHaveLength(4);
  });

  it("highlights exactly one website package", () => {
    const featured = servicePackages.filter((entry) => entry.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].group).toBe("website");
  });

  it("only prices add-ons for packages that exist", () => {
    for (const addon of serviceAddons) {
      expect(Object.keys(addon.prices).length).toBeGreaterThan(0);
      for (const id of Object.keys(addon.prices)) expect(findPackage(id)).toBeDefined();
    }
  });

  it("allows choosing every add-on of a package at once", () => {
    for (const pkg of servicePackages) {
      expect(addonsForPackage(pkg.id).length).toBeLessThanOrEqual(MAX_ADDONS);
    }
  });

  it("offers a second language on every website package", () => {
    for (const pkg of websitePackages) {
      expect(addonsForPackage(pkg.id).map((addon) => addon.id)).toContain("language");
    }
  });

  it("only lets a package include add-ons it can take", () => {
    for (const pkg of servicePackages) {
      for (const id of pkg.includedOneOf ?? []) {
        expect(findAddon(id)?.prices[pkg.id]).toBeDefined();
      }
    }
  });
});

describe("package boundaries", () => {
  it.each([
    ["landing", "small-business"],
    ["small-business", "business-pro"],
  ])("keeps %s from overlapping %s", (lower, higher) => {
    expect(findPackage(lower)!.price.to).toBeLessThanOrEqual(findPackage(higher)!.price.from);
  });

  it("raises product limits step by step up to E-commerce", () => {
    expect(SHOP_PRODUCT_LIMITS["small-business"]).toBe(15);
    expect(SHOP_PRODUCT_LIMITS["business-pro"]).toBe(30);
    expect(ECOMMERCE_PRODUCTS).toBeGreaterThanOrEqual(SHOP_PRODUCT_LIMITS["business-pro"]);
  });

  it("only builds E-commerce on Shopify", () => {
    expect(findPackage("ecommerce")!.builtOn).toBe("Shopify");
  });
});

describe("add-ons stay inside the package range", () => {
  it.each([
    ["maker with 10 products", "small-business", ["shop"], 1400],
    ["bilingual maker", "small-business", ["shop", "language"], 1700],
    ["tutor on one page", "landing", ["booking"], 500],
    ["bilingual tutor on one page", "landing", ["booking", "language"], 600],
    ["tutor with a few pages", "small-business", ["booking"], 1150],
    ["bilingual café", "small-business", ["language", "menu-qr", "online-ordering"], 1600],
    ["bilingual company with more pages", "business-pro", ["language", "extra-pages", "blog"], 3950],
    ["bilingual store", "ecommerce", ["language", "extra-products"], 2275],
  ])("%s", (_label, packageId, addonIds, min) => {
    const estimate = estimateBrief({ packageId, addonIds, ...standard })!;

    expect(estimate.min).toBe(min);
    expect(estimate.max).toBe(findPackage(packageId)!.price.to);
    expect(estimate.exceedsPackage).toBe(false);
  });
});

describe("estimateBrief", () => {
  it("returns the package range when nothing is added", () => {
    expect(estimateBrief({ packageId: "small-business", addonIds: [], ...standard })).toEqual({
      min: 1000,
      max: 3000,
      exceedsPackage: false,
    });
  });

  it("flags add-ons that outgrow the package instead of raising its range quietly", () => {
    const addonIds = addonsForPackage("ecommerce").map((addon) => addon.id);
    // E-commerce $1,800 + $400 + $200 + $150 + $250 + $75, past the $2,800 top.
    expect(estimateBrief({ packageId: "ecommerce", addonIds, ...standard })).toEqual({
      min: 2875,
      max: 2875,
      exceedsPackage: true,
    });
  });

  it("charges nothing for the one function Business Pro includes", () => {
    const base = { packageId: "business-pro", ...standard };
    expect(estimateBrief({ ...base, addonIds: ["booking"] })!.min).toBe(3000);
    // Booking $150 and payments $200 chosen: the priciest one is the included one.
    expect(estimateBrief({ ...base, addonIds: ["booking", "payments"] })!.min).toBe(3150);
  });

  it("charges 25% more for rush work", () => {
    expect(estimateBrief({ packageId: "small-business", addonIds: [], timeline: "rush" })).toEqual({
      min: 1250,
      max: 3750,
      exceedsPackage: false,
    });
  });

  it("keeps open-ended services open-ended", () => {
    expect(estimateBrief({ packageId: "audit", addonIds: [], ...standard })).toEqual({
      min: 150,
      max: null,
      exceedsPackage: false,
    });
  });

  it("rejects unknown ids, duplicates and add-ons that don't fit the package", () => {
    const base = { packageId: "small-business", addonIds: [] as string[], ...standard };
    expect(estimateBrief({ ...base, packageId: "nope" })).toBeNull();
    expect(estimateBrief({ ...base, timeline: "yesterday" })).toBeNull();
    expect(estimateBrief({ ...base, addonIds: ["nope"] })).toBeNull();
    expect(estimateBrief({ ...base, addonIds: ["blog", "blog"] })).toBeNull();
    expect(estimateBrief({ ...base, addonIds: ["extra-products"] })).toBeNull();
    expect(estimateBrief({ packageId: "audit", addonIds: ["blog"], ...standard })).toBeNull();
  });
});

describe("price formatting", () => {
  it("formats ranges, fixed and open-ended prices", () => {
    expect(formatRange({ from: 800, to: 1200 })).toBe("$800 – $1,200");
    expect(formatRange({ from: 150, to: 150 })).toBe("$150");
    expect(formatRange({ from: 3500, to: null })).toBe("from $3,500");
  });

  it("formats add-on prices for one package or across packages", () => {
    const language = findAddon("language")!;
    expect(formatAddonPrice(language, "small-business")).toBe("+$300");
    expect(formatAddonPrice(language)).toBe("+$100 – $500");
    expect(formatAddonPrice(findAddon("extra-products")!)).toBe("+$75");
  });

  it("formats an estimate with the currency", () => {
    expect(formatEstimate({ min: 1200, max: 2500 })).toBe("$1,200 – $2,500 CAD");
    expect(formatEstimate({ min: 2500, max: 2500 })).toBe("$2,500 CAD");
    expect(formatEstimate({ min: 150, max: null })).toBe("from $150 CAD");
  });
});
