import { Project } from "@/types/portfolio";

const cicanCampusLivingLabs: Project = {
    id: "cican-campus-living-labs",
    title: "CICan: Campus Living Labs Report",
    shortDescription: "An interactive digital report for collegiate micro-grant projects, featuring dynamic filtering and custom UI/UX design.",
    fullDescription:
        "Developed during my full-time position at Algonquin College, this project serves as a comprehensive digital report for CICan’s Campus Living Labs. It showcases eight distinct micro-grant projects from over 10 Canadian colleges and universities. I was responsible for the entire lifecycle of the project, from the initial UI/UX design to the final deployment, ensuring a seamless way to present complex analytical data.",
    overviewImageUrl: "/cican/cican-overview.jpg", // ← replace with your own screenshot
    year: "2026",
    category: "Web Development & UX Design",
    highlights: [
        "Custom UI/UX design created entirely from scratch",
        "Interactive showcase of 8 detailed college environmental projects",
        "Dynamic sorting and filtering system for efficient data navigation",
        "Full bilingual support with English and French language versions",
        "AI-augmented development workflow using React and TypeScript"
    ],
    problem: "The goal was to transform a static, data-heavy analytical report into an engaging, accessible, and responsive digital experience for educational stakeholders.",
    problemImageUrl: "/cican/cican-problem.jpg", // ← replace
    solution: "I built the application using React and TypeScript with Tailwind CSS for rapid, modern styling. The development leveraged AI tools for efficiency while maintaining high-quality manual code for complex logic, such as the project filtering and the report download features.",
    solutionImageUrl: "/cican/cican-solution.jpg", // ← replace
    results: "The final platform provides a professional and intuitive way to explore the fourth cohort of projects. It successfully bridges the gap between raw data and user-friendly interaction, meeting high standards for both design and web accessibility.",
    resultsImageUrl: "/cican/cican-results.jpg", // ← replace
    techStack: ["React", "TypeScript", "Tailwind CSS", "AI"],
    imageUrl: "/cican/cican-overview.jpg",
    githubUrl: "", // ← add if available
    liveUrl: "https://humansofimpact.ca/",
};

export default cicanCampusLivingLabs;
