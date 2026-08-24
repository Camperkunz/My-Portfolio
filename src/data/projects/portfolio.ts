import { Project } from "@/types/portfolio";

const portfolio: Project = {
    id: "portfolio",
    title: "Portfolio Website",
    shortDescription: "A personal portfolio website built with React and Tailwind CSS to showcase my projects, skills, and approach to frontend development.",
    fullDescription:
        "This portfolio website is my first full project after graduation and represents a combination of manual development and AI-assisted workflows. The goal was to create a clean, modern space where I could present my work and demonstrate my frontend development skills. The project allowed me to experiment with React, components, layouts, and animation while translating my own ideas into a working product.",
    overviewImageUrl: "/portfolio/portfolio-overview.jpg", // ← replace with your own screenshot
    year: "2026",
    category: "Personal Project",
    highlights: [
        "Designed and developed a custom portfolio from scratch",
        "Fully responsive layout optimized for desktop, tablet, and mobile",
        "Reusable component-based architecture",
        "Smooth UI interactions and modern visual design",
        "AI-assisted workflow combined with manual development",
    ],
    problem: "As a junior frontend developer, I needed a professional way to present my projects, skills, and development approach to potential employers. Existing portfolio templates felt generic and did not reflect my personal style or the combination of creativity and coding that defines my work",
    problemImageUrl: "/portfolio/portfolio-problem.jpg", // ← replace with your own screenshot
    solution: "I designed and developed a custom portfolio website from scratch using React and Tailwind CSS. The focus was on simplicity, readability, and a clean visual structure that highlights projects while keeping navigation intuitive.",
    solutionImageUrl: "/portfolio/portfolio-solution.jpg", // ← replace with your own screenshot
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vercel", "AI"],
    imageUrl: "/portfolio/portfolio.jpg",
    githubUrl: "https://github.com/Camperkunz/My-Portfolio",
    liveUrl: "/",
};

export default portfolio;
