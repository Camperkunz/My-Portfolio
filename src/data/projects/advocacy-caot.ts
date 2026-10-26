import { Project } from "@/types/portfolio";

const advocacyCaot: Project = {
    id: "advocacy-caot",
    title: "CAOT — Advocacy Website",
    shortDescription:
        "A new advocacy platform for CAOT — brand direction, prototypes and a custom-coded Squarespace build.",
    thumbnailImageUrl: "/advocacy/advocacy.webp",
    imageUrl: "/advocacy/advocacy.webp",
    year: "2025",
    category: "Work",
    sector: "Non-profit",
    client: "CAOT",
    platform: "Squarespace + custom code",
    role: "Design, prototyping & build",
    goal: "Give CAOT's advocacy work a clear, modern home that explains the mission and makes the issues easy to follow.",
    brief:
        "A Squarespace advocacy site for CAOT, built without a large engineering team and centred on a stronger visual identity.",
    challenge:
        "The organisation needed a dedicated advocacy site with a stronger visual identity and clearer content, without a large engineering team. A deadline was set to launch before 100th anniversary celebrations, and the site had to be bilingual.",
    approach: [
        "New visual direction and page layouts",
        "Interactive prototypes to test structure and flow",
        "Custom-coded Squarespace build",
        "Bilingual content and accessibility built in from the start",
    ],
    outcome:
        "A complete, launch-ready design and site structure that modernises how CAOT presents its advocacy work.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "Accessible", label: "follow WCAG guidelines" },
        { value: "Bilingual", label: "english and french" },
        { value: "Prototyped", label: "from concept to interactive mockups" },
    ],
    gallery: [
        {
            src: "/advocacy/advocacy.webp",
            alt: "Advocacy site overview and navigation",
        },
        {
            src: "/advocacy/solution.webp",
            alt: "Advocacy page layout and visual direction",
        },
        {
            src: "/advocacy/results.webp",
            alt: "Footer and CTA",
        },
    ],
    techStack: ["Squarespace", "Figma", "JavaScript", "HTML", "CSS"],
    liveUrl: "https://www.otactionergo.ca/",
    featured: true,
};

export default advocacyCaot;
