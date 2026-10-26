import { Project } from "@/types/portfolio";

const loopstudios: Project = {
    id: "loopstudios",
    title: "Loopstudios Landing Page",
    shortDescription:
        "A 1:1 recreation of a VR brand landing page, built with semantic HTML, CSS and vanilla JavaScript.",
    thumbnailImageUrl: "/loop-studios/loopstudios.webp",
    imageUrl: "/loop-studios/loopstudios.webp",
    year: "2025",
    category: "Study",
    sector: "Frontend practice",
    client: "Frontend Mentor challenge",
    platform: "HTML, CSS & JavaScript",
    role: "Front-end development",
    goal: "Match the reference design exactly while keeping the markup semantic, the CSS organised and the layout responsive.",
    brief:
        "A Frontend Mentor challenge built in plain HTML, CSS and JavaScript to test layout precision without dependencies.",
    challenge:
        "The exercise was precision: every spacing, image crop and interaction had to hold up across mobile and desktop.",
    approach: [
        "Flexbox and Grid layouts matched to the reference",
        "Vanilla JavaScript for the mobile navigation",
        "Responsive breakpoints for every section",
    ],
    outcome:
        "A pixel-close, dependency-free page and a stronger grip on layout, responsiveness and clean front-end structure.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "1:1", label: "design-to-code match" },
        { value: "A+", label: "mark for code quality" },
        { value: "Responsive", label: "for all screen sizes" },
    ],
    gallery: [
        {
            src: "/loop-studios/solution.webp",
            alt: "Landing page layout at desktop width",
        },
        {
            src: "/loop-studios/results.webp",
            alt: "Page grid layout for 'creation' section and footer",
        },
    ],
    techStack: ["JavaScript", "HTML", "CSS"],
    githubUrl: "https://github.com/niki0012A/Loopstudios-Website",
    liveUrl: "https://camperkunz.github.io/Loopstudios/",
};

export default loopstudios;
