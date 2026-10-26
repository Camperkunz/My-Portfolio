import { Project } from "@/types/portfolio";

const dianaWedding: Project = {
    id: "diana-wedding",
    title: "Diana Voloshina — Wedding Planner",
    shortDescription:
        "A calm, editorial site that lets couples compare packages and send fully qualified enquiries.",
    thumbnailImageUrl: "/diana-wedding/main.webp",
    imageUrl: "/diana-wedding/main.webp",
    year: "2026",
    category: "Freelance",
    sector: "Wedding services",
    client: "Diana Voloshina",
    location: "Ottawa, Canada",
    platform: "Next.js + Sanity",
    role: "Design & full-stack development",
    goal: "Give couples one calm place to understand the service, see real weddings and send an enquiry that arrives already qualified.",
    brief:
        "A Next.js and Sanity site for Diana Voloshina, where the content model had to let a non-developer edit every page.",
    challenge:
        "The brand needed a premium, editorial web presence that explains a personal service clearly and makes enquiry details effortless to collect. Old website was slow, confusing and hard to update, so the new site had to be fast, clear and easy to maintain.",
    approach: [
        "Designed a warm, editorial visual system around real wedding photography",
        "Built a content model in Sanity that lets Diana edit every page without code",
        "Connected an enquiry form with Resend that sends submissions straight to email",
        "Optimized the site for speed, accessibility and SEO with Next.js and Tailwind CSS",
        "Deployed the site on Cloudflare Pages for fast, global delivery",
    ],
    outcome:
        "Couples can now explore the full service, compare packages, browse real weddings and send a complete enquiry — while Diana edits all content in Sanity, without code.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "Dynamic", label: "content management system" },
        { value: "+70 points", label: "in Google Page Speed analytics" },
        { value: "-8 seconds", label: "of load time on mobile" },
    ],
    gallery: [
        {
            src: "/diana-wedding/services.webp",
            alt: "Service packages and the five-step planning process",
        },
        {
            src: "/diana-wedding/portfolio.webp",
            alt: "Gallery of real weddings from the portfolio",
        },
        {
            src: "/diana-wedding/contact.webp",
            alt: "Inquiry form collecting event details",
        },
        {
            src: "/diana-wedding/cta.webp",
            alt: "Call-to-action section on the new wedding planner website",
        }
    ],
    techStack: ["Next.js", "TypeScript", "Sanity", "Tailwind CSS", "Cloudflare"],
    liveUrl: "https://dianavoloshina.com",
    githubUrl: "https://github.com/Camperkunz/Diana-Wedding-Planner",
    featured: true,
};

export default dianaWedding;
