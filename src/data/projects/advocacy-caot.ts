import { Project } from "@/types/portfolio";

const advocacyCaot: Project = {
    id: "advocacy-caot",
    title: "Advocacy Website for CAOT",
    shortDescription: "A website redesign and prototype for an advocacy initiative by CAOT, focusing on modernizing the brand and improving the structure and clarity of the content.",
    fullDescription:
        "This project involved designing and prototyping a new advocacy website for CAOT. Since the project had not yet been launched publicly, the main focus was on research, prototyping, and developing a strong visual direction for the platform. I worked primarily on the design side, rethinking the existing brand presentation and creating a clearer, more modern visual identity. After the design phase, I began implementing the website in Squarespace, using custom code and platform customization to match the design as closely as possible.",
    imageUrl: "/advocacy/advocacy.jpg", // ← this is the main image for the project, like a cover image
    overviewImageUrl: "", // ← inside the component, first
    year: "2025",
    category: "Web Design & Development",
    highlights: [
        "Designed the overall UI and layout for an advocacy-focused website",
        "Developed interactive prototypes to test structure and user flow",
        "Refined and modernized elements of the existing brand presentation",
        "Implemented the design in Squarespace with custom code and styling",
    ],
    problem: "The organization needed a dedicated advocacy website that would clearly communicate its mission, present information in a structured way, and align better with modern web design standards.",
    problemImageUrl: "/advocacy/advocacy-problem.jpg", // ← replace
    solution: "I designed a new visual direction for the website and created prototypes to establish clear page layouts and user flows. After finalizing the design approach, I began implementing the website in Squarespace, using custom code and platform customization to translate the design into a functional site.",
    solutionImageUrl: "/advocacy/advocacy-solution.jpg", // ← replace
    results: "The project produced a complete design and working site structure ready for launch, giving the organization a clearer and more modern platform for communicating its advocacy initiatives once published.",
    resultsImageUrl: "/advocacy/advocacy-results.jpg", // ← replace
    techStack: ["Squarespace", "Figma", "JavaScript", "HTML", "CSS"],
    liveUrl: "https://www.figma.com/proto/lnRSLrif5eREP6cWtG3tlB/Advocacy?page-id=0%3A1&node-id=0-188&viewport=474%2C376%2C0.11&t=ZRQUcjHabGhCNG7c-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=0%3A188",
};

export default advocacyCaot;
