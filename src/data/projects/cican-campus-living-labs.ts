import { Project } from "@/types/portfolio";

const cicanCampusLivingLabs: Project = {
    id: "cican-campus-living-labs",
    title: "CICan — Campus Living Labs Report",
    shortDescription:
        "An interactive report that turns eight micro-grant projects into a filterable, bilingual case-study collection.",
    thumbnailImageUrl: "/cican/overview.webp",
    imageUrl: "/cican/overview.webp",
    year: "2026",
    category: "Work",
    sector: "Education",
    client: "CICan / Algonquin College",
    location: "Canada",
    platform: "React + TypeScript",
    role: "UI/UX & front-end development",
    goal: "Turn a static, data-heavy report into something stakeholders can actually explore.",
    brief:
        "A bilingual React report for CICan's fourth cohort, designed to stay readable for colleges, funders and the public.",
    challenge:
        "A dense analytical report had to work for colleges, funders and the public without losing the detail that made it credible. A lot of separate content had to be combined into a single, filterable interface, and the bilingual version had to be easy to maintain.",
    approach: [
        "Custom UI/UX built from scratch around the report content",
        "Sorting and filtering across all eight projects",
        "Full English and French versions",
        "PDF export of the report for offline reading",
    ],
    outcome:
        "The report now ships as a professional, accessible web experience for CICan's fourth cohort, with every project easy to find and compare.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "8+", label: "unique micro-grant projects" },
        { value: "10+", label: "colleges and universities" },
        { value: "Bilingual", label: "languages: English & French" },
    ],
    gallery: [
        {
            src: "/cican/overview.webp",
            alt: "Home page of the report, hero section",
        },
        {
            src: "/cican/problem.webp",
            alt: "Text section describing the problem and context of the report",
        },
        {
            src: "/cican/solution.webp",
            alt: "Card for each project, with filtering and sorting options",
        },
        {
            src: "/cican/results.webp",
            alt: "Footer section",
        },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "AI"],
    liveUrl: "https://humansofimpact.ca/",
    featured: true,
};

export default cicanCampusLivingLabs;
