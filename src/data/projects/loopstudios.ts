import { Project } from "@/types/portfolio";

const loopstudios: Project = {
    id: "loopstudios",
    title: "Loopstudios Landing Page",
    shortDescription: "A fully responsive landing page for a VR company built as part of a Frontend Mentor challenge, focusing on clean code.",
    fullDescription:
        "This project is a responsive landing page built as part of a Frontend Mentor challenge. The goal was to recreate a provided design as accurately as possible while maintaining clean, semantic code and responsive behavior across different screen sizes. All HTML, CSS, and JavaScript were written from scratch based on the design reference.The project focused on translating a static design into a functional webpage.",
    thumbnailImageUrl: "/loop-studios/loopstudios.jpg", // ← this is the small thumbnail image for the project, used in the projects section
    imageUrl: "/loop-studios/loopstudios.jpg", // ← this is the main image for the project, hero image on the project page
    overviewImageUrl: "/loop-studios/loopstudios.jpg", // ← inside the component, first
    year: "2025",
    category: "Frontend Development",
    highlights: [
        "Pixel-accurate recreation of the original design",
        "Fully responsive layout for mobile and desktop",
        "Interactive UI elements built with vanilla JavaScript",
        "Clean, semantic HTML structure and well-organized CSS"
    ],
    problem: "The challenge was to accurately translate a static design into a responsive webpage while keeping the code clean, semantic, and maintainable.",
    problemImageUrl: "/loop-studios/problem.jpg", // ← replace
    solution: "I built the page using HTML, CSS, and vanilla JavaScript, implementing the layout with Flexbox and Grid and carefully matching the provided design. Responsive breakpoints were added to ensure the layout works smoothly across mobile and desktop devices.",
    solutionImageUrl: "/loop-studios/solution.jpg", // ← replace
    results: "The final result closely matches the original design while maintaining clean, structured code and responsive behavior. The project helped strengthen my skills in layout implementation, responsive design, and writing organized frontend code.",
    resultsImageUrl: "/loop-studios/results.jpg", // ← replace
    techStack: ["JavaScript", "HTML", "CSS"],
    githubUrl: "https://github.com/niki0012A/Loopstudios-Website",
    liveUrl: "https://camperkunz.github.io/Loopstudios/",
};

export default loopstudios;
