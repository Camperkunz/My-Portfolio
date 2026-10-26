import { Project } from "@/types/portfolio";

const portfolio: Project = {
    id: "portfolio",
    title: "Personal Portfolio",
    shortDescription:
        "A custom-built portfolio that pairs case studies with a performance- and accessibility-first React stack.",
    thumbnailImageUrl: "/portfolio/portfolio.webp",
    imageUrl: "/portfolio/portfolio.webp",
    year: "2026",
    category: "Personal",
    sector: "Design & engineering",
    client: "Personal project",
    location: "Ottawa, Canada",
    platform: "React + Vite",
    role: "Design, build & content",
    goal: "Build a portfolio that proves the work instead of describing it — fast pages, real case studies and a direct path to contact.",
    brief:
        "A self-directed build: one consistent case-study system, written and coded end to end, with no template to hide behind.",
    challenge:
        "I didn't have a portfolio yet, so I had to build one from scratch while also building the portfolio itself. Templates looked generic and buried the work; the site had to show both design judgement and front-end engineering. ",
    approach: [
        "Case-study structure built around goals and outcomes",
        "Component system on React, TypeScript and Tailwind",
        "Route-level code splitting and per-page SEO",
    ],
    outcome:
        "A single codebase now hosts every case study with per-route metadata, accessible interactions and a clear path to contact.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "Real person", label: "hi :)" },
        { value: "Accessible", label: "WCAG 2.1 AA compliant even with dark colors lol" },
        { value: "SEO", label: "best practices and optimization" },
    ],
    gallery: [
        {
            src: "/portfolio/overview.webp",
            alt: "Case-study listing and site navigation",
        },
        {
            src: "/portfolio/solution.webp",
            alt: "Project page layout and content structure",
        },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Vercel"],
    githubUrl: "https://github.com/Camperkunz/My-Portfolio",
    featured: true,
};

export default portfolio;
