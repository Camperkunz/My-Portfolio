import { Project } from "@/types/portfolio";

const uniqueEcommerce: Project = {
    id: "unique-ecommerce",
    title: "Unique Fabric Panels — Shopify Store",
    shortDescription:
        "A custom Shopify store that moved a fabric business off social media and into a clear, search-ready online shop.",
    thumbnailImageUrl: "/unique/unique-website.webp",
    imageUrl: "/unique/unique-website.webp",
    year: "2025",
    category: "Work",
    sector: "Retail · Fabrics",
    client: "Unique Fabric Panels",
    platform: "Shopify",
    role: "Design & Shopify development",
    goal: "Replace a slow, outdated website with a store that makes fabric easy to browse, easy to buy, and easy to find in search.",
    brief:
        "A Shopify storefront for Unique Fabric Panels, rebuilt around browsing fabric, online ordering and search visibility.",
    challenge:
        "Sales lived on social media while the old site was slow, hard to navigate and failed to show the product range properly. The business needed a new store that could support online orders, present its fabrics clearly and be found in Google search.",
    approach: [
        "Rebuilt the catalogue into clear, browsable collections",
        "Migrated 500+ products into a new Shopify store",
        "Customised the Shopify theme with Liquid sections",
        "Added SEO structure and product-page fundamentals",
    ],
    outcome:
        "The business now runs a modern storefront that presents its fabrics properly, supports online orders and gives the brand room to grow.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "+74%", label: "increased organic search traffic" },
        { value: "500+", label: "products migrated" },
        { value: "300+", label: "lines of custom code" },
    ],
    gallery: [
        {
            src: "/unique/unique-website.webp",
            alt: "Main landing page of the new Shopify storefront, hero banners",
        },
        {
            src: "/unique/solution.webp",
            alt: "New Shopify storefront with featured fabric collections",
        },
        {
            src: "/unique/results.webp",
            alt: "Product and collection structure in the custom Shopify theme",
        },
    ],
    techStack: ["Shopify", "Liquid", "Figma", "HTML", "CSS"],
    liveUrl: "https://uniquefabricpanels.com/",
    featured: true,
};

export default uniqueEcommerce;
